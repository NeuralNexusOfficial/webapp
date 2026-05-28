import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Hero() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'USER';
  if (user) {
    if (user.email === 'kishlayamishra@gmail.com') {
      role = 'ADMIN';
    } else {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role) {
        role = profile.role;
      }
    }
  }
  
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
          Global Hackathon · Aug–Oct 2026
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
          Join developers, designers, animators &amp; storytellers worldwide to
          build the future — Aug 21 to Oct 21, $37,000+ in prizes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          {user ? (
            <>
              {role === 'ADMIN' ? (
                <Link href="/admin" className="btn-pill btn-primary">
                  Admin Panel →
                </Link>
              ) : role === 'JUDGE' ? (
                <Link href="/panel" className="btn-pill btn-primary">
                  Judge Panel →
                </Link>
              ) : (
                <Link href="/dashboard/submit" className="btn-pill btn-primary">
                  Submit Project →
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/signup" className="btn-pill btn-primary">
                Register Now →
              </Link>
              <Link href="#how-it-works" className="btn-pill btn-outline">
                Learn More
              </Link>
            </>
          )}
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