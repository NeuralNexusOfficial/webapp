'use client';

import { useState, useTransition, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { upsertSubmission, getMySubmission, lockSubmission } from '@/app/actions/submission';
import { Track, Submission } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRef } from 'react';

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
  file_url: string;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  'pdf',
  'ppt',
  'pptx',
  'doc',
  'docx',
];

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    track: '',
    repo_url: '',
    demo_url: '',
    file_url: '',
  });
  const [existing, setExisting] = useState<Submission | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          file_url: s.file_url ?? '',
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
    if (isLocked) return;
    if (
          !form.title.trim() ||
          !form.description.trim()
        ) {
          showToast(
            'Please complete all required fields.',
            false
          );

          return;
        }
    if (!form.track) {
      showToast('Please select a track before saving.', false);
      return;
    }
    const urlRegex = /^https?:\/\/.+/;

    if (
      form.repo_url &&
      !urlRegex.test(form.repo_url)
    ) {
      showToast(
        'Invalid repository URL.',
        false
      );

      return;
    }

    if (
      form.demo_url &&
      !urlRegex.test(form.demo_url)
    ) {
      showToast(
        'Invalid demo URL.',
        false
      );

      return;
    }
    startTransition(async () => {
      const res = await upsertSubmission({
        title: form.title,
        description: form.description,
        track: form.track as Track,
        repo_url: form.repo_url,
        demo_url: form.demo_url,
        file_url: form.file_url,
      });
      if (res.success) {
        setExisting(res.data);
        showToast('Submission saved successfully!', true);
      } else {
        showToast(res.error, false);
      }
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase();

  if (
    !extension ||
    !ALLOWED_EXTENSIONS.includes(extension)
  ) {
    showToast(
      'Invalid file format.',
      false
    );

    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showToast(
      'File size exceeds 20MB.',
      false
    );

    return;
  }

    // Check deadline before upload
    const deadline = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE ? new Date(process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE) : null;
    if (deadline && new Date() > deadline) {
      showToast('Submission deadline has passed. Uploads are no longer allowed.', false);
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('submission-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('submission-files')
        .getPublicUrl(filePath);

      setForm(f => ({ ...f, file_url: publicUrl }));
      showToast('File uploaded successfully!', true);
    } catch (error: any) {
      showToast(error.message || 'Error uploading file', false);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFinalize() {
    if (!existing) return;
    if (!window.confirm('Are you sure? Once finalized, you cannot edit your submission again.')) return;

    startTransition(async () => {
      const res = await lockSubmission();
      if (res.success) {
        setExisting(res.data);
        showToast('Submission finalized and locked!', true);
      } else {
        showToast(res.error, false);
      }
    });
  }

  const deadlineDate = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE ? new Date(process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE) : null;
  const isPastDeadline = deadlineDate ? new Date() > deadlineDate : false;
  const isLocked = existing?.status === 'SUBMITTED' || existing?.status === 'JUDGED' || isPastDeadline;

  const deadlineStr = deadlineDate
    ? deadlineDate.toLocaleString('en-IN', {
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
            <div className={`card-cyber p-5 flex items-start gap-4 ${isLocked ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                isLocked ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isLocked ? '🔒' : '✓'}
              </div>
              <div>
                <p className="text-emerald-400 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  {isLocked ? 'Submission Finalized' : 'Draft Saved'}
                </p>
                <p className="text-white/40 text-sm mt-0.5">
                  {isLocked ? 'Finalized on' : 'Last saved'}:{' '}
                  {existing.submitted_at
                    ? new Date(existing.submitted_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                    : '—'}
                  {' '}· Status: <span className="text-white/60 font-mono tracking-tight">{existing.status}</span>
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
                      disabled={isLocked}
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
                      disabled={isLocked}
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
                          onClick={() => !isLocked && handleChange('track', t.value)}
                          disabled={isLocked}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            selected
                              ? 'bg-white/10 border-white/40 text-white'
                              : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'
                          } ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
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
                      disabled={isLocked}
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
                      disabled={isLocked}
                    />
                  </label>
                </div>

                {/* File upload */}
                <div className="card-cyber p-6">
                  <span className="text-xs text-white/40 uppercase tracking-widest mb-4 block">File Upload (optional)</span>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    disabled={isLocked}
                  />

                  {form.file_url ? (
                    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 flex items-center justify-between gap-4 animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">📄</div>
                        <div>
                          <p className="text-emerald-400 font-semibold text-sm">File Uploaded</p>
                          <a 
                            href={form.file_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-white/40 text-xs hover:text-white transition-colors"
                          >
                            View uploaded file →
                          </a>
                        </div>
                      </div>
                      {!isLocked && (
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, file_url: '' }))}
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => !isLocked && !isUploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center transition-all ${
                        isLocked || isUploading
                          ? 'border-white/[0.06] opacity-30 cursor-not-allowed'
                          : 'border-white/[0.12] hover:border-white/30 cursor-pointer hover:bg-white/[0.02]'
                      }`}
                    >
                      {isUploading ? (
                        <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full mb-2" />
                      ) : (
                        <div className="text-3xl">📁</div>
                      )}
                      <p className="text-white/50 text-sm font-medium">
                        {isUploading ? 'Uploading file...' : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-white/30 text-xs">PDF, PPT, or DOC files ≤ 20 MB</p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {!isLocked && (
                    <button
                      id="save-submission-btn"
                      type="submit"
                      disabled={isPending}
                      className={`btn-pill ${isPending ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {isPending ? 'Saving…' : `${existing ? 'Update' : 'Save'} Draft →`}
                    </button>
                  )}

                  {existing && !isLocked && (
                    <button
                      id="finalize-submission-btn"
                      type="button"
                      onClick={handleFinalize}
                      disabled={isPending}
                      className="btn-pill border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Finalize & Lock →
                    </button>
                  )}

                  {isLocked && (
                    <div className="text-emerald-400 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span>🔒 Submission Locked {isPastDeadline ? '(Deadline Passed)' : ''}</span>
                    </div>
                  )}

                  <p className="text-xs text-white/30">
                    {isLocked 
                      ? "This project has been submitted and can no longer be edited."
                      : "You can update anytime before the deadline."}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
