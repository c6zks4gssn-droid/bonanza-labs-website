import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getStripeProduct } from "@/lib/stripe-products";
import {
  acquireLock,
  isRedisConfigured,
  redisCommand,
  storeJsonRecord,
} from "@/lib/server-store";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 7;
const RECORD_TTL_SECONDS = 60 * 60 * 24 * 365 * 7;

const handledEvents = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "invoice.paid",
  "invoice.payment_failed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

async function processOnce(event: Stripe.Event, work: () => Promise<void>) {
  const lockKey = `stripe:event:${event.id}`;
  const acquired = await acquireLock(lockKey, EVENT_TTL_SECONDS);

  if (!acquired) return false;

  try {
    await work();
    return true;
  } catch (error) {
    // A failed write must remain retryable when Stripe sends the event again.
    await redisCommand("DEL", lockKey).catch((unlockError) => {
      console.error("Could not release Stripe event lock", unlockError);
    });
    throw error;
  }
}

async function storeCheckoutSession(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const productId = session.metadata?.product_id || "";
  const product = getStripeProduct(productId);

  if (!product) {
    console.error("Unknown Stripe product metadata", {
      eventId: event.id,
      sessionId: session.id,
      productId,
    });
    throw new Error("Unknown Stripe product");
  }

  // Compare the pre-tax subtotal. amount_total can be higher when Stripe Tax is enabled.
  if (session.amount_subtotal !== product.amount) {
    console.error("Stripe subtotal mismatch", {
      eventId: event.id,
      sessionId: session.id,
      productId,
      expectedAmount: product.amount,
      receivedSubtotal: session.amount_subtotal,
    });
    throw new Error("Stripe subtotal mismatch");
  }

  const paymentRecord = {
    eventId: event.id,
    eventType: event.type,
    sessionId: session.id,
    productId,
    productName: session.metadata?.product_name || product.name,
    offerType: session.metadata?.offer_type || product.offerType,
    durationDays: session.metadata?.duration_days || null,
    subtotal: session.amount_subtotal,
    tax: session.total_details?.amount_tax || 0,
    total: session.amount_total,
    currency: session.currency,
    mode: session.mode,
    paymentStatus: session.payment_status,
    customerId: session.customer,
    customerEmail: session.customer_details?.email || session.customer_email || null,
    customerName: session.customer_details?.name || null,
    invoiceId: session.invoice,
    createdAt: new Date(session.created * 1000).toISOString(),
    processedAt: new Date().toISOString(),
  };

  await storeJsonRecord({
    key: `stripe:payment:${session.id}`,
    value: paymentRecord,
    ttlSeconds: RECORD_TTL_SECONDS,
    recentList: "stripe:payments:recent",
    recentValue: session.id,
    recentLimit: 1000,
  });

  console.log("Stripe payment stored", {
    eventId: event.id,
    sessionId: session.id,
    productId,
    paymentStatus: session.payment_status,
  });
}

async function storePaymentFailure(event: Stripe.Event, session: Stripe.Checkout.Session) {
  await storeJsonRecord({
    key: `stripe:payment-failure:${session.id}`,
    value: {
      eventId: event.id,
      eventType: event.type,
      sessionId: session.id,
      productId: session.metadata?.product_id || null,
      customerId: session.customer,
      customerEmail: session.customer_details?.email || session.customer_email || null,
      paymentStatus: session.payment_status,
      createdAt: new Date(session.created * 1000).toISOString(),
      processedAt: new Date().toISOString(),
    },
    ttlSeconds: RECORD_TTL_SECONDS,
    recentList: "stripe:payment-failures:recent",
    recentValue: session.id,
    recentLimit: 1000,
  });
}

async function storeInvoiceEvent(event: Stripe.Event, invoice: Stripe.Invoice) {
  await storeJsonRecord({
    key: `stripe:invoice:${invoice.id}`,
    value: {
      eventId: event.id,
      eventType: event.type,
      invoiceId: invoice.id,
      customerId: invoice.customer,
      status: invoice.status,
      billingReason: invoice.billing_reason,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      currency: invoice.currency,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      createdAt: new Date(invoice.created * 1000).toISOString(),
      processedAt: new Date().toISOString(),
    },
    ttlSeconds: RECORD_TTL_SECONDS,
    recentList: "stripe:invoices:recent",
    recentValue: invoice.id,
    recentLimit: 1000,
  });
}

async function storeSubscriptionEvent(
  event: Stripe.Event,
  subscription: Stripe.Subscription,
) {
  await storeJsonRecord({
    key: `stripe:subscription:${subscription.id}`,
    value: {
      eventId: event.id,
      eventType: event.type,
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at,
      canceledAt: subscription.canceled_at,
      metadata: subscription.metadata,
      createdAt: new Date(subscription.created * 1000).toISOString(),
      processedAt: new Date().toISOString(),
    },
    ttlSeconds: RECORD_TTL_SECONDS,
    recentList: "stripe:subscriptions:recent",
    recentValue: subscription.id,
    recentLimit: 1000,
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    if (!isRedisConfigured) {
      console.error("Upstash Redis is required for durable Stripe idempotency");
      return NextResponse.json({ error: "Payment storage not configured" }, { status: 503 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error("Webhook signature verification failed", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (!handledEvents.has(event.type)) {
      return NextResponse.json({ received: true, ignored: event.type });
    }

    const processed = await processOnce(event, async () => {
      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.payment_status !== "paid") return;
          await storeCheckoutSession(event, session);
          break;
        }
        case "checkout.session.async_payment_failed":
          await storePaymentFailure(event, event.data.object as Stripe.Checkout.Session);
          break;
        case "invoice.paid":
        case "invoice.payment_failed":
          await storeInvoiceEvent(event, event.data.object as Stripe.Invoice);
          break;
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await storeSubscriptionEvent(event, event.data.object as Stripe.Subscription);
          break;
      }
    });

    return NextResponse.json({
      received: true,
      eventType: event.type,
      duplicate: !processed,
    });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "BonanzaLabs Stripe Webhook",
    configured: Boolean(isStripeConfigured && STRIPE_WEBHOOK_SECRET && isRedisConfigured),
    events: [...handledEvents],
  });
}
