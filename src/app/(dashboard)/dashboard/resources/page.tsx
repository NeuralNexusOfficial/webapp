'use client';

import Sidebar from '@/components/dashboard/sidebar';
import Link from 'next/link';

const TRACKS = [
  {
    id: 'ai-ml',
    icon: '🤖',
    label: 'AI / ML',
    color: 'from-violet-500/10 to-purple-500/5',
    border: 'border-violet-500/20',
    description: 'Machine learning, neural networks, large language models, and computer vision.',
    resources: [
      { label: 'OpenAI API Docs', href: 'https://platform.openai.com/docs' },
      { label: 'HuggingFace Spaces', href: 'https://huggingface.co/spaces' },
      { label: 'Kaggle Datasets', href: 'https://www.kaggle.com/datasets' },
      { label: 'Google Colab', href: 'https://colab.research.google.com' },
    ],
  },
  {
    id: 'web3',
    icon: '⛓️',
    label: 'Web3',
    color: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/20',
    description: 'Blockchain applications, smart contracts, DeFi protocols, and decentralised identity.',
    resources: [
      { label: 'Ethereum Docs', href: 'https://ethereum.org/developers' },
      { label: 'Solidity by Example', href: 'https://solidity-by-example.org' },
      { label: 'Hardhat', href: 'https://hardhat.org' },
      { label: 'The Graph', href: 'https://thegraph.com' },
    ],
  },
  {
    id: 'healthtech',
    icon: '🏥',
    label: 'HealthTech',
    color: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/20',
    description: 'Digital health, telemedicine, mental wellness, and biomedical data analysis.',
    resources: [
      { label: 'FHIR API Standard', href: 'https://www.hl7.org/fhir' },
      { label: 'PhysioNet Datasets', href: 'https://physionet.org' },
      { label: 'WHO Open Data', href: 'https://www.who.int/data' },
      { label: 'NIH Open Data', href: 'https://www.nlm.nih.gov/databases' },
    ],
  },
  {
    id: 'fintech',
    icon: '💰',
    label: 'FinTech',
    color: 'from-sky-500/10 to-blue-500/5',
    border: 'border-sky-500/20',
    description: 'Payments, banking infrastructure, insurance, robo-advisory, and personal finance.',
    resources: [
      { label: 'Razorpay APIs', href: 'https://razorpay.com/docs/api' },
      { label: 'Plaid API', href: 'https://plaid.com/docs' },
      { label: 'Alpha Vantage (Market Data)', href: 'https://www.alphavantage.co' },
      { label: 'SEBI Open Data', href: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doOpenData=yes' },
    ],
  },
  {
    id: 'open-innovation',
    icon: '🚀',
    label: 'Open Innovation',
    color: 'from-rose-500/10 to-pink-500/5',
    border: 'border-rose-500/20',
    description: 'No constraints — build anything that solves a real problem. Impress the judges.',
    resources: [
      { label: 'Product Hunt', href: 'https://www.producthunt.com' },
      { label: 'Vercel AI SDK', href: 'https://sdk.vercel.ai/docs' },
      { label: 'Supabase Docs', href: 'https://supabase.com/docs' },
      { label: 'GitHub Student Pack', href: 'https://education.github.com/pack' },
    ],
  },
];

const GENERAL_RESOURCES = [
  {
    icon: '📋',
    label: 'Submission Rules',
    desc: 'Deadline, required fields, and submission process',
    href: '#rules',
  },
  {
    icon: '🏆',
    label: 'Prizes & Judging',
    desc: 'Prize pool breakdown and judging criteria',
    href: '#prizes',
  },
  {
    icon: '❓',
    label: 'FAQs',
    desc: 'Common questions answered',
    href: '#faqs',
  },
  {
    icon: '💬',
    label: 'Discord Community',
    desc: 'Ask questions, find teammates, get updates',
    href: 'https://discord.gg/neuralnexus',
  },
];

const RULES = [
  'All code must be written during the hackathon window. Using open-source libraries, APIs, and frameworks is allowed.',
  'Teams can have 2–5 members. Solo participation is permitted.',
  'Each team may only submit one project. The last saved draft before the deadline counts.',
  'Projects must be original work and must not infringe on third-party IP.',
  'The project must address at least one of the listed tracks or clearly state its impact.',
  'All team members must have completed registration (paid ₹500 fee) to be eligible for prizes.',
  'Judges\' decisions are final. Winners will be announced within 48 hours of the judging session.',
];

const PRIZES = [
  { place: '🥇', label: '1st Place', reward: '₹50,000 + Swag + Internship Interviews' },
  { place: '🥈', label: '2nd Place', reward: '₹25,000 + Swag' },
  { place: '🥉', label: '3rd Place', reward: '₹10,000 + Swag' },
  { place: '🌟', label: 'Best AI/ML Project', reward: '₹15,000 + Cloud Credits' },
  { place: '⛓️', label: 'Best Web3 Project', reward: '₹15,000 + Blockchain Tools' },
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
    a: 'A working demo is strongly recommended. Submissions without a demo or repo link may be scored lower on the implementation criterion.',
  },
  {
    q: 'Can I participate if I don\'t have a team?',
    a: 'Yes. Select "Go Solo" in the dashboard. Note that team projects historically score higher due to scope.',
  },
  {
    q: 'When will results be announced?',
    a: 'Results will be shared via email and on the platform within 48 hours of the judging session ending.',
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Resources & Problem Statements
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">NeuralNexus Hackathon 2026</p>
          </div>
        </div>

        <div className="p-5 md:p-10 space-y-14 max-w-4xl">

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
                  className="card-cyber p-5 flex flex-col gap-2 group no-underline"
                >
                  <div className="text-2xl">{r.icon}</div>
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
              <div className="tag-label">Problem Statements</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Tracks</h2>
            </div>
            <div className="space-y-4">
              {TRACKS.map((track) => (
                <div key={track.id} className={`card-cyber p-6 border ${track.border}`}>
                  <div className={`inline-flex bg-gradient-to-r ${track.color} rounded-xl px-4 py-2 mb-4 items-center gap-2`}>
                    <span className="text-xl">{track.icon}</span>
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
                <div key={p.label} className="flex items-center gap-4 p-5">
                  <div className="text-2xl w-10 text-center flex-shrink-0">{p.place}</div>
                  <div>
                    <p className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>{p.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{p.reward}</p>
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
            <div className="card-cyber p-6 space-y-3">
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
                <div key={i} className="card-cyber p-6">
                  <p className="font-semibold text-white text-sm mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Q: {faq.q}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="card-cyber p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Ready?</p>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Submit your project before the deadline
              </h3>
            </div>
            <Link href="/dashboard/submit" className="btn-pill btn-primary flex-shrink-0">
              Go to Submit →
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
