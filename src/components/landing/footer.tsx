import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p
            className="text-lg font-bold text-white/80"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AOT<span className="text-white/30">Hackathon</span>
          </p>
          <p className="text-xs text-white/30 mt-1">© 2026 AOT Hackathon. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6 text-xs text-white/40">
          <Link href="/login" className="hover:text-white/70 transition-colors">
            Sign In
          </Link>
          <span className="text-white/10">|</span>
          <span>Built for builders.</span>
        </div>
      </div>
    </footer>
  );
}