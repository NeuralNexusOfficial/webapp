"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";
import SplashCursor from "@/components/ui/splash-cursor";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("password", password);

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
          <p className="text-white/40 text-sm mt-2">Enter your new password</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="card-cyber p-8 space-y-5">
          <div className="tag-label mb-2 w-fit">Update Password</div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            New Password
          </h1>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              id="update-password"
              type="password"
              required
              placeholder="New password (8+ chars)"
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
