"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";
import SplashCursor from "@/components/ui/splash-cursor";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("email", email);

    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <SplashCursor />
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
          <p className="text-white/40 text-sm mt-2">Reset your password</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="card-cyber p-8 space-y-5">
          <div className="tag-label mb-2 w-fit">Account Recovery</div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Forgot Password
          </h1>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              Check your email for a password reset link.
            </div>
          )}

          <div className="space-y-3">
            <input
              id="reset-email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-nn"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn-pill btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-white/30">
            Remember your password?{" "}
            <Link
              href="/login"
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
