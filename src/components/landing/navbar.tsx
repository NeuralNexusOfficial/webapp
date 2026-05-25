"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [role, setRole] = useState<string>('USER');
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect auth state on client
  useEffect(() => {
    const supabase = createClient();

    // Initial session check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Try to get first name from profile
        supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (user.email === 'kishlayamishra@gmail.com') setRole('ADMIN');
            else if (data?.role) setRole(data.role);
            if (data?.full_name) {
              setFirstName(data.full_name.trim().split(" ")[0]);
            } else {
              setFirstName(user.email?.split("@")[0] ?? null);
            }
          });
      }
      setAuthLoaded(true);
    });

    // Listen for auth changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setFirstName(null);
        }
      }
    );

    return () => subscription.unsubscribe();
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
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
          <img src="/logo.png" alt="AOT Logo" className="h-8 w-auto object-contain" />
          <div className="flex flex-col">
            <span
              className="text-xl font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AOT<span className="text-white/40">Hackathon</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 mt-1 leading-none">
              Architects of Tomorrow
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-white/60">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#tracks" className="hover:text-white transition-colors">
            Tracks
          </Link>
          <Link href="/#sponsors" className="hover:text-white transition-colors">
            Sponsors
          </Link>
          <Link href="/rules" className="hover:text-white transition-colors">
            Rules
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            FAQs
          </Link>
        </div>

        {/* Desktop CTA — auth-aware */}
        <div className="hidden lg:flex items-center gap-3">
          {!authLoaded ? (
            // Skeleton placeholder while loading auth
            <div className="w-28 h-9 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            // Logged-in state
            <>
              <Link
                href={role === 'ADMIN' ? '/admin' : role === 'JUDGE' ? '/panel' : '/dashboard'}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 text-sm text-white/70 hover:text-white transition-all duration-200"
              >
                <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white/70">
                  {firstName ? firstName[0].toUpperCase() : <User size={10} />}
                </span>
                {firstName ?? "Account"}
              </Link>
              <Link href={role === 'ADMIN' ? '/admin' : role === 'JUDGE' ? '/panel' : '/dashboard'} className="btn-pill btn-primary text-sm py-2 px-5">
                {role === 'ADMIN' ? 'Admin Panel →' : role === 'JUDGE' ? 'Judge Panel →' : 'Dashboard →'}
              </Link>
            </>
          ) : (
            // Logged-out state
            <>
              <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="btn-pill btn-primary text-sm py-2 px-5">
                Register →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 text-white/70 hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl px-6 py-5 space-y-4">
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
            href="/#sponsors"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors py-2"
          >
            Sponsors
          </Link>
          <Link
            href="/rules"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors py-2"
          >
            Rules
          </Link>
          <Link
            href="/faq"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors py-2"
          >
            FAQs
          </Link>
          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href={role === 'ADMIN' ? '/admin' : role === 'JUDGE' ? '/panel' : '/dashboard'}
                  onClick={() => setMenuOpen(false)}
                  className="btn-pill btn-primary text-sm py-2.5 w-full justify-center text-center"
                >
                  {role === 'ADMIN' ? 'Go to Admin Panel →' : role === 'JUDGE' ? 'Go to Judge Panel →' : 'Go to Dashboard →'}
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}