import { Cloud, Clapperboard, BookOpen, Gamepad2, Bot } from "lucide-react";

export default function Tracks() {
  const tracks = [
    {
      icon: <Cloud className="w-8 h-8 text-sky-400" />,
      tag: "Track 01",
      title: "SaaS",
      desc: "Build scalable software products — CRM systems, productivity platforms, analytics dashboards, workflow automation, and B2B solutions.",
      color: "from-sky-500/10 to-blue-500/5",
      border: "border-sky-500/20 hover:border-sky-500/40",
      tagColor: "text-sky-400",
    },
    {
      icon: <Clapperboard className="w-8 h-8 text-amber-400" />,
      tag: "Track 02",
      title: "Animation",
      desc: "2D/3D animation, motion graphics, cinematic trailers, anime-style content, character design, and experimental visual storytelling.",
      color: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
      tagColor: "text-amber-400",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
      tag: "Track 03",
      title: "Storytelling",
      desc: "Craft original stories, screenplays, and narrative scripts capable of becoming animated cinematic experiences under Fraylon.",
      color: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      tagColor: "text-emerald-400",
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-violet-400" />,
      tag: "Track 04",
      title: "Gaming",
      desc: "Mobile games, multiplayer experiences, story-based & indie games, simulations, AI-powered games, and competitive gaming concepts.",
      color: "from-violet-500/10 to-purple-500/5",
      border: "border-violet-500/20 hover:border-violet-500/40",
      tagColor: "text-violet-400",
    },
    {
      icon: <Bot className="w-8 h-8 text-rose-400" />,
      tag: "Track 05",
      title: "AI",
      desc: "AI SaaS products, automation systems, AI agents, computer vision, NLP, generative AI, healthcare AI, and FinTech AI solutions.",
      color: "from-rose-500/10 to-red-500/5",
      border: "border-rose-500/20 hover:border-rose-500/40",
      tagColor: "text-rose-400",
    },
  ];

  return (
    <section id="tracks" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="tag-label mb-4">Domains</div>
          <h2
            className="text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose Your Arena
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-2xl leading-relaxed">
            Five domains, $37,000+ in prizes. Pick the domain
            that fires you up and build the future.
          </p>
        </div>

        {/* Track cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {tracks.map((track) => (
            <div
              key={track.tag}
              className={`relative group card-cyber p-7 flex flex-col gap-4 bg-gradient-to-br ${track.color} border ${track.border} transition-all duration-300`}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">{track.icon}</div>

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
                $37,000+
              </p>
              <p className="text-white/40 text-sm mt-2">
                Cash prizes + full-time roles, internships &amp; premium subscriptions across all domains
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
