import { NextResponse } from "next/server";
import { isRedisConfigured } from "@/lib/server-store";

export const dynamic = "force-dynamic";

interface ServiceStatus {
  name: string;
  ok: boolean;
  required: boolean;
  detail: string;
}

function has(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  const stripeCheckoutConfigured = has("STRIPE_SECRET_KEY");
  const stripeWebhookConfigured =
    stripeCheckoutConfigured && has("STRIPE_WEBHOOK_SECRET") && isRedisConfigured;
  const resendConfigured =
    has("RESEND_API_KEY") &&
    has("RESEND_FROM_EMAIL") &&
    has("LEAD_NOTIFICATION_EMAIL");
  const adminConfigured = has("ADMIN_USERNAME") && has("ADMIN_PASSWORD");
  const publicContactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@bonanza-labs.com";
  const contactConfigured = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publicContactEmail);
  const voiceConfigured = has("NEXT_PUBLIC_ELEVENLABS_AGENT_ID");

  const services: ServiceStatus[] = [
    {
      name: "redis",
      ok: isRedisConfigured,
      required: true,
      detail: isRedisConfigured
        ? "Duurzame lead-, betaal- en rate-limitopslag is geconfigureerd."
        : "Upstash Redis REST is niet geconfigureerd.",
    },
    {
      name: "stripe-checkout",
      ok: stripeCheckoutConfigured,
      required: true,
      detail: stripeCheckoutConfigured
        ? "Stripe Checkout is geconfigureerd."
        : "Stripe Checkout is niet geconfigureerd.",
    },
    {
      name: "stripe-webhook",
      ok: stripeWebhookConfigured,
      required: true,
      detail: stripeWebhookConfigured
        ? "Stripe-webhook en duurzame idempotency zijn geconfigureerd."
        : "Stripe-webhooksecret of duurzame betaalopslag ontbreekt.",
    },
    {
      name: "admin",
      ok: adminConfigured,
      required: true,
      detail: adminConfigured
        ? "Basic Auth voor adminroutes is geconfigureerd."
        : "Admingebruikersnaam of -wachtwoord ontbreekt.",
    },
    {
      name: "resend",
      ok: resendConfigured,
      required: true,
      detail: resendConfigured
        ? "Leadnotificaties zijn geconfigureerd."
        : "Resend of het notificatieadres is niet volledig geconfigureerd.",
    },
    {
      name: "contact",
      ok: contactConfigured,
      required: true,
      detail: contactConfigured
        ? "Het publieke e-mailadres is geconfigureerd."
        : "Het publieke e-mailadres ontbreekt.",
    },
    {
      name: "bonanza-voice",
      ok: voiceConfigured,
      required: true,
      detail: voiceConfigured
        ? "De ElevenLabs-agent is geconfigureerd."
        : "De ElevenLabs-agent-id ontbreekt.",
    },
  ];

  const missing = services
    .filter((service) => service.required && !service.ok)
    .map((service) => service.name);
  const ready = missing.length === 0;

  return NextResponse.json(
    {
      status: ready ? "ready" : "degraded",
      timestamp: new Date().toISOString(),
      services,
      missing,
      guidance: ready
        ? "Alle vereiste productieservices zijn geconfigureerd. Voer nu de end-to-end smoke test uit."
        : "Configureer de ontbrekende services voor Preview en Production en deploy opnieuw.",
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
