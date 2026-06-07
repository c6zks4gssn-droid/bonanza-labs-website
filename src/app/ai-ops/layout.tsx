import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Ops — Automate Your Business Operations | Bonanza Labs',
  description: 'AI automation services for local businesses. Lead generation, social media, customer support, content SEO — all on autopilot. €497/mo. Based in the Netherlands.',
  alternates: { canonical: 'https://bonanza-labs.com/ai-ops' },
  openGraph: {
    title: 'AI Ops — Automate Your Business Operations | Bonanza Labs',
    description: 'AI automation services for local businesses. €497/mo. Lead gen, social media, support, SEO — all on autopilot.',
    url: 'https://bonanza-labs.com/ai-ops',
    type: 'website',
  },
};

export default function AIOpsLayout({ children }: { children: React.ReactNode }) {
  return children;
}