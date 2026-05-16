'use client';

import { useState, useEffect, useTransition } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { getAssignedSubmissions, scoreSubmission } from '@/app/actions/judging';
import { Submission } from '@/types';

type SubmissionWithExtras = Submission & { team_name: string; is_scored: boolean };

export default function JudgeDashboard() {
  const [submissions, setSubmissions] = useState<SubmissionWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SubmissionWithExtras | null>(null);
  
  // Score form states
  const [innovation, setInnovation] = useState(5);
  const [technical, setTechnical] = useState(5);
  const [uiUx, setUiUx] = useState(5);
  const [scalability, setScalability] = useState(5);
  const [comments, setComments] = useState('');

  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    const res = await getAssignedSubmissions();
    if (res.success) {
      setSubmissions(res.data);
    }
    setLoading(false);
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  function handleScore(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    startTransition(async () => {
      const res = await scoreSubmission(selected.id, innovation, technical, uiUx, scalability, comments);
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
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              My Assignments
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">Evaluate submissions assigned to you</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">Assigned</p>
              <p className="text-lg font-bold text-white leading-none mt-1">{submissions.length}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">Scored</p>
              <p className="text-lg font-bold text-emerald-400 leading-none mt-1">
                {submissions.filter((s) => s.is_scored).length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-10 space-y-6">
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

          <div className="grid gap-4">
            {loading ? (
              <div className="card-cyber p-20 flex items-center justify-center text-white/20">Loading assignments…</div>
            ) : submissions.length === 0 ? (
              <div className="card-cyber p-20 flex flex-col items-center justify-center text-white/20 text-center">
                <span className="text-4xl mb-4">📭</span>
                <p>No submissions assigned to you yet.</p>
              </div>
            ) : (
              submissions.map((s) => (
                <div
                  key={s.id}
                  className={`card-cyber p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-white/20 group ${
                    s.is_scored ? 'border-emerald-500/20' : ''
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-tighter text-white/40">
                        {s.track}
                      </span>
                      {s.is_scored && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-tighter text-emerald-400">
                          Scored
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
                      <a href={s.repo_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm">
                        Repo
                      </a>
                    )}
                    {s.demo_url && (
                      <a href={s.demo_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm">
                        Demo
                      </a>
                    )}
                    {s.file_url && (
                      <a href={s.file_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-sm">
                        File
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelected(s);
                        setInnovation(5);
                        setTechnical(5);
                        setUiUx(5);
                        setScalability(5);
                        setComments('');
                      }}
                      className={`btn-pill text-xs !py-2.5 ${
                        s.is_scored ? 'btn-outline border-emerald-500/30 text-emerald-400' : 'btn-primary'
                      }`}
                    >
                      {s.is_scored ? 'Re-Score' : 'Score →'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/30 uppercase tracking-widest block mb-2">Innovation (1-10)</label>
                      <input type="number" min="1" max="10" required className="input-nn w-full" value={innovation} onChange={e => setInnovation(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-white/30 uppercase tracking-widest block mb-2">Technical (1-10)</label>
                      <input type="number" min="1" max="10" required className="input-nn w-full" value={technical} onChange={e => setTechnical(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-white/30 uppercase tracking-widest block mb-2">UI/UX (1-10)</label>
                      <input type="number" min="1" max="10" required className="input-nn w-full" value={uiUx} onChange={e => setUiUx(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-white/30 uppercase tracking-widest block mb-2">Scalability (1-10)</label>
                      <input type="number" min="1" max="10" required className="input-nn w-full" value={scalability} onChange={e => setScalability(parseInt(e.target.value))} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/30 uppercase tracking-widest block mb-2">Feedback Comments</label>
                    <textarea rows={3} className="input-nn w-full" value={comments} onChange={e => setComments(e.target.value)} placeholder="Provide constructive feedback..." />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button type="submit" disabled={isPending} className="btn-primary flex-1 !py-3">
                      {isPending ? 'Saving…' : 'Submit Score →'}
                    </button>
                    <button type="button" onClick={() => setSelected(null)} className="btn-outline flex-1 !py-3">
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
