export interface BetaalRecord {
  eventId?: string;
  eventType?: string;
  sessionId?: string;
  productId?: string;
  productName?: string;
  offerType?: string;
  durationDays?: string | null;
  subtotal?: number;
  tax?: number;
  total?: number;
  currency?: string;
  mode?: string;
  paymentStatus?: string;
  customerId?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  invoiceId?: string | null;
  createdAt?: string;
  processedAt?: string;
}

export interface MislukteBetalingRecord {
  eventId?: string;
  eventType?: string;
  sessionId?: string;
  productId?: string | null;
  customerId?: string | null;
  customerEmail?: string | null;
  paymentStatus?: string;
  createdAt?: string;
  processedAt?: string;
}

export interface FactuurRecord {
  eventId?: string;
  eventType?: string;
  invoiceId?: string;
  customerId?: string | null;
  status?: string | null;
  billingReason?: string | null;
  amountDue?: number;
  amountPaid?: number;
  amountRemaining?: number;
  currency?: string;
  hostedInvoiceUrl?: string | null;
  createdAt?: string;
  processedAt?: string;
}

export interface AbonnementRecord {
  eventId?: string;
  eventType?: string;
  subscriptionId?: string;
  customerId?: string | null;
  status?: string;
  cancelAtPeriodEnd?: boolean;
  cancelAt?: number | null;
  canceledAt?: number | null;
  metadata?: Record<string, string>;
  createdAt?: string;
  processedAt?: string;
}

export function formatteerBedrag(
  centen: number | null | undefined,
  valuta?: string,
): string {
  if (typeof centen !== "number" || !Number.isFinite(centen)) {
    return "—";
  }

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: (valuta ?? "EUR").toUpperCase(),
  }).format(centen / 100);
}

export function formatteerDatum(
  waarde: string | number | null | undefined,
): string {
  if (waarde === null || waarde === undefined) {
    return "—";
  }

  const date =
    typeof waarde === "number" ? new Date(waarde * 1000) : new Date(waarde);

  if (isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(date);
}
