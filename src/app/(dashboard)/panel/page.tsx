'use client';

import { useState, useEffect, useTransition } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import {
  getAssignedSubmissions,
  scoreSubmission,
} from '@/app/actions/judging';
import { Submission, Score } from '@/types';
import { Inbox, X, Filter } from 'lucide-react';
import Link from 'next/link';

type SubmissionWithExtras = Submission & {
  team_name: string;
  is_scored: boolean;
  judge_score: Score | null;
};

const getFileExtension = (url: string) => {
  try {
    const cleanUrl = url.split('?')[0];
    const parts = cleanUrl.split('.');
    if (parts.length > 1) {
      const ext = parts.pop()?.toUpperCase();
      if (ext && ext.length <= 4) {
        return ext;
      }
    }
  } catch (e) {}
  return 'FILE';
};

export default function JudgeDashboard() {
  const [submissions, setSubmissions] = useState<
    SubmissionWithExtras[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [selected, setSelected] =
    useState<SubmissionWithExtras | null>(null);

  const [innovation, setInnovation] =
    useState<number>(0);

  const [technical, setTechnical] =
    useState<number>(0);

  const [uiUx, setUiUx] = useState<number>(0);

  const [scalability, setScalability] =
    useState<number>(0);

  const [comments, setComments] =
    useState('');

  const [toast, setToast] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);

  const [isPending, startTransition] =
    useTransition();

  // Filter state: all, judged, unjudged
  const [filter, setFilter] = useState<'all' | 'judged' | 'unjudged'>('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);

    const res =
      await getAssignedSubmissions();

    if (res.success) {
      setSubmissions(res.data);
    }

    setLoading(false);
  }

  function showToast(
    msg: string,
    ok: boolean
  ) {
    setToast({ msg, ok });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  function openScoringModal(
    submission: SubmissionWithExtras
  ) {
    setSelected(submission);

    if (submission.judge_score) {
      setInnovation(submission.judge_score.innovation_score);
      setTechnical(submission.judge_score.technical_score);
      setUiUx(submission.judge_score.ui_ux_score);
      setScalability(submission.judge_score.scalability_score);
      setComments(submission.judge_score.comments || '');
    } else {
      setInnovation(0);
      setTechnical(0);
      setUiUx(0);
      setScalability(0);
      setComments('');
    }
  }

  function handleScore(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!selected) return;

    if (
      innovation < 0 || innovation > 10 ||
      technical < 0 || technical > 10 ||
      uiUx < 0 || uiUx > 10 ||
      scalability < 0 || scalability > 10
    ) {
      showToast('All scores must be between 0 and 10.', false);
      return;
    }

    startTransition(async () => {
      const res =
        await scoreSubmission(
          selected.id,
          innovation,
          technical,
          uiUx,
          scalability,
          comments
        );

      if (res.success) {
        showToast(
          `${selected.team_name} scored successfully!`,
          true
        );

        setSelected(null);

        fetchSubmissions();
      } else {
        showToast(res.error, false);
      }
    });
  }

  return (
    <main className="min-h-screen flex bg-black text-white w-full max-w-[100vw] overflow-x-hidden">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0 max-w-full">

        {/* HEADER */}

        <div className="border-b border-white/[0.06] px-4 sm:px-6 md:px-10 pt-16 pb-5 md:pt-5 space-y-4">

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Judge Panel
              </h1>
              <p className="text-white/30 text-sm mt-1">
                Review and score assigned hackathon projects
              </p>
            </div>

            {/* Stats + Progress + Filter */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {/* Assigned */}
              <div>
                <p className="text-[10px] sm:text-xs uppercase text-white/30 tracking-widest">Assigned</p>
                <p className="text-lg sm:text-2xl font-bold">{submissions.length}</p>
              </div>

              <div className="h-8 w-px bg-white/10" />

              {/* Scored */}
              <div>
                <p className="text-[10px] sm:text-xs uppercase text-white/30 tracking-widest">Scored</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {submissions.filter((s) => s.is_scored).length}
                </p>
              </div>

              {/* Progress bar */}
              {submissions.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-24 sm:w-32 lg:w-40 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(submissions.filter((s) => s.is_scored).length / submissions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/50 font-medium whitespace-nowrap">
                    {submissions.filter((s) => s.is_scored).length} of {submissions.length} scored
                  </span>
                </div>
              )}

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                <Filter size={16} className="text-white/50 shrink-0" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="bg-white/5 text-white text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-white/30 transition-colors cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 5l3 3 3-3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}
                >
                  <option value="all">All</option>
                  <option value="judged">Judged</option>
                  <option value="unjudged">Unjudged</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* CONTENT */}

        <div className="p-4 sm:p-5 md:p-10 space-y-6">

          {/* TOAST */}

          {toast && (
            <div
              className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-4 rounded-xl border shadow-2xl animate-in fade-in slide-in-from-top-5 max-w-[90vw] md:max-w-md w-max ${
                toast.ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {toast.msg}
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="card-cyber p-6 sm:p-10 md:p-20 flex items-center justify-center text-white/30">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="card-cyber p-6 sm:p-10 md:p-20 flex flex-col items-center justify-center text-center text-white/30">
              <span className="text-5xl mb-4">
                <Inbox className="w-12 h-12 text-white/20" />
              </span>

              <p>
                No submissions assigned yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">

              {(filter === 'all' ? submissions : filter === 'judged' ? submissions.filter(s => s.is_scored) : submissions.filter(s => !s.is_scored)).map((s) => (

                <div
                  key={s.id}
                  className={`card-cyber p-4 sm:p-6 transition-all hover:border-white/20 ${s.is_scored
                      ? 'border-emerald-500/20'
                      : ''
                    }`}
                >

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-6">

                    {/* LEFT */}

                    <div className="space-y-3 flex-1 min-w-0">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                          {s.track}
                        </span>

                        {s.is_scored && (
                          <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-wider text-emerald-400">
                            Scored
                          </span>
                        )}

                      </div>

                      <div>

                        <h2 className="text-lg sm:text-xl font-bold break-words">
                          {s.title}
                        </h2>

                        <p className="text-sm text-white/40 mt-1">
                          Team:{' '}
                          <span className="text-white/70">
                            {s.team_name}
                          </span>
                        </p>

                      </div>

                      <p className="text-sm text-white/50 leading-relaxed">
                        {s.description}
                      </p>

                      {s.is_scored && s.judge_score && (
                        <div className="text-xs bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 sm:p-4 space-y-2 max-w-xl">
                          <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Your Score Breakdown</div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-white/70">
                            <div>
                              <span className="text-white/40 block">Innovation</span>
                              <strong className="text-sm text-white">{s.judge_score.innovation_score}</strong>
                            </div>
                            <div>
                              <span className="text-white/40 block">Technical</span>
                              <strong className="text-sm text-white">{s.judge_score.technical_score}</strong>
                            </div>
                            <div>
                              <span className="text-white/40 block">UI/UX</span>
                              <strong className="text-sm text-white">{s.judge_score.ui_ux_score}</strong>
                            </div>
                            <div>
                              <span className="text-white/40 block">Scalability</span>
                              <strong className="text-sm text-white">{s.judge_score.scalability_score}</strong>
                            </div>
                          </div>
                          <div className="border-t border-white/[0.06] pt-2 flex items-center justify-end text-xs text-white/60">
                            <span className="text-emerald-400 font-bold text-sm">
                              Average: {((s.judge_score.innovation_score + s.judge_score.technical_score + s.judge_score.ui_ux_score + s.judge_score.scalability_score) / 4).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 flex-wrap lg:flex-nowrap lg:min-w-[160px]">

                      {s.repo_url && (
                        <a
                          href={s.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-center text-sm flex-1 lg:flex-none"
                        >
                          Open Repo
                        </a>
                      )}

                      {s.demo_url && (
                        <a
                          href={s.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-center text-sm flex-1 lg:flex-none"
                        >
                          Live Demo
                        </a>
                      )}

                      {s.file_url && (
                        <a
                          href={s.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-center text-sm flex-1 lg:flex-none"
                        >
                          View File ({getFileExtension(s.file_url)})
                        </a>
                      )}

                      <Link
                        href={`/panel/${s.id}`}
                        className="btn-outline text-center text-sm flex-1 lg:flex-none"
                      >
                        View Details →
                      </Link>

                      <button
                        onClick={() => {
                          if (s.is_scored && !window.confirm('Are you sure you want to re-score this project? The existing scores will be overwritten.')) {
                            return;
                          }
                          openScoringModal(s);
                        }}
                        className={`btn-pill w-full ${s.is_scored
                            ? 'btn-outline border-emerald-500/30 text-emerald-400'
                            : 'btn-primary'
                          }`}
                      >
                        {s.is_scored
                          ? 'Re-Score'
                          : 'Score Project →'}
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* MODAL */}

        {selected && (

          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">

            <div className="card-cyber w-full sm:max-w-2xl p-0 overflow-hidden rounded-t-2xl sm:rounded-2xl max-h-[90vh] sm:max-h-none flex flex-col">

              {/* TOP */}

              <div className="p-4 sm:p-6 border-b border-white/[0.06] flex items-center justify-between shrink-0">

                <div>

                  <h2 className="text-lg sm:text-2xl font-bold">
                    Score Submission
                  </h2>

                  <p className="text-white/40 text-sm mt-1 truncate max-w-[200px] sm:max-w-none">
                    {selected.team_name}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

              {/* BODY */}

              <div className="p-4 sm:p-6 overflow-y-auto flex-1">

                <form
                  onSubmit={handleScore}
                  className="space-y-5"
                >

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs uppercase text-white/30 block">
                          Innovation
                        </label>
                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                          {innovation}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={innovation}
                        onChange={(e) => {
                          setInnovation(parseInt(e.target.value));
                        }}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs uppercase text-white/30 block">
                          Technical
                        </label>
                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                          {technical}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={technical}
                        onChange={(e) => {
                          setTechnical(parseInt(e.target.value));
                        }}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs uppercase text-white/30 block">
                          UI / UX
                        </label>
                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                          {uiUx}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={uiUx}
                        onChange={(e) => {
                          setUiUx(parseInt(e.target.value));
                        }}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs uppercase text-white/30 block">
                          Scalability
                        </label>
                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                          {scalability}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={scalability}
                        onChange={(e) => {
                          setScalability(parseInt(e.target.value));
                        }}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                        required
                      />
                    </div>

                  </div>

                  <div>

                    <label className="text-xs uppercase text-white/30 mb-2 block">
                      Feedback
                    </label>

                    <textarea
                      rows={4}
                      value={comments}
                      onChange={(e) =>
                        setComments(
                          e.target.value
                        )
                      }
                      placeholder="Provide detailed feedback..."
                      className="input-nn w-full"
                    />

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">

                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-primary flex-1 !py-3 order-1 sm:order-none"
                    >
                      {isPending
                        ? 'Saving...'
                        : 'Submit Score →'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelected(null)
                      }
                      className="btn-outline flex-1 !py-3 order-2 sm:order-none"
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