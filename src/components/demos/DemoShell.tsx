import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import "./demos.css";

export default function DemoShell({ badge, title, intro, productHref, productLabel, children }: { badge: string; title: string; intro: string; productHref: string; productLabel: string; children: React.ReactNode }) {
  return (
    <main id="main-content" className="light-site light-subpage min-h-screen">
      <SiteNav />
      <section className="px-6 pb-10 pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="dm-badge">{badge} · Demo met voorbeeldgegevens</div>
          <h1 className="mt-7 text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">{intro}</p>
        </div>
      </section>
      <section className="px-4 pb-16 sm:px-6">{children}</section>
      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black md:text-3xl">Wilt u dit voor uw eigen bedrijf?</h2>
          <p className="mt-4 text-gray-400">We bespreken eerst uw huidige werkwijze en richten daarna één afgesproken flow in.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-black hover:bg-amber-300" data-cta="demo-contact">Neem contact op <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href={productHref} className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5" data-cta="demo-product">{productLabel}</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
