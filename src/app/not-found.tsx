import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Pagina niet gevonden</h1>
        <p className="text-gray-400 mb-8">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition">
            Terug naar home
          </Link>
          <Link href="/pricing" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:border-violet-500/50 transition">
            Bekijk prijzen
          </Link>
        </div>
      </div>
    </div>
  );
}