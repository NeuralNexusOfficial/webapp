'use client';

import Sidebar from '@/components/dashboard/sidebar';
import Link from 'next/link';
import { Bot, Cloud, Clapperboard, BookOpen, Gamepad2, ClipboardList, Trophy, HelpCircle, MessageCircle, Medal, Award, Star } from 'lucide-react';

const TRACKS = [
  {
    id: 'ai',
    icon: <Bot className="w-5 h-5 text-rose-400" />,
    label: 'Artificial Intelligence',
    color: 'from-rose-500/10 to-red-500/5',
    border: 'border-rose-500/20',
    description: 'Next-gen intelligent systems, ML applications, automation, generative AI, AI agents, and problem-solving using AI.',
    resources: [
      { label: 'OpenAI API Docs', href: 'https://platform.openai.com/docs' },
      { label: 'HuggingFace Spaces', href: 'https://huggingface.co/spaces' },
      { label: 'Kaggle Datasets', href: 'https://www.kaggle.com/datasets' },
      { label: 'Google Colab', href: 'https://colab.research.google.com' },
    ],
  },
  {
    id: 'saas',
    icon: <Cloud className="w-5 h-5 text-sky-400" />,
    label: 'SaaS',
    color: 'from-sky-500/10 to-blue-500/5',
    border: 'border-sky-500/20',
    description: 'Scalable software products, B2B solutions, productivity platforms, cloud-based systems, workflow automation, and CRM tools.',
    resources: [
      { label: 'Vercel Docs', href: 'https://vercel.com/docs' },
      { label: 'Supabase Docs', href: 'https://supabase.com/docs' },
      { label: 'Stripe API', href: 'https://stripe.com/docs/api' },
      { label: 'Notion API', href: 'https://developers.notion.com' },
    ],
  },
  {
    id: 'gaming',
    icon: <Gamepad2 className="w-5 h-5 text-violet-400" />,
    label: 'Gaming',
    color: 'from-violet-500/10 to-purple-500/5',
    border: 'border-violet-500/20',
    description: 'Game development, immersive experiences, multiplayer systems, storytelling games, indie concepts, and entertainment innovation.',
    resources: [
      { label: 'Unity Learn', href: 'https://learn.unity.com' },
      { label: 'Godot Docs', href: 'https://docs.godotengine.org' },
      { label: 'Phaser.js', href: 'https://phaser.io' },
      { label: 'itch.io', href: 'https://itch.io' },
    ],
  },
  {
    id: 'storytelling',
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    label: 'Storytelling',
    color: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/20',
    description: 'Original stories, screenplays, and story-driven scripts for animated cinematic experiences. Individual only.',
    resources: [
      { label: 'WriterSolo', href: 'https://writersolo.com' },
      { label: 'Story Structure Guide', href: 'https://www.masterclass.com/articles/how-to-structure-a-story' },
      { label: 'Screenplay Format', href: 'https://www.writersstore.com/how-to-write-a-screenplay' },
    ],
  },
  {
    id: 'animation',
    icon: <Clapperboard className="w-5 h-5 text-amber-400" />,
    label: 'Animation',
    color: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/20',
    description: 'Visual storytelling, motion graphics, cinematic experiences, VFX, character animation, and digital creativity.',
    resources: [
      { label: 'Blender Learn', href: 'https://www.blender.org/support/tutorials' },
      { label: 'Adobe After Effects', href: 'https://helpx.adobe.com/after-effects/tutorials.html' },
      { label: 'RunwayML', href: 'https://runwayml.com' },
      { label: 'Mixamo', href: 'https://www.mixamo.com' },
    ],
  },
];

const GENERAL_RESOURCES = [
  {
    icon: <ClipboardList className="w-5 h-5 text-white/60" />,
    label: 'Submission Rules',
    desc: 'Deadline, required fields, and submission process',
    href: '#rules',
  },
  {
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    label: 'Prizes & Judging',
    desc: 'Prize pool breakdown and judging criteria',
    href: '#prizes',
  },
  {
    icon: <HelpCircle className="w-5 h-5 text-white/60" />,
    label: 'FAQs',
    desc: 'Common questions answered',
    href: '#faqs',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-white/60" />,
    label: 'Discord Community',
    desc: 'Ask questions, find teammates, get updates — Coming Soon!',
    href: '#',
  },
];

