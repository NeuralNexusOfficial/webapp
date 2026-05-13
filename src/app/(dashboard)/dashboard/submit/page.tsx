'use client';

import { useState, useTransition, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { upsertSubmission, getMySubmission, type Track, type SubmissionRow } from '@/app/actions/submission';

const TRACKS: { value: Track; label: string; desc: string }[] = [
  { value: 'AI/ML',          label: '🤖 AI / ML',         desc: 'Machine learning, neural networks, LLMs, computer vision' },
  { value: 'Web3',           label: '⛓️ Web3',             desc: 'Blockchain, DeFi, NFTs, decentralised apps' },
  { value: 'HealthTech',     label: '🏥 HealthTech',       desc: 'Digital health, medtech, mental wellness, biotech' },
  { value: 'FinTech',        label: '💰 FinTech',          desc: 'Payments, banking, insurance, personal finance' },
  { value: 'OpenInnovation', label: '🚀 Open Innovation',  desc: 'Anything that doesn\'t fit the above — surprise us!' },
];

type FormState = {
  title: string;
  description: string;
  track: Track | '';
  repo_url: string;
  demo_url: string;
};

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    track: '',
    repo_url: '',
    demo_url: '',
  });
  const [existing, setExisting] = useState<SubmissionRow | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [charCount, setCharCount] = useState(0);

  // Load existing submission on mount
  useEffect(() => {
    getMySubmission().then((res) => {
      if (res.success && res.data) {
        const s = res.data;
        setExisting(s);
        setForm({
          title: s.title ?? '',
          description: s.description ?? '',
          track: s.track ?? '',
          repo_url: s.repo_url ?? '',
          demo_url: s.demo_url ?? '',
        });
        setCharCount((s.description ?? '').length);
      }
      setLoadingExisting(false);
    });
  }, []);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  }

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === 'description') setCharCount((value as string).length);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.track) {
      showToast('Please select a track before saving.', false);
      return;
    }
    startTransition(async () => {
      const res = await upsertSubmission({
        title: form.title,
        description: form.description,
        track: form.track as Track,
        repo_url: form.repo_url,
        demo_url: form.demo_url,
      });
      if (res.success) {
        setExisting(res.data);
        showToast('Submission saved successfully!', true);
      } else {
        showToast(res.error, false);
      }
    });
  }

  const deadlineStr = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE
    ? new Date(process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE).toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : 'TBD';

  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Submit Project
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">NeuralNexus Hackathon 2026</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
            Deadline: {deadlineStr}
          </div>
        </div>

        <div className="p-5 md:p-10 space-y-8 max-w-3xl">

          {/* Status banner */}
          {existing && (
            <div className="card-cyber p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg flex-shrink-0">✓</div>
              <div>
                <p className="text-emerald-400 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  Draft Saved
                </p>
                <p className="text-white/40 text-sm mt-0.5">
                  Last saved:{' '}
                  {existing.submitted_at
                    ? new Date(existing.submitted_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                    : '—'}
                  {' '}· Status: <span className="text-white/60">{existing.status}</span>
                </p>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div
              className={`px-5 py-4 rounded-xl text-sm font-medium border ${
                toast.ok
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {toast.msg}
            </div>
          )}

          {/* Submission form */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">Project Details</div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Your Submission
              </h2>
            </div>

            {loadingExisting ? (
              <div className="card-cyber p-10 flex items-center justify-center text-white/30 text-sm">
                Loading…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="card-cyber p-6 space-y-4">
                  <label className="block">
                    <span className="text-xs text-white/40 uppercase tracking-widest mb-2 block">
                      Project Title <span className="text-red-400">*</span>
                    </span>
                    <input
                      id="submit-title"
                      type="text"
                      className="input-nn"
                      placeholder="e.g. MediScan — AI-powered drug interaction checker"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                      maxLength={120}
                    />
                  </label>

                  {/* Description */}
                  <label className="block">
                    <span className="text-xs text-white/40 uppercase tracking-widest mb-2 flex justify-between">
                      <span>
                        Description <span className="text-red-400">*</span>
                      </span>
                      <span className={charCount > 900 ? 'text-amber-400' : ''}>{charCount}/1000</span>
                    </span>
                    <textarea
                      id="submit-description"
                      className="input-nn min-h-[140px] resize-y"
                      placeholder="Describe what your project does, the problem it solves, and the tech stack you used…"
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                      maxLength={1000}
                    />
                  </label>
                </div>

                {/* Track selector */}
                <div className="card-cyber p-6">
                  <span className="text-xs text-white/40 uppercase tracking-widest mb-4 block">
                    Track <span className="text-red-400">*</span>
                  </span>
                  <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Select hackathon track">
                    {TRACKS.map((t) => {
                      const selected = form.track === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          id={`track-${t.value.toLowerCase().replace('/', '-')}`}
                          role="radio"
                          aria-checked={selected}
                          onClick={() => handleChange('track', t.value)}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selected
                              ? 'bg-white/10 border-white/40 text-white'
                              : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'
                          }`}
                        >
                          <p className="font-semibold text-sm mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                            {t.label}
                          </p>
                          <p className="text-xs opacity-70 leading-relaxed">{t.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Links */}
                <div className="card-cyber p-6 space-y-4">
                  <span className="text-xs text-white/40 uppercase tracking-widest block">Links (optional)</span>
                  <label className="block">
                    <span className="text-xs text-white/30 mb-2 block">GitHub / GitLab Repo</span>
                    <input
                      id="submit-repo"
                      type="url"
                      className="input-nn"
                      placeholder="https://github.com/your-team/project"
                      value={form.repo_url}
                      onChange={(e) => handleChange('repo_url', e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-white/30 mb-2 block">Demo URL / Video Link</span>
                    <input
                      id="submit-demo"
                      type="url"
                      className="input-nn"
                      placeholder="https://youtu.be/your-demo or https://your-live-app.vercel.app"
                      value={form.demo_url}
                      onChange={(e) => handleChange('demo_url', e.target.value)}
                    />
                  </label>
                </div>

                {/* File upload placeholder */}
                <div className="card-cyber p-6">
                  <span className="text-xs text-white/40 uppercase tracking-widest mb-4 block">File Upload (optional)</span>
                  <div
                    className="border-2 border-dashed border-white/[0.12] rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-not-allowed opacity-50"
                    aria-label="File upload — coming soon"
                  >
                    <div className="text-3xl">📁</div>
                    <p className="text-white/50 text-sm font-medium">Drag & drop or click to upload</p>
                    <p className="text-white/30 text-xs">PDF, ZIP, or any file ≤ 50 MB</p>
                    <div className="tag-label mt-1">Coming soon</div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                  <button
                    id="save-submission-btn"
                    type="submit"
                    disabled={isPending}
                    className={`btn-pill ${isPending ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                  >
                    {isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      `${existing ? 'Update' : 'Save'} Submission →`
                    )}
                  </button>
                  <p className="text-xs text-white/30">You can update anytime before the deadline.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
