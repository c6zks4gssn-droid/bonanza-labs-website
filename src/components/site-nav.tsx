"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/oplossingen", label: "Oplossingen" },
  { href: "/serveflow", label: "ServeFlow" },
  { href: "/tradeflow", label: "TradeFlow" },
  { href: "/bonanza-voice", label: "Bonanza Voice" },
  { href: "/blog", label: "Kennisbank" },
  { href: "/over-ons", label: "Over ons" },
];

export default function SiteNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050508]/88 backdrop-blur-xl">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <img src="/logo-256.png" alt="BonanzaLabs" className="h-8 w-8 rounded" />
          BonanzaLabs
        </Link>

        <button
          type="button"
          className="text-white/65 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute left-4 right-4 top-16 flex-col gap-4 rounded-2xl border border-white/10 bg-[#0D1220] p-5 text-sm text-white/65 shadow-2xl md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={active === link.href ? "font-semibold text-white" : "transition hover:text-white"}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black transition hover:bg-amber-300"
          >
            Plan kennismaking
          </Link>
        </div>
      </div>
    </nav>
  );
}
