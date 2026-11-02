import Link from "next/link";
import Image from "next/image";
import { businessDetails } from "@/lib/business-details";

export default function SiteFooter({ light = true }: { light?: boolean }) {
  if(light) return <footer className="bl-footer"><div className="bl-container bl-footer-inner"><div><Link className="bl-brand" href="/"><Image src="/logo-mark-256.png" alt="" width={32} height={32}/>BonanzaLabs</Link><p>Groningen · KvK {businessDetails.kvkNumber} · btw {businessDetails.vatNumber}</p></div><div className="bl-footer-links"><a href={`mailto:${businessDetails.contactEmail}`}>{businessDetails.contactEmail}</a><Link href="/privacy">Privacy</Link><Link href="/voorwaarden">Voorwaarden</Link><Link href="/cookies">Cookies</Link><Link href="/verwerkersovereenkomst">Verwerkersovereenkomst</Link><Link href="/contact">Contact</Link><a href="https://www.youtube.com/@Bonanza-Labs" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{display:"inline",verticalAlign:"-2px",marginRight:6}}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>YouTube</a></div></div></footer>;
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo-mark-256.png" alt="BonanzaLabs" className="h-7 w-7 rounded" />
            <span className="font-bold">BonanzaLabs</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
            Praktische automatisering voor Nederlandse MKB-bedrijven. We beginnen klein,
            meten wat werkt en breiden pas uit als daar bewijs voor is.
          </p>
          <p className="mt-4 text-xs text-white/35">
            Groningen · KvK {businessDetails.kvkNumber} · btw {businessDetails.vatNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Oplossingen</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/55">
            <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <Link href="/onderhoudsherinneringen" className="hover:text-white">TradeFlow Onderhoud</Link>
            <Link href="/bonanza-voice" className="hover:text-white">Bonanza Voice</Link>
            <Link href="/oplossingen" className="hover:text-white">Alle oplossingen</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Bedrijf</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/55">
            <Link href="/over-ons" className="hover:text-white">Over ons</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <a href="https://www.youtube.com/@Bonanza-Labs" target="_blank" rel="noopener noreferrer" className="hover:text-white"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{display:"inline",verticalAlign:"-2px",marginRight:6}}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>YouTube</a>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/voorwaarden" className="hover:text-white">Voorwaarden</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/verwerkersovereenkomst" className="hover:text-white">Verwerkersovereenkomst</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
