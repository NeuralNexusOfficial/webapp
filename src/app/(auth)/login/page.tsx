"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

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
          <p className="text-white/40 text-sm mt-2">Sign in to continue</p>
        </div>

        {/* Card */}
        <form onSubmit={handleLogin} className="card-cyber p-8 space-y-5">
          <div className="tag-label mb-2 w-fit">Welcome Back</div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Log In
          </h1>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              id="login-email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-nn"
            />
            <input
              id="login-password"
              type="password"
              required
              placeholder="Password"
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
            {loading ? "Signing in…" : "Log In →"}
          </button>

          <p className="text-center text-sm text-white/30">
            No account?{" "}
            <Link
              href={`/signup${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-white/60 hover:text-white underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
