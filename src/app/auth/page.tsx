"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function AuthContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";

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
          <p className="text-white/40 text-sm mt-2">The global hackathon platform</p>
        </div>

        {/* Card */}
        <div className="card-cyber p-8 space-y-4">
          <div className="tag-label mb-2 w-fit">Get Started</div>
          <h1
            className="text-2xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Account
          </h1>

          <Link
            href={`/login${nextParam}`}
            className="btn-pill btn-primary w-full justify-center block text-center"
          >
            Log In →
          </Link>
          <Link
            href={`/signup${nextParam}`}
            className="btn-pill btn-outline w-full justify-center block text-center"
          >
            Create Account
          </Link>

          <p className="text-center text-xs text-white/25 pt-4">
            By continuing, you agree to the hackathon terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
