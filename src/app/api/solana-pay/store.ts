// Shared payment reference store for Solana Pay
// In development, this is in-memory per server instance
// In production, replace with Vercel KV or a database

export interface PaymentRecord {
  product: string;
  amount: number; // in cents (EUR)
  amountSOL: number;
  createdAt: number;
  status: "pending" | "verified" | "expired";
}

// Use a global to persist across hot reloads in development
const globalStore = globalThis as unknown as { __solanaPayStore?: Map<string, PaymentRecord> };

if (!globalStore.__solanaPayStore) {
  globalStore.__solanaPayStore = new Map<string, PaymentRecord>();
}

export const paymentReferences: Map<string, PaymentRecord> = globalStore.__solanaPayStore;