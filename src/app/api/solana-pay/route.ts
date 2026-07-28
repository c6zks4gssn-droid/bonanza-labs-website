import { NextRequest, NextResponse } from "next/server";
import { paymentReferences, type PaymentRecord } from "./store";

// Solana Pay checkout — generates a Solana Pay URL for crypto payments
// Requires: SOLANA_PAY_RECEIVER env var (your Solana wallet address)

const SOLANA_PAY_RECEIVER = process.env.SOLANA_PAY_RECEIVER || "";
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

const PRODUCTS: Record<string, { name: string; amount: number }> = {
  "tradeflow-pilot": { name: "TradeFlow Pilot", amount: 89500 }, // €895 in cents
  "serveflow-pilot": { name: "ServeFlow Pilot", amount: 89500 },
  "bonanza-voice-setup": { name: "Bonanza Voice Setup", amount: 149500 },
  "tradeflow-onderhoud": { name: "TradeFlow Onderhoud (maand)", amount: 19700 },
  "serveflow-onderhoud": { name: "ServeFlow Onderhoud (maand)", amount: 19700 },
  "bonanza-voice-onderhoud": { name: "Bonanza Voice Onderhoud (maand)", amount: 29700 },
};

// Generate a unique payment reference
function generateReference(product: string): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BL-${product}-${Date.now()}-${randomPart}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product } = body;

    if (!product) {
      return NextResponse.json({ error: "Missing product" }, { status: 400 });
    }

    const productConfig = PRODUCTS[product];
    if (!productConfig) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    if (!SOLANA_PAY_RECEIVER) {
      return NextResponse.json({ error: "Solana Pay not configured" }, { status: 503 });
    }

    // Generate a unique payment reference
    const reference = generateReference(product);

    // Convert EUR cents to SOL (rough conversion rate: ~150 EUR/SOL)
    const amountSOL = parseFloat((productConfig.amount / 100 / 150).toFixed(4));

    // Store the payment reference
    const record: PaymentRecord = {
      product,
      amount: productConfig.amount,
      amountSOL,
      createdAt: Date.now(),
      status: "pending",
    };
    paymentReferences.set(reference, record);

    // Generate a Solana Pay URL with the unique reference in the memo
    // Format: solana:<receiver>?amount=<amount>&label=<label>&message=<message>&memo=<memo>
    const label = encodeURIComponent("Bonanza Labs");
    const message = encodeURIComponent(productConfig.name);
    const memo = encodeURIComponent(reference);

    const solanaPayUrl = `solana:${SOLANA_PAY_RECEIVER}?amount=${amountSOL}&label=${label}&message=${message}&memo=${memo}`;

    // Also generate a QR code URL for the frontend
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(solanaPayUrl)}`;

    return NextResponse.json({
      solanaPayUrl,
      qrUrl,
      reference,
      product: productConfig.name,
      amount: productConfig.amount,
      amountSOL,
      currency: "EUR",
      receiver: SOLANA_PAY_RECEIVER,
      verifyUrl: "/api/solana-pay/verify",
    });
  } catch (e) {
    console.error("Solana Pay error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "Bonanza Labs Solana Pay",
    configured: !!SOLANA_PAY_RECEIVER,
    products: Object.keys(PRODUCTS),
    pendingPayments: Array.from(paymentReferences.entries()).filter(([, r]) => r.status === "pending").length,
  });
}