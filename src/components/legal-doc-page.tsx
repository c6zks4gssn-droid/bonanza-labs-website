import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import LegalConceptNote from "@/components/legal-concept-note";
import { ArrowLeft } from "lucide-react";

export type LegalSection = { title: string; paragraphs: string[] };

export default function LegalDocPage({ eyebrow, title, intro, updated, sections, children }: {
  eyebrow: string; title: string; intro: string; updated: string; sections: LegalSection[]; children?: React.ReactNode;
}) {
  return (
    <main id="main-content" className="light-site light-subpage min-h-screen">
      <SiteNav />
      <section className="border-b border-white/10 bg-gradient-to-br from-blue-950/30 via-[#070A12] to-cyan-950/20 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Terug naar home</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-cyan-200">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{intro}</p>
          <p className="mt-5 text-sm text-slate-500">Laatst bijgewerkt: {updated}</p>
          <LegalConceptNote />
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-6 py-16">
        {children}
        <div className="mt-12 space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-2xl font-black">{s.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-300">
                {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
