import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { blogPosts, getBlogPost, type BlogAccent } from "@/data/blog-posts";

const accentStyles: Record<BlogAccent, { text: string; badge: string; border: string; glow: string; callout: string }> = {
  cyan: {
    text: "text-cyan-300",
    badge: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
    border: "border-cyan-300/20",
    glow: "from-cyan-500/15 via-blue-500/5 to-transparent",
    callout: "border-cyan-300/30 bg-cyan-300/10 text-cyan-50",
  },
  amber: {
    text: "text-amber-300",
    badge: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    border: "border-amber-300/20",
    glow: "from-amber-500/15 via-orange-500/5 to-transparent",
    callout: "border-amber-300/30 bg-amber-300/10 text-amber-50",
  },
  violet: {
    text: "text-violet-300",
    badge: "border-violet-300/25 bg-violet-300/10 text-violet-200",
    border: "border-violet-300/20",
    glow: "from-violet-500/15 via-fuchsia-500/5 to-transparent",
    callout: "border-violet-300/30 bg-violet-300/10 text-violet-50",
  },
  emerald: {
    text: "text-emerald-300",
    badge: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    border: "border-emerald-300/20",
    glow: "from-emerald-500/15 via-teal-500/5 to-transparent",
    callout: "border-emerald-300/30 bg-emerald-300/10 text-emerald-50",
  },
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `https://www.bonanza-labs.com/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const style = accentStyles[post.accent];
  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "BonanzaLabs" },
    publisher: {
      "@type": "Organization",
      name: "BonanzaLabs",
      logo: { "@type": "ImageObject", url: "https://www.bonanza-labs.com/logo-256.png" },
    },
    mainEntityOfPage: `https://www.bonanza-labs.com/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="border-b border-white/10 bg-[#070A12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-bold tracking-tight">BonanzaLabs</Link>
          <div className="flex items-center gap-5 text-sm text-slate-400">
            <Link href="/blog" className="hover:text-white">Kennisbank</Link>
            <Link href="/pricing" className="rounded-xl bg-[#2563EB] px-4 py-2 font-semibold text-white hover:bg-[#1D4ED8]">Flow Assessment</Link>
          </div>
        </div>
      </header>

      <article>
        <section className="relative overflow-hidden border-b border-white/10 px-6 py-20 md:py-28">
          <div className={`absolute inset-0 bg-gradient-to-br ${style.glow}`} />
          <div className="relative mx-auto max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Terug naar de kennisbank</Link>
            <div className={`mt-8 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}>{post.category}</div>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-6xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">{post.description}</p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(post.updatedAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.readTime}</span>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="max-w-3xl">
            <p className={`border-l-2 pl-6 text-xl font-medium leading-relaxed text-slate-200 ${style.border}`}>{post.intro}</p>

            <div className="mt-14 space-y-14">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-black tracking-tight md:text-3xl">{section.heading}</h2>
                  <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.bullets && (
                    <ul className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-slate-300"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} /> {bullet}</li>
                      ))}
                    </ul>
                  )}
                  {section.callout && <div className={`mt-6 rounded-2xl border p-6 text-base font-medium leading-7 ${style.callout}`}>{section.callout}</div>}
                </section>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#0D1220] p-6 lg:sticky lg:top-8">
            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${style.text}`}>Volgende stap</p>
            <h2 className="mt-4 text-xl font-black">Maak je proces concreet</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Tijdens een Flow Assessment brengen we knelpunten, kansen en een realistische implementatievolgorde in kaart.</p>
            <Link href="/pricing" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold hover:bg-[#1D4ED8]">Bekijk de opties <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      </article>

      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black">Lees ook</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-2xl border border-white/10 bg-[#0D1220] p-6 hover:border-white/25">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.category}</p>
                <h3 className="mt-3 text-xl font-bold group-hover:text-cyan-200">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row"><p>© 2026 BonanzaLabs</p><div className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/blog" className="hover:text-white">Kennisbank</Link></div></div>
      </footer>
    </main>
  );
}
