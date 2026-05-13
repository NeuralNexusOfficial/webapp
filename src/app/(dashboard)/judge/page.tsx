'use client';

import { useState, useEffect, useTransition } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { getAllSubmissions, scoreSubmission } from '@/app/actions/judging';
import { Submission, Track } from '@/types';

type SubmissionWithTeam = Submission & { team_name: string };

export default function JudgeDashboard() {
  const [submissions, setSubmissions] = useState<SubmissionWithTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Track | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SubmissionWithTeam | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    const res = await getAllSubmissions();
    if (res.success) {
      setSubmissions(res.data);
    }
    setLoading(false);
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  const filtered = submissions.filter((s) => {
    const matchesTrack = filter === 'ALL' || s.track === filter;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.team_name.toLowerCase().includes(search.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  function handleScore(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    startTransition(async () => {
      const res = await scoreSubmission(selected.id, score);
      if (res.success) {
        showToast(`Scored ${selected.team_name} successfully!`, true);
        setSelected(null);
        fetchSubmissions(); // Refresh list
      } else {
        showToast(res.error, false);
      }
    });
  }

  return (
    <main className="min-h-screen flex">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Judging Portal
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">Review and score hackathon projects</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">Total Projects</p>
              <p className="text-lg font-bold text-white leading-none mt-1">{submissions.length}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">Reviewed</p>
              <p className="text-lg font-bold text-emerald-400 leading-none mt-1">
                {submissions.filter((s) => s.status === 'JUDGED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-10 space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {['ALL', 'AI/ML', 'Web3', 'HealthTech', 'FinTech', 'OpenInnovation'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                    filter === t
                      ? 'bg-white text-black border-white'
                      : 'text-white/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search projects or teams…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-nn pl-10 !py-2 text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">🔍</span>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div
              className={`px-5 py-4 rounded-xl text-sm font-medium border animate-in fade-in slide-in-from-top-4 ${
                toast.ok
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {toast.msg}
            </div>
          )}

          {/* Submissions List */}
          <div className="grid gap-4">
            {loading ? (
              <div className="card-cyber p-20 flex items-center justify-center text-white/20">Loading submissions…</div>
            ) : filtered.length === 0 ? (
              <div className="card-cyber p-20 flex flex-col items-center justify-center text-white/20 text-center">
                <span className="text-4xl mb-4">📭</span>
                <p>No submissions found matching your filters.</p>
              </div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className={`card-cyber p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-white/20 group ${
                    s.status === 'JUDGED' ? 'border-emerald-500/20' : ''
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-tighter text-white/40">
                        {s.track}
                      </span>
                      {s.status === 'JUDGED' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-tighter text-emerald-400">
                          Scored: {s.score}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-white/40 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      Team: <span className="text-white/60 font-medium">{s.team_name}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {s.repo_url && (
                      <a
                        href={s.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                        title="GitHub Repo"
                      >
                        💻
                      </a>
                    )}
                    {s.demo_url && (
                      <a
                        href={s.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                        title="Live Demo"
                      >
                        🌐
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelected(s);
                        setScore(s.score || 0);
                      }}
                      className={`btn-pill text-xs !py-2.5 ${
                        s.status === 'JUDGED' ? 'btn-outline border-emerald-500/30 text-emerald-400' : 'btn-primary'
                      }`}
                    >
                      {s.status === 'JUDGED' ? 'Edit Score' : 'Score Project →'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scoring Modal Overlay */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="card-cyber !p-0 w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-zinc-900/50">
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Score Project
                  </h2>
                  <p className="text-xs text-white/40 mt-1">{selected.team_name}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs text-white/30 uppercase tracking-widest block mb-2">Project Description</label>
                  <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {selected.description}
                  </p>
                </div>

                <form onSubmit={handleScore} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs text-white/30 uppercase tracking-widest block">Final Score (0-100)</label>
                      <span className="text-2xl font-bold text-emerald-400 font-mono">{score}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={score}
                      onChange={(e) => setScore(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-white/20 uppercase tracking-tighter">
                      <span>Incomplete</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-primary flex-1 !py-3"
                    >
                      {isPending ? 'Saving…' : 'Submit Score →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="btn-outline flex-1 !py-3"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
