import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bonanza Labs — Open Source AI Tools for Builders",
  description: "The spending firewall for AI agents. Repo health checks, video generation, agent orchestration, and more. All open source.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050508] text-white antialiased">{children}</body>
    </html>
  );
}