export default function Tracks() {
  const tracks = [
    {
      icon: "🤖",
      tag: "Track 01",
      title: "AI & Machine Learning",
      desc: "Push the boundaries of intelligence. Build models, agents, or tools that learn, reason, and adapt. From NLP to computer vision — if it thinks, it belongs here.",
      color: "from-violet-500/10 to-purple-500/5",
      border: "border-violet-500/20 hover:border-violet-500/40",
      tagColor: "text-violet-400",
    },
    {
      icon: "🔗",
      tag: "Track 02",
      title: "Web3 & Blockchain",
      desc: "Decentralise everything. Smart contracts, DeFi protocols, NFT utilities, DAOs — build the open internet of tomorrow on-chain.",
      color: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
      tagColor: "text-amber-400",
    },
    {
      icon: "🏥",
      tag: "Track 03",
      title: "HealthTech",
      desc: "Tech that saves lives. Wearables, diagnostic AI, mental-health apps, telemedicine platforms — solve real healthcare problems at scale.",
      color: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      tagColor: "text-emerald-400",
    },
    {
      icon: "🌱",
      tag: "Track 04",
      title: "Sustainability",
      desc: "Build for the planet. Climate modelling, carbon tracking, smart energy grids, waste reduction apps — hack for a greener future.",
      color: "from-lime-500/10 to-green-500/5",
      border: "border-lime-500/20 hover:border-lime-500/40",
      tagColor: "text-lime-400",
    },
    {
      icon: "⚡",
      tag: "Track 05",
      title: "Open Innovation",
      desc: "No constraints. Any problem, any domain, any stack. If it's creative, functional, and impactful — this track is yours.",
      color: "from-sky-500/10 to-blue-500/5",
      border: "border-sky-500/20 hover:border-sky-500/40",
      tagColor: "text-sky-400",
    },
  ];

  return (
    <section id="tracks" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="tag-label mb-4">Tracks</div>
          <h2
            className="text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose Your Arena
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-2xl leading-relaxed">
            Five cutting-edge tracks, one massive prize pool. Pick the domain
            that fires you up — or go open and surprise us all.
          </p>
        </div>

        {/* Track cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <div
              key={track.tag}
              className={`relative group card-cyber p-7 flex flex-col gap-4 bg-gradient-to-br ${track.color} border ${track.border} transition-all duration-300`}
            >
              {/* Icon */}
              <div className="text-4xl">{track.icon}</div>

              {/* Tag */}
              <p
                className={`text-xs uppercase tracking-widest font-semibold ${track.tagColor}`}
              >
                {track.tag}
              </p>

              {/* Title */}
              <h3
                className="text-xl font-bold text-white leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {track.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed flex-1">
                {track.desc}
              </p>

              {/* Hover glow accent */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)",
                }}
              />
            </div>
          ))}

          {/* Prize pool callout — spans remaining grid space */}
          <div className="card-cyber p-7 flex flex-col justify-between gap-6 border-white/10 hover:border-white/20 transition-all duration-300 md:col-span-2 lg:col-span-3 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">
                Total Prize Pool
              </p>
              <p
                className="text-5xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ₹5L+
              </p>
              <p className="text-white/40 text-sm mt-2">
                Distributed across all tracks · Winner + runner-up per track
              </p>
            </div>
            <a
              href="/signup"
              className="btn-pill btn-primary text-sm py-3 px-8 whitespace-nowrap self-start lg:self-auto"
            >
              Register Now →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
