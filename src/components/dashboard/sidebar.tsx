"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut, getCurrentUserRole } from "@/app/actions/auth";

type NavItem = {
  label: string;
  href: string;
  match?: (p: string) => boolean;
};

const userItems: NavItem[] = [
  { label: "Dashboard",      href: "/dashboard" },
  { label: "My Team",        href: "/dashboard/team" },
  { label: "Submit Project", href: "/dashboard/submit" },
  { label: "Resources",      href: "/dashboard/resources" },
];

const adminItems: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Judges", href: "/admin/judges" },
];

const judgeItems: NavItem[] = [
  { label: "Judging",        href: "/panel", match: (p: string) => p.startsWith("/panel") },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Load user identity on mount
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? null);

      // Fetch role via server action (bypasses RLS issues)
      const roleRes = await getCurrentUserRole();
      if (roleRes.role) {
        setRole(roleRes.role);
      } else {
        setRole('USER');
      }

      // Try profile for full name (client-side)
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setFirstName(profile.full_name.trim().split(" ")[0]);
      } else {
        setFirstName(user.email?.split("@")[0] ?? null);
      }
    });
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    // signOut() calls redirect('/') so this line is never reached,
    // but we keep the flag set to show loading state.
  }

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

      {/* Desktop spacer to reserve space for the fixed sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0" />

      {/* ── Sidebar panel ──────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40 flex flex-col justify-between
          w-64 border-r border-white/17 bg-black/80 backdrop-blur-sm
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:flex
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Top section: brand + nav ────────────────────────────── */}
        <div>
          <div className="px-6 py-5 border-b border-white/6">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <img src="/aot_white.png" alt="AOT Logo" className="h-7 w-auto object-contain" />
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  AOT<span className="text-white/30">Hackathon</span>
                </span>
                <span className="text-[10px] text-white/30 mt-1 uppercase tracking-widest leading-none">
                  Architects of Tomorrow
                </span>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1">
            {role === null ? (
              // Loading skeleton for nav items
              <div className="space-y-2">
                <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
                <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
                <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
              </div>
            ) : (() => {
              let itemsToRender = userItems;
              if (role === 'ADMIN') itemsToRender = adminItems;
              else if (role === 'JUDGE') itemsToRender = judgeItems;

              return itemsToRender.map((item) => {
                const active = item.match ? item.match(pathname) : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-white text-black"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              });
            })()}
          </nav>
        </div>

        {/* ── Bottom section: user chip + settings + sign out ─────── */}
        <div className="p-4 border-t border-white/6 space-y-1">
          {/* User identity chip */}
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {/* Avatar initial */}
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              {firstName ? (
                <span className="text-sm font-bold text-white/70">
                  {firstName[0].toUpperCase()}
                </span>
              ) : (
                <User size={14} className="text-white/40" />
              )}
            </div>
            {/* Name + email */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/80 truncate">
                {firstName ?? "Hacker"}
              </p>
              <p className="text-[10px] text-white/30 truncate">
                {email ?? "…"}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-white text-black"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings size={15} />
            Settings
          </Link>

          {/* Sign Out — calls server action (Bug 1 fix) */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500/70 hover:text-red-400 hover:bg-red-500/6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={15} />
            {isSigningOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}