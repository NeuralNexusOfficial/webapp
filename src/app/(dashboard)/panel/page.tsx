'use client';

import { useState, useEffect, useTransition } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import {
  getAssignedSubmissions,
  scoreSubmission,
} from '@/app/actions/judging';
import { Submission, Score } from '@/types';
import { Inbox, X } from 'lucide-react';
import Link from 'next/link';

type SubmissionWithExtras = Submission & {
  team_name: string;
  is_scored: boolean;
  judge_score: Score | null;
};

export default function JudgeDashboard() {
  const [submissions, setSubmissions] = useState<
    SubmissionWithExtras[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [selected, setSelected] =
    useState<SubmissionWithExtras | null>(null);

  const [innovation, setInnovation] =
    useState<number | ''>(1);

  const [technical, setTechnical] =
    useState<number | ''>(1);

  const [uiUx, setUiUx] = useState<number | ''>(1);

  const [scalability, setScalability] =
    useState<number | ''>(1);

  const [comments, setComments] =
    useState('');

  const [toast, setToast] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);

  const [isPending, startTransition] =
    useTransition();

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
      setInnovation(1);
      setTechnical(1);
      setUiUx(1);
      setScalability(1);
      setComments('');
    }
  }

  function handleScore(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!selected) return;

    if (
      innovation === '' ||
      technical === '' ||
      uiUx === '' ||
      scalability === ''
    ) {
      showToast('All scores must be between 1 and 10.', false);
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
    <main className="min-h-screen flex bg-black text-white">
      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">

        {/* HEADER */}

        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">

          <div className="pl-10 md:pl-0">

            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{
                fontFamily:
                  'var(--font-display)',
              }}
            >
              Judge Panel
            </h1>

            <p className="text-white/30 text-sm mt-1">
              Review and score assigned
              hackathon projects
            </p>

          </div>

          <div className="hidden md:flex items-center gap-6">

            <div className="text-right">
              <p className="text-xs uppercase text-white/30 tracking-widest">
                Assigned
              </p>

              <p className="text-2xl font-bold">
                {submissions.length}
              </p>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="text-right">
              <p className="text-xs uppercase text-white/30 tracking-widest">
                Scored
              </p>

              <p className="text-2xl font-bold text-emerald-400">
                {
                  submissions.filter(
                    (s) => s.is_scored
                  ).length
                }
              </p>
            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-5 md:p-10 space-y-6">

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
            <div className="card-cyber p-20 flex items-center justify-center text-white/30">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="card-cyber p-20 flex flex-col items-center justify-center text-center text-white/30">
              <span className="text-5xl mb-4">
                <Inbox className="w-12 h-12 text-white/20" />
              </span>

              <p>
                No submissions assigned yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">

              {submissions.map((s) => (

                <div
                  key={s.id}
                  className={`card-cyber p-6 transition-all hover:border-white/20 ${s.is_scored
                      ? 'border-emerald-500/20'
                      : ''
                    }`}
                >

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    {/* LEFT */}

                    <div className="space-y-3 flex-1">

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

                        <h2 className="text-xl font-bold">
                          {s.title}
                        </h2>

                        <p className="text-sm text-white/40 mt-1">
                          Team:{' '}
                          <span className="text-white/70">
                            {s.team_name}
                          </span>
                        </p>

                      </div>

                      <p className="text-sm text-white/50 leading-relaxed max-w-3xl">
                        {s.description}
                      </p>

                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-col gap-3 min-w-[180px]">

                      {s.repo_url && (
                        <a
                          href={s.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-center"
                        >
                          Open Repo
                        </a>
                      )}

                      {s.demo_url && (
                        <a
                          href={s.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-center"
                        >
                          Live Demo
                        </a>
                      )}

                      {s.file_url && (
                        <a
                          href={s.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline text-center"
                        >
                          View File
                        </a>
                      )}

                      <Link
                        href={`/panel/${s.id}`}
                        className="btn-outline text-center text-sm"
                      >
                        View Details →
                      </Link>

                      <button
                        onClick={() =>
                          openScoringModal(s)
                        }
                        className={`btn-pill ${s.is_scored
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

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

            <div className="card-cyber w-full max-w-2xl p-0 overflow-hidden">

              {/* TOP */}

              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    Score Submission
                  </h2>

                  <p className="text-white/40 text-sm mt-1">
                    {selected.team_name}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="w-9 h-9 rounded-full hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

              {/* BODY */}

              <div className="p-6 max-h-[70vh] overflow-y-auto">

                <form
                  onSubmit={handleScore}
                  className="space-y-6"
                >

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="text-xs uppercase text-white/30 mb-2 block">
                        Innovation
                      </label>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={innovation}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setInnovation(isNaN(val) ? '' : val);
                        }}
                        className="input-nn w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase text-white/30 mb-2 block">
                        Technical
                      </label>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={technical}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setTechnical(isNaN(val) ? '' : val);
                        }}
                        className="input-nn w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase text-white/30 mb-2 block">
                        UI / UX
                      </label>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={uiUx}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setUiUx(isNaN(val) ? '' : val);
                        }}
                        className="input-nn w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase text-white/30 mb-2 block">
                        Scalability
                      </label>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={scalability}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setScalability(isNaN(val) ? '' : val);
                        }}
                        className="input-nn w-full"
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

                  <div className="flex gap-3 pt-4 border-t border-white/5">

                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-primary flex-1 !py-3"
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