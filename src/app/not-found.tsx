import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition">
            Go Home
          </Link>
          <Link href="/products" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:border-amber-500/50 transition">
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}