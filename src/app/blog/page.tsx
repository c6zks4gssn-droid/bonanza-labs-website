import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Sparkles } from "lucide-react";
import { blogPosts, type BlogAccent } from "@/data/blog-posts";

const accentStyles: Record<BlogAccent, { border: string; glow: string; text: string; badge: string }> = {
  cyan: {
    border: "hover:border-cyan-300/40",
    glow: "from-cyan-500/20 via-blue-500/10 to-transparent",
    text: "text-cyan-300",
    badge: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  },
  amber: {
    border: "hover:border-amber-300/40",
    glow: "from-amber-500/20 via-orange-500/10 to-transparent",
    text: "text-amber-300",
    badge: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  },
  violet: {
    border: "hover:border-violet-300/40",
    glow: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    text: "text-violet-300",
    badge: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  },
  emerald: {
    border: "hover:border-emerald-300/40",
    glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    text: "text-emerald-300",
    badge: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  },
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  const featuredStyle = accentStyles[featured.accent];

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <header className="border-b border-white/10 bg-[#070A12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-bold tracking-tight">BonanzaLabs</Link>
          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <Link href="/tradeflow" className="hover:text-white">TradeFlow</Link>
            <Link href="/serveflow" className="hover:text-white">ServeFlow</Link>
            <Link href="/bonanza-voice" className="hover:text-white">Bonanza Voice</Link>
            <Link href="/pricing" className="hover:text-white">Prijzen</Link>
            <Link href="/contact" className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-[#1D4ED8]">Flow Assessment</Link>
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white">Prijzen</Link>
            <Link href="/contact" className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]">Contact</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10 px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            <BookOpen className="h-4 w-4" /> Praktische kennis voor het MKB
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Geen AI-hype. Wel betere processen.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Heldere artikelen over offertes, reserveringen, bereikbaarheid en automatisering — geschreven voor ondernemers die minder handwerk willen zonder de controle kwijt te raken.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Link href={`/blog/${featured.slug}`} className={`group relative block overflow-hidden rounded-3xl border border-white/10 bg-[#0D1220] p-8 transition ${featuredStyle.border} md:p-12`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${featuredStyle.glow} opacity-80`} />
          <div className="relative grid gap-10 md:grid-cols-[1.4fr_0.6fr] md:items-end">
            <div>
              <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${featuredStyle.badge}`}>{featured.category}</div>
              <h2 className="mt-6 text-3xl font-black leading-tight md:text-5xl">{featured.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">{featured.description}</p>
            </div>
            <div className="md:text-right">
              <div className="flex items-center gap-2 text-sm text-slate-400 md:justify-end"><Clock className="h-4 w-4" /> {featured.readTime}</div>
              <div className={`mt-5 inline-flex items-center gap-2 font-semibold ${featuredStyle.text}`}>Lees artikel <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
            </div>
          </div>
        </Link>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {rest.map((post) => {
            const style = accentStyles[post.accent];
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={`group relative flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1220] p-7 transition ${style.border}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} opacity-60`} />
                <div className="relative flex h-full flex-col">
                  <div className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}>{post.category}</div>
                  <h2 className="mt-6 text-2xl font-black leading-snug">{post.title}</h2>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400">{post.description}</p>
                  <div className="mt-8 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4" /> {post.readTime}</span>
                    <span className={`flex items-center gap-2 font-semibold ${style.text}`}>Lees <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-cyan-950/20 via-blue-950/20 to-violet-950/20 px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Sparkles className="h-7 w-7 text-cyan-300" />
          <h2 className="mt-5 text-3xl font-black">Welk proces kost jou elke week tijd?</h2>
          <p className="mt-4 max-w-2xl text-slate-300">Met een Flow Assessment brengen we het probleem, de mogelijke oplossing en de verwachte impact concreet in kaart.</p>
          <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-semibold hover:bg-[#1D4ED8]">Bekijk het Flow Assessment <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>© 2026 BonanzaLabs</p>
          <div className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/" className="hover:text-white">Home</Link></div>
        </div>
      </footer>
    </main>
  );
}