const RULES = [
  'All code must be written during the hackathon window (Aug 21 – Oct 21, 2026). Using open-source libraries, APIs, and frameworks is allowed.',
  'Teams can have 1–4 members. Solo participation is permitted in all domains.',
  'Each team may only submit one project. The last saved draft before the deadline counts.',
  'Projects must be original work and must not infringe on third-party IP.',
  'The project must target one of the five domains: AI, SaaS, Gaming, Storytelling, or Animation.',
  'All team members must have completed registration (paid the domain-specific fee) to be eligible for prizes.',
  'AI tools (e.g., ChatGPT) may be used for assistance, but core logic must be authored by your team.',
  'Judges\' decisions are final. Winners will be announced after the judging session.',
];

const PRIZES = [
  { place: <Medal className="w-6 h-6 text-amber-400" />, label: 'AI — 1st Place', reward: '$15,000 + Annual ChatGPT, Midjourney & RunwayML Subscriptions' },
  { place: <Medal className="w-6 h-6 text-amber-400" />, label: 'Gaming — 1st Place', reward: '$10,000 + Official game launch under Fraylon' },
  { place: <Medal className="w-6 h-6 text-amber-400" />, label: 'SaaS — 1st Place', reward: '$7,000 + Annual CRM, Marketing, Product & Ops Tools' },
  { place: <Medal className="w-6 h-6 text-amber-400" />, label: 'Animation — 1st Place', reward: '$5,000 Cash Prize' },
  { place: <Star className="w-6 h-6 text-emerald-400" />, label: 'Storytelling Winner', reward: 'Story transformed into an animated film + Official Writer/Creator credit' },
  { place: <Award className="w-6 h-6 text-violet-400" />, label: '2nd & 3rd Place (All Domains)', reward: 'Full-Time Roles, Internships + Premium Software Subscriptions' },
];

const FAQS = [
  {
    q: 'Can I use AI tools like ChatGPT during the hackathon?',
    a: 'Yes — you may use AI assistance for coding, ideation, and content. All code and core logic must be authored by your team during the event.',
  },
  {
    q: 'What happens if my team can\'t submit before the deadline?',
    a: 'Late submissions are not accepted. The backend hard-stops writes after the deadline. Make sure to save a draft early.',
  },
  {
    q: 'Do we need a working prototype to submit?',
    a: 'A working demo is strongly recommended for AI, SaaS, Gaming, and Animation domains. Storytelling requires original stories/screenplays.',
  },
  {
    q: 'Can I participate if I don\'t have a team?',
    a: 'Yes. All domains allow individual participation. Note that team projects may have broader scope.',
  },
  {
    q: 'What are the registration fees?',
    a: 'Fees vary by domain: AI ($25/$35), SaaS ($15/$25), Gaming ($18/$30), Storytelling ($8), Animation ($12/$18). One payment per team covers all members.',
  },
  {
    q: 'When will results be announced?',
    a: 'Results will be shared via email and on the platform after the judging session ends.',
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 sm:px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Resources &amp; Problem Statements
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">AOT Hackathon 2026</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-10 space-y-14 max-w-4xl mx-auto w-full">

          {/* Quick links */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">Quick Access</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>General</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GENERAL_RESOURCES.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="card-cyber p-4 sm:p-5 flex flex-col gap-2 group no-underline"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">{r.icon}</div>
                  <p className="font-semibold text-white text-sm group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                    {r.label}
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed">{r.desc}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div id="tracks">
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">Domains</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Tracks</h2>
            </div>
            <div className="space-y-4">
              {TRACKS.map((track) => (
                <div key={track.id} className={`card-cyber p-4 sm:p-6 border ${track.border}`}>
                  <div className={`inline-flex bg-gradient-to-r ${track.color} rounded-xl px-4 py-2 mb-4 items-center gap-2`}>
                    <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">{track.icon}</span>
                    <span className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                      {track.label}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{track.description}</p>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Helpful Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {track.resources.map((res) => (
                        <a
                          key={res.href}
                          href={res.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
                        >
                          {res.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div id="prizes">
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">Prizes</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>What You Win</h2>
            </div>
            <div className="card-cyber divide-y divide-white/[0.06]">
              {PRIZES.map((p) => (
                <div key={p.label} className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">{p.place}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>{p.label}</p>
                    <p className="text-white/50 text-xs mt-0.5 break-words whitespace-normal">{p.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div id="rules">
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">Rules</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Submission Rules</h2>
            </div>
            <div className="card-cyber p-4 sm:p-6 space-y-4">
              {RULES.map((rule, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div id="faqs">
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">FAQs</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Common Questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="card-cyber p-4 sm:p-6">
                  <p className="font-semibold text-white text-sm mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Q: {faq.q}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="card-cyber p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Ready?</p>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Submit your project before the deadline
              </h3>
            </div>
            <Link href="/dashboard/submit" className="btn-pill btn-primary flex-shrink-0 w-full sm:w-auto justify-center text-center">
              Go to Submit →
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
