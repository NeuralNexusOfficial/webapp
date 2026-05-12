import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 overflow-hidden">

      {/* Radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/3 w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
          animation: "pulse 10s ease-in-out infinite 2s",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Label */}
        <div className="tag-label mx-auto mb-8 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
          Global Hackathon · May 2026
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-8xl font-bold leading-[1.02] tracking-tight mb-6 text-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Build. Compete.
          <br />
          Change The Future.
        </h1>

        {/* Sub */}
        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Join 5,000+ developers, designers and innovators to solve
          real-world challenges — 24 hours, ₹5L+ in prizes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-pill btn-primary">
            Register Now →
          </Link>
          <Link href="#how-it-works" className="btn-pill btn-outline">
            Learn More
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest uppercase">
          <span>scroll</span>
          <div className="w-px h-10 bg-white/10" />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}