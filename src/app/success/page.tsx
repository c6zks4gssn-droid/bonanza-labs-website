import Link from "next/link";
import { CheckCircle2, ClipboardList, Mail, ShieldCheck } from "lucide-react";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

async function getSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  if (!isStripeConfigured || !sessionId.startsWith("cs_")) return null;

  try {
    return await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Could not retrieve Stripe session:", error);
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params?.session_id || "";
  const session = await getSession(sessionId);
  const productId = session?.metadata?.product_id || "";
  const isPilot = productId === "serveflow-pilot-14-days";
  const paymentConfirmed = session?.payment_status === "paid";

  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center md:p-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
          <h1 className="mt-5 text-3xl font-black md:text-4xl">
            {paymentConfirmed ? "Betaling ontvangen" : "Checkout afgerond"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/60">
            {isPilot
              ? "Bedankt voor het boeken van de ServeFlow 14-dagen pilot. De pilotperiode start niet vandaag, maar pas wanneer de afgesproken reserveringsflow live staat."
              : "Bedankt. We nemen contact op om de intake en planning af te stemmen."}
          </p>
        </div>

        {isPilot && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-[#0D1220] p-8">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-amber-300" />
              <h2 className="text-2xl font-black">Wat gebeurt er nu?</h2>
            </div>
            <ol className="mt-6 space-y-5 text-sm leading-relaxed text-white/65">
              <li><strong className="text-white">1. Intake:</strong> we nemen contact op om locatie, huidige reserveringsroute en gewenste berichten vast te leggen.</li>
              <li><strong className="text-white">2. Schriftelijke scope:</strong> vóór inrichting bevestigen we welke ene reserveringsflow onder de pilot valt.</li>
              <li><strong className="text-white">3. Inrichting en controle:</strong> BonanzaLabs bouwt de flow en jij controleert de inhoud voordat die live gaat.</li>
              <li><strong className="text-white">4. Veertien dagen meten:</strong> de pilotperiode begint op de afgesproken livegangsdatum.</li>
              <li><strong className="text-white">5. Evaluatie:</strong> daarna besluiten we samen of stoppen, aanpassen of uitbreiden zinvol is. Er is geen automatische verlenging.</li>
            </ol>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/5 p-8">
          <ShieldCheck className="h-6 w-6 text-amber-300" />
          <h2 className="mt-4 text-xl font-black">Belangrijk</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            De ServeFlow-pilot garandeert geen omzet, reserveringsvolume of specifieke daling van no-shows. Kunnen wij de vooraf schriftelijk afgesproken flow niet werkend opleveren, dan geldt de leveringsgarantie uit de voorwaarden.
          </p>
          <Link href="/voorwaarden" className="mt-4 inline-flex text-sm font-semibold text-amber-300 hover:text-amber-200">
            Bekijk de voorwaarden →
          </Link>
        </section>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <Mail className="mx-auto h-5 w-5 text-cyan-300" />
          <p className="mt-3 text-sm text-white/55">
            Vragen over je boeking? Mail naar <a href="mailto:info@bonanza-labs.com" className="text-cyan-300 underline">info@bonanza-labs.com</a>.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold hover:bg-[#1D4ED8]">Terug naar home</Link>
          <Link href="/serveflow" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/5">Bekijk ServeFlow</Link>
        </div>
      </div>
    </main>
  );
}
