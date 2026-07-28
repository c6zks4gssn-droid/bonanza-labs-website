import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams;
  const sessionId = params?.session_id || "";
  return (
    <main className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl font-black mb-3">Betaling ontvangen</h1>
        <p className="text-gray-400 mb-6">
          Bedankt voor je aankoop. We hebben je betaling geregistreerd en nemen contact met je op.
        </p>
        {sessionId && (
          <div className="rounded-xl bg-black/30 border border-white/10 p-3 mb-6 text-xs font-mono text-gray-400 break-all">
            {sessionId}
          </div>
        )}
        <p className="text-sm text-gray-500 mb-8">
          Heb je vragen? Stuur een e-mail naar hello@bonanzalabs.com met je checkout-gegevens.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm">Terug naar home</Link>
          <Link href="/pricing" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-sm">Bekijk prijzen</Link>
        </div>
      </div>
    </main>
  );
}