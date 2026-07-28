import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const SOLANA_PAY_RECEIVER = process.env.SOLANA_PAY_RECEIVER || "";

// In-memory reference store (for development)
// In production, use Vercel KV or a database
import { paymentReferences } from "../store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ verified: false, reason: "Missing reference" }, { status: 400 });
    }

    // Look up the payment record
    const record = paymentReferences.get(reference);

    if (!record) {
      return NextResponse.json({ verified: false, reason: "Unknown reference" }, { status: 404 });
    }

    // Check if already verified
    if (record.status === "verified") {
      return NextResponse.json({ verified: true, reference, product: record.product, alreadyVerified: true });
    }

    // Check expiry (24 hours)
    const ageMs = Date.now() - record.createdAt;
    if (ageMs > 24 * 60 * 60 * 1000) {
      record.status = "expired";
      return NextResponse.json({ verified: false, reason: "Reference expired" });
    }

    if (!SOLANA_PAY_RECEIVER) {
      return NextResponse.json({ error: "Solana Pay not configured" }, { status: 503 });
    }

    // Connect to Solana RPC
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const receiverPubkey = new PublicKey(SOLANA_PAY_RECEIVER);

    // Look up the transaction by reference (memo)
    // Solana Pay uses the reference as a memo in the transaction
    // We search for recent signatures for the receiver address
    try {
      const signatures = await connection.getSignaturesForAddress(receiverPubkey, { limit: 20 });

      let found = false;

      for (const sigInfo of signatures) {
        if (!sigInfo.confirmationStatus || sigInfo.confirmationStatus === "processed") {
          continue;
        }

        // Get the full transaction — use legacy version to get instructions
        const tx = await connection.getTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!tx) continue;

        // Extract memo text from the transaction
        // For versioned transactions, we need to handle both Message and MessageV0
        let memoText = "";
        try {
          const message = tx.transaction.message as unknown as {
            instructions?: Array<{ data?: string }>;
            staticAccountKeys?: PublicKey[];
            accountKeys?: PublicKey[];
          };
          const instructions = message.instructions || [];
          for (const ix of instructions) {
            if (ix.data) {
              try {
                const decoded = Buffer.from(ix.data, "base64").toString("utf-8");
                memoText += decoded + " ";
              } catch {
                // Not a text instruction, skip
              }
            }
          }
        } catch {
          // Could not extract memo, skip this transaction
          continue;
        }

        if (!memoText.includes(reference)) {
          continue;
        }

        // Verify the transaction is confirmed
        if (sigInfo.err) {
          console.error(`Transaction ${sigInfo.signature} has error:`, sigInfo.err);
          continue;
        }

        found = true;

        // Get account keys from the transaction (works for both legacy and versioned)
        const message = tx.transaction.message as unknown as {
          staticAccountKeys?: PublicKey[];
          accountKeys?: PublicKey[];
        };
        const accountKeys: PublicKey[] = message.staticAccountKeys || message.accountKeys || [];

        // Verify the receiver is in the transaction
        const receiverInTx = accountKeys.some((key: PublicKey) => key.equals(receiverPubkey));

        if (!receiverInTx) {
          console.error("Receiver not found in transaction account keys");
          continue;
        }

        // Verify the amount
        const expectedAmountSOL = record.amountSOL;

        // For native SOL transfers, check postBalances vs preBalances
        if (tx.meta && tx.meta.preBalances && tx.meta.postBalances) {
          const receiverIndex = accountKeys.findIndex((key: PublicKey) => key.equals(receiverPubkey));

          if (receiverIndex >= 0) {
            const preBalance = tx.meta.preBalances[receiverIndex];
            const postBalance = tx.meta.postBalances[receiverIndex];
            const fee = tx.meta.fee || 0;
            const received = (postBalance - preBalance + (receiverIndex === 0 ? fee : 0)) / 1e9;

            console.log(`Transaction ${sigInfo.signature}: received ${received} SOL, expected ${expectedAmountSOL} SOL`);

            if (Math.abs(received - expectedAmountSOL) < 0.001) {
              record.status = "verified";
              console.log(`✅ Payment verified: reference=${reference}, product=${record.product}, amount=${received}SOL`);

              return NextResponse.json({
                verified: true,
                reference,
                product: record.product,
                amountEUR: record.amount,
                amountSOL: received,
                signature: sigInfo.signature,
              });
            } else {
              console.error(`Amount mismatch: received ${received}, expected ${expectedAmountSOL}`);
            }
          }
        }

        // For SPL token transfers, check postTokenBalances
        if (tx.meta && tx.meta.postTokenBalances && tx.meta.preTokenBalances) {
          const receiverTokenBalance = tx.meta.postTokenBalances.find((b) => {
            const key = accountKeys[b.accountIndex];
            return key && key.equals(receiverPubkey);
          });

          if (receiverTokenBalance) {
            const preTokenBalance = tx.meta.preTokenBalances?.find(
              (b) => b.accountIndex === receiverTokenBalance.accountIndex
            );

            const preAmount = preTokenBalance ? parseFloat((preTokenBalance as { uiAmount?: string | number }).uiAmount?.toString() || "0") : 0;
            const postAmount = parseFloat((receiverTokenBalance as { uiAmount?: string | number }).uiAmount?.toString() || "0");
            const received = postAmount - preAmount;

            console.log(`Token transfer: received ${received}, expected ${expectedAmountSOL}`);

            if (Math.abs(received - expectedAmountSOL) < 0.001) {
              record.status = "verified";
              console.log(`✅ Token payment verified: reference=${reference}, product=${record.product}`);

              return NextResponse.json({
                verified: true,
                reference,
                product: record.product,
                amountEUR: record.amount,
                amountSOL: received,
                signature: sigInfo.signature,
              });
            }
          }
        }

        console.error(`Found transaction with matching reference but could not verify amount`);
      }

      if (!found) {
        return NextResponse.json({
          verified: false,
          reason: "No matching transaction found. The payment may not yet be confirmed.",
        });
      }

      return NextResponse.json({
        verified: false,
        reason: "Transaction found but amount verification failed",
      });
    } catch (rpcErr) {
      console.error("Solana RPC error:", rpcErr);
      return NextResponse.json(
        { verified: false, reason: "Failed to query Solana RPC" },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("Solana Pay verify error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "Bonanza Labs Solana Pay Verify",
    configured: !!SOLANA_PAY_RECEIVER,
  });
}
