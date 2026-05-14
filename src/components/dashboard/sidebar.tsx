"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/dashboard" },
  { label: "My Team",     href: "/dashboard/team" },
  { label: "Submit Project", href: "/dashboard/submit" },
  { label: "Judging",     href: "/judge" },
  { label: "Resources",   href: "/dashboard/resources" },
];



export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Mobile hamburger ───────────────────────────────────────── */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-black/80 border border-white/10 text-white backdrop-blur-md"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar panel ──────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col justify-between
          w-64 border-r border-white/[0.06] bg-black/80 backdrop-blur-sm
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:flex
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div>
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <Link href="/" onClick={() => setOpen(false)}>
              <span
                className="text-xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Neural<span className="text-white/30">Nexus</span>
              </span>
            </Link>
            <p className="text-xs text-white/30 mt-1 uppercase tracking-widest">Hackathon Hub</p>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-black"
                      : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.06] space-y-1">
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Settings
          </Link>
          <Link
            href="/auth"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
          >
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}