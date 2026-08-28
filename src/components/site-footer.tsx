import Link from "next/link";
import { businessDetails } from "@/lib/business-details";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo-256.png" alt="BonanzaLabs" className="h-7 w-7 rounded" />
            <span className="font-bold">BonanzaLabs</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
            Praktische automatisering voor Nederlandse MKB-bedrijven. We beginnen klein,
            meten wat werkt en breiden pas uit als daar bewijs voor is.
          </p>
          <p className="mt-4 text-xs text-white/35">
            Groningen · KvK {businessDetails.kvkNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Oplossingen</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/55">
            <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <Link href="/bonanza-voice" className="hover:text-white">Bonanza Voice</Link>
            <Link href="/oplossingen" className="hover:text-white">Alle oplossingen</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Bedrijf</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/55">
            <Link href="/over-ons" className="hover:text-white">Over ons</Link>
            <Link href="/portfolio" className="hover:text-white">Portfolio</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
