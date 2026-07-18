"use client";

import { useState } from "react";
import { Cloud, Clapperboard, BookOpen, Gamepad2, Bot } from "lucide-react";
import {
  REGISTRATION_FEES,
  CURRENCY_SYMBOL,
  DOMAIN_PRIZES,
  CAREER_PERKS,
  formatINR,
} from "@/lib/pricing";

export default function Tracks() {
  const [activeTab, setActiveTab] = useState<'AI' | 'SaaS' | 'Gaming' | 'Animation' | 'Storytelling'>('AI');

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
    <section id="tracks" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="tag-label mb-4">Domains</div>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose Your Arena
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-2xl leading-relaxed">
            Five domains, {CURRENCY_SYMBOL}12,00,000 in prizes. Pick the domain
            that fires you up and build the future.
          </p>
        </div>

        {/* Track cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {tracks.map((track) => (
            <div
              key={track.tag}
              className={`relative group card-cyber p-5 sm:p-7 flex flex-col gap-4 bg-gradient-to-br ${track.color} border ${track.border} transition-all duration-300`}
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
          <div className="card-cyber p-5 sm:p-7 flex flex-col justify-between gap-6 border-white/10 hover:border-white/20 transition-all duration-300 md:col-span-2 lg:col-span-3 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">
                Total Prize Pool
              </p>
              <p
                className="text-5xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {CURRENCY_SYMBOL}12,00,000
              </p>
              <p className="text-white/40 text-sm mt-2">
                Cash prizes + full-time roles, internships &amp; career opportunities across all domains
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

        {/* Comparison Matrix */}
        <div className="mt-20 relative z-10">
          <div className="mb-8">
            <div className="tag-label mb-2">Matrix</div>
            <h3
              className="text-2xl sm:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Domain Details
            </h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-xl">
              Compare focus areas, prize allocations (Solo &amp; Team), and strategic career opportunities.
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden card-cyber border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.01]">
                  <th className="p-5 text-white/40 font-medium text-xs uppercase tracking-wider">Metrics</th>
                  <th className="p-5 text-rose-400 font-bold text-base font-display">AI</th>
                  <th className="p-5 text-sky-400 font-bold text-base font-display">SaaS</th>
                  <th className="p-5 text-violet-400 font-bold text-base font-display">Gaming</th>
                  <th className="p-5 text-amber-400 font-bold text-base font-display">Animation</th>
                  <th className="p-5 text-emerald-400 font-bold text-base font-display">Storytelling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white/80 whitespace-nowrap text-xs uppercase tracking-wider">Focus</td>
                  <td className="p-5 text-white/50 leading-relaxed">Automation, ML, GenAI, NLP, Computer Vision</td>
                  <td className="p-5 text-white/50 leading-relaxed">Scalable software solving real business problems</td>
                  <td className="p-5 text-white/50 leading-relaxed">Mobile/PC game creation for official publishing</td>
                  <td className="p-5 text-white/50 leading-relaxed">2-3 minute animated teasers, characters, and concepts</td>
                  <td className="p-5 text-white/50 leading-relaxed">Scripts and concepts for professional animated films</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white/80 whitespace-nowrap text-xs uppercase tracking-wider">Prize Pool</td>
                  <td className="p-5 font-bold text-white text-lg">{CURRENCY_SYMBOL}{formatINR(DOMAIN_PRIZES.AI.solo.totalPool + DOMAIN_PRIZES.AI.team.totalPool)}</td>
                  <td className="p-5 font-bold text-white text-lg">{CURRENCY_SYMBOL}{formatINR(DOMAIN_PRIZES.SaaS.solo.totalPool + DOMAIN_PRIZES.SaaS.team.totalPool)}</td>
                  <td className="p-5 font-bold text-white text-lg">{CURRENCY_SYMBOL}{formatINR(DOMAIN_PRIZES.Gaming.solo.totalPool + DOMAIN_PRIZES.Gaming.team.totalPool)}</td>
                  <td className="p-5 font-bold text-white text-lg">{CURRENCY_SYMBOL}{formatINR(DOMAIN_PRIZES.Animation.solo.totalPool + DOMAIN_PRIZES.Animation.team.totalPool)}</td>
                  <td className="p-5 font-bold text-emerald-400/90 text-sm">Non-cash track</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white/80 whitespace-nowrap text-xs uppercase tracking-wider">Entry Fee</td>
                  <td className="p-5">
                    <span className="block text-white font-semibold text-sm">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.solo)} <span className="text-white/30 text-xs font-normal font-sans">Solo</span></span>
                    <span className="block text-white/40 text-xs mt-0.5">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.team)} Team</span>
                  </td>
                  <td className="p-5">
                    <span className="block text-white font-semibold text-sm">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.solo)} <span className="text-white/30 text-xs font-normal font-sans">Solo</span></span>
                    <span className="block text-white/40 text-xs mt-0.5">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.team)} Team</span>
                  </td>
                  <td className="p-5">
                    <span className="block text-white font-semibold text-sm">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.solo)} <span className="text-white/30 text-xs font-normal font-sans">Solo</span></span>
                    <span className="block text-white/40 text-xs mt-0.5">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.team)} Team</span>
                  </td>
                  <td className="p-5">
                    <span className="block text-white font-semibold text-sm">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.solo)} <span className="text-white/30 text-xs font-normal font-sans">Solo</span></span>
                    <span className="block text-white/40 text-xs mt-0.5">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.team)} Team</span>
                  </td>
                  <td className="p-5">
                    <span className="block text-white font-semibold text-sm">{CURRENCY_SYMBOL}{formatINR(REGISTRATION_FEES.solo)} <span className="text-white/30 text-xs font-normal font-sans">Solo</span></span>
                    <span className="block text-emerald-400/80 text-[10px] uppercase font-bold tracking-wider mt-0.5">Solo only</span>
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white/80 whitespace-nowrap text-xs uppercase tracking-wider">Career Perks</td>
                  {/* AI, SaaS, Gaming, Animation — standardized career perks */}
                  {(['rose', 'sky', 'violet', 'amber'] as const).map((color) => (
                    <td key={color} className="p-5 text-white/50 text-xs leading-relaxed">
                      <div className="space-y-1">
                        <p><strong className={`text-${color}-400`}>1st:</strong> {CAREER_PERKS.first}</p>
                        <p><strong className="text-white/80">2nd:</strong> {CAREER_PERKS.second}</p>
                        <p><strong className="text-white/80">3rd:</strong> {CAREER_PERKS.third}</p>
                        <p><strong className="text-white/80">4th–10th:</strong> {CAREER_PERKS.fourthToTenth}</p>
                        <p className="text-white/30">{CAREER_PERKS.allOthers}</p>
                      </div>
                    </td>
                  ))}
                  <td className="p-5 text-white/50 text-xs leading-relaxed">
                    <p className="text-emerald-400/90 font-medium">Adapted to Films:</p>
                    <p className="mt-1">Top 30 stories adapted into professional animated films under Fraylon with writer credits.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Tabbed View */}
          <div className="md:hidden mt-6">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
              {(['AI', 'SaaS', 'Gaming', 'Animation', 'Storytelling'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                const colors = {
                  AI: "border-rose-500/30 text-rose-400 bg-rose-500/5",
                  SaaS: "border-sky-500/30 text-sky-400 bg-sky-500/5",
                  Gaming: "border-violet-500/30 text-violet-400 bg-violet-500/5",
                  Animation: "border-amber-500/30 text-amber-400 bg-amber-500/5",
                  Storytelling: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                      isSelected
                        ? colors[tab]
                        : "border-white/[0.08] text-white/40 bg-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Mobile Tab Card Content */}
            <div className="card-cyber p-6 mt-4 border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl flex flex-col gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Focus</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {activeTab === 'AI' && "Automation, ML, GenAI, NLP, Computer Vision"}
                  {activeTab === 'SaaS' && "Scalable software solving real business problems"}
                  {activeTab === 'Gaming' && "Mobile/PC game creation for official publishing"}
                  {activeTab === 'Animation' && "2-3 minute animated teasers, characters, and concepts"}
                  {activeTab === 'Storytelling' && "Scripts and concepts for professional animated films"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Prize Pool</p>
                  <p className="text-base font-bold text-white">
                    {activeTab === 'AI' && `${CURRENCY_SYMBOL}${formatINR(DOMAIN_PRIZES.AI.solo.totalPool + DOMAIN_PRIZES.AI.team.totalPool)}`}
                    {activeTab === 'SaaS' && `${CURRENCY_SYMBOL}${formatINR(DOMAIN_PRIZES.SaaS.solo.totalPool + DOMAIN_PRIZES.SaaS.team.totalPool)}`}
                    {activeTab === 'Gaming' && `${CURRENCY_SYMBOL}${formatINR(DOMAIN_PRIZES.Gaming.solo.totalPool + DOMAIN_PRIZES.Gaming.team.totalPool)}`}
                    {activeTab === 'Animation' && `${CURRENCY_SYMBOL}${formatINR(DOMAIN_PRIZES.Animation.solo.totalPool + DOMAIN_PRIZES.Animation.team.totalPool)}`}
                    {activeTab === 'Storytelling' && "Non-cash track"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Entry Fee</p>
                  <p className="text-base font-bold text-white">
                    {activeTab === 'Storytelling'
                      ? `${CURRENCY_SYMBOL}${formatINR(REGISTRATION_FEES.solo)} (Solo only)`
                      : `${CURRENCY_SYMBOL}${formatINR(REGISTRATION_FEES.solo)} Solo / ${CURRENCY_SYMBOL}${formatINR(REGISTRATION_FEES.team)} Team`
                    }
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Strategic Career Perks</p>
                <div className="text-xs text-white/70 leading-relaxed space-y-2">
                  {activeTab !== 'Storytelling' ? (
                    <>
                      <p><strong className={`${activeTab === 'AI' ? 'text-rose-400' : activeTab === 'SaaS' ? 'text-sky-400' : activeTab === 'Gaming' ? 'text-violet-400' : 'text-amber-400'}`}>1st Place:</strong> {CAREER_PERKS.first}</p>
                      <p><strong className="text-white/90">2nd Place:</strong> {CAREER_PERKS.second}</p>
                      <p><strong className="text-white/90">3rd Place:</strong> {CAREER_PERKS.third}</p>
                      <p><strong className="text-white/90">4th–10th:</strong> {CAREER_PERKS.fourthToTenth}</p>
                      <p className="text-white/40">{CAREER_PERKS.allOthers}</p>
                    </>
                  ) : (
                    <p>Top 30 original stories/scripts adapted into professional animated film productions under Fraylon with writer credits.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
