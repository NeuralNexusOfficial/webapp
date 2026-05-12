"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check email confirmation requirement — if not required, go straight to next
    router.push(next);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/">
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Neural<span className="text-white/30">Nexus</span>
            </span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Create your hacker account</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSignup} className="card-cyber p-8 space-y-5">
          <div className="tag-label mb-2 w-fit">New Account</div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sign Up
          </h1>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              id="signup-name"
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-nn"
            />
            <input
              id="signup-email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-nn"
            />
            <input
              id="signup-password"
              type="password"
              required
              placeholder="Password (8+ chars)"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-nn"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pill btn-primary w-full justify-center"
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>

          <p className="text-center text-sm text-white/30">
            Already have one?{" "}
            <Link
              href={`/login${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-white/60 hover:text-white underline underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}