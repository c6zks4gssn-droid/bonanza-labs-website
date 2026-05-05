import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams;
  const sessionId = params?.session_id || "";
  return (
    <main className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl font-black mb-3">Payment received</h1>
        <p className="text-gray-400 mb-6">
          Thanks for upgrading. We logged the checkout session and will activate access from the fulfillment queue.
        </p>
        {sessionId && (
          <div className="rounded-xl bg-black/30 border border-white/10 p-3 mb-6 text-xs font-mono text-gray-400 break-all">
            {sessionId}
          </div>
        )}
        <p className="text-sm text-gray-500 mb-8">
          If you need faster activation, email passiveassets@proton.me with your checkout email and session ID.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/products" className="px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm">Browse Products</Link>
          <Link href="/frameforge" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-sm">Try FrameForge</Link>
        </div>
      </div>
    </main>
  );
}
