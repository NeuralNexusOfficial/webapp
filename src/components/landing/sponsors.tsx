export default function Sponsors() {
  const goldSponsors = [
    { name: "AWS", logo: "AWS", sub: "Cloud Infrastructure Partner" },
    { name: "Google", logo: "Google", sub: "AI & Developer Tools Partner" },
    { name: "Microsoft", logo: "Microsoft", sub: "Platform & Azure Partner" },
  ];

  const silverSponsors = [
    { name: "OpenAI", logo: "OpenAI", sub: "AI Research Partner" },
    { name: "GitHub", logo: "GitHub", sub: "DevOps Partner" },
    { name: "Vercel", logo: "Vercel", sub: "Deployment Partner" },
    { name: "Supabase", logo: "Supabase", sub: "Database Partner" },
  ];

  const communitySponsors = [
    { name: "Postman" },
    { name: "Notion" },
    { name: "Figma" },
    { name: "Stripe" },
    { name: "Auth0" },
    { name: "Twilio" },
  ];

  return (
    <section id="sponsors" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="tag-label mb-4 mx-auto w-fit">Sponsors & Partners</div>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Backed By The Best
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-xl mx-auto leading-relaxed">
            Industry giants powering the next generation of hackers with
            credits, mentorship, and real-world tools.
          </p>
        </div>

        {/* Gold tier */}
        <div className="mb-10">
          <p className="text-xs text-amber-400/80 uppercase tracking-widest font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-400/40" />
            Gold Sponsors
            <span className="w-8 h-px bg-amber-400/40" />
          </p>
          <div className="grid sm:grid-cols-3 gap-4 relative z-10">
            {goldSponsors.map((s) => (
              <div
                key={s.name}
                className="group card-cyber p-5 sm:p-7 flex flex-col items-center text-center gap-3
                           border-amber-500/20 hover:border-amber-500/50 bg-gradient-to-br from-amber-500/[0.04] to-transparent
                           transition-all duration-300"
              >
                {/* Placeholder logo pill */}
                <div className="w-16 h-16 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] flex items-center justify-center
                               text-amber-300 font-bold text-lg group-hover:border-amber-400/40 transition-colors">
                  {s.logo.slice(0, 2)}
                </div>
                <p className="text-white font-bold text-lg">{s.name}</p>
                <p className="text-white/30 text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Silver tier */}
        <div className="mb-10">
          <p className="text-xs text-slate-400/80 uppercase tracking-widest font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-px bg-slate-400/40" />
            Silver Sponsors
            <span className="w-8 h-px bg-slate-400/40" />
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {silverSponsors.map((s) => (
              <div
                key={s.name}
                className="group card-cyber p-4 sm:p-5 flex flex-col items-center text-center gap-3
                           border-white/10 hover:border-white/30 bg-gradient-to-br from-white/[0.02] to-transparent
                           transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center
                               text-white/60 font-bold text-sm group-hover:border-white/20 transition-colors">
                  {s.logo.slice(0, 2)}
                </div>
                <p className="text-white/80 font-semibold text-sm">{s.name}</p>
                <p className="text-white/25 text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community / in-kind */}
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-px bg-white/20" />
            Community Partners
            <span className="w-8 h-px bg-white/20" />
          </p>
          <div className="flex flex-wrap gap-3 justify-center relative z-10">
            {communitySponsors.map((s) => (
              <div
                key={s.name}
                className="px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.02]
                           text-white/40 text-sm font-medium hover:border-white/20 hover:text-white/70
                           transition-all duration-200 cursor-default"
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>

        {/* Become a sponsor CTA */}
        <div className="mt-14 card-cyber p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-white/10 relative z-10">
          <div>
            <p className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-display)" }}>
              Become a Sponsor
            </p>
            <p className="text-white/40 text-sm mt-1">
              Reach 1000+ developers and showcase your brand at AOT Hackathon 2026.
            </p>
          </div>
          <a
            href="mailto:kishlayamishra@gmail.com"
            className="btn-pill btn-outline text-sm py-2.5 px-6 whitespace-nowrap"
          >
            Get In Touch →
          </a>
        </div>
      </div>
    </section>
  );
}