import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FrameForge — AI Video Generator",
  description: "Generate viral videos with AI. Scripts, voiceovers, and renders — all from a single prompt. Built for content creators.",
};

export default function FrameforgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}