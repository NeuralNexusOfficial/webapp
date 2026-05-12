"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Neural<span className="text-white/40">Nexus</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#tracks" className="hover:text-white transition-colors">
            Tracks
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="btn-pill btn-primary text-sm py-2 px-5">
            Register →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 text-white/70 hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl px-6 py-5 space-y-4">
          <Link
            href="/#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors py-2"
          >
            How It Works
          </Link>
          <Link
            href="/#tracks"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors py-2"
          >
            Tracks
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors py-2"
          >
            Dashboard
          </Link>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-pill btn-outline text-sm py-2.5 w-full justify-center text-center"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="btn-pill btn-primary text-sm py-2.5 w-full justify-center text-center"
            >
              Register →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}