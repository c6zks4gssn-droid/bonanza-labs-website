type SessionStatus = {
  payment_status: string;
  status: string | null;
} | null;

/** Presentation only: never infer payment from a return URL or session ID. */
export function paymentResult(session: SessionStatus) {
  if (session?.payment_status === "paid") {
    return { kind: "paid", title: "Betaling ontvangen", confirmed: true } as const;
  }
  if (session?.status === "complete" && session.payment_status === "unpaid") {
    return {
      kind: "pending",
      title: "Betaling wordt nog verwerkt",
      confirmed: false,
    } as const;
  }
  return {
    kind: "unverified",
    title: "Betaling niet bevestigd",
    confirmed: false,
  } as const;
}
