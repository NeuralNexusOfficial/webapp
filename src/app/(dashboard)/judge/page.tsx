'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import Sidebar from '@/components/dashboard/sidebar';

import { getAssignedSubmissions } from '@/app/actions/judging';

import { Submission } from '@/types';

type SubmissionWithExtras = Submission & {
  team_name: string;
  is_scored: boolean;
};

export default function JudgeDashboard() {
  const [submissions, setSubmissions] = useState<
    SubmissionWithExtras[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);

    const res =
      await getAssignedSubmissions();

    if (res.success) {
      setSubmissions(res.data);
    } else {
      showToast(
        res.error ||
          'Failed to load submissions',
        false
      );
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

  return (
    <main className="min-h-screen flex bg-black">

      <Sidebar />

      <section className="flex-1 overflow-y-auto min-w-0">

        {/* HEADER */}

        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">

          <div className="pl-10 md:pl-0">

            <h1
              className="text-xl md:text-2xl font-bold text-white"
              style={{
                fontFamily:
                  'var(--font-display)',
              }}
            >
              Judge Dashboard
            </h1>

            <p className="text-xs md:text-sm text-white/30 mt-0.5">
              Review and evaluate assigned
              hackathon submissions
            </p>

          </div>

          {/* STATS */}

          <div className="hidden sm:flex items-center gap-4">

            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">
                Assigned
              </p>

              <p className="text-lg font-bold text-white leading-none mt-1">
                {submissions.length}
              </p>
            </div>

            <div className="h-8 w-[1px] bg-white/10" />

            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">
                Scored
              </p>

              <p className="text-lg font-bold text-emerald-400 leading-none mt-1">
                {
                  submissions.filter(
                    (s) => s.is_scored
                  ).length
                }
              </p>
            </div>

          </div>

        </div>

        {/* BODY */}

        <div className="p-5 md:p-10 space-y-6">

          {/* TOAST */}

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

          {/* SUBMISSION LIST */}

          <div className="grid gap-4">

            {loading ? (

              <div className="card-cyber p-20 flex items-center justify-center text-white/20">
                Loading assignments…
              </div>

            ) : submissions.length === 0 ? (

              <div className="card-cyber p-20 flex flex-col items-center justify-center text-white/20 text-center">

                <span className="text-4xl mb-4">
                  📭
                </span>

                <p>
                  No submissions assigned
                  to you yet.
                </p>

              </div>

            ) : (

              submissions.map((s) => (

                <div
                  key={s.id}
                  className={`card-cyber p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-white/20 group ${
                    s.is_scored
                      ? 'border-emerald-500/20'
                      : ''
                  }`}
                >

                  {/* LEFT */}

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

                      Team:

                      <span className="text-white/60 font-medium">
                        {s.team_name}
                      </span>

                    </p>

                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-3 flex-wrap">

                    {s.repo_url && (
                      <a
                        href={s.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        Repo
                      </a>
                    )}

                    {s.demo_url && (
                      <a
                        href={s.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        Demo
                      </a>
                    )}

                    {s.file_url && (
                      <a
                        href={s.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        File
                      </a>
                    )}

                    {/* REVIEW BUTTON */}

                    <Link
                      href={`/judge/${s.id}`}
                      className={`btn-pill text-xs !py-2.5 ${
                        s.is_scored
                          ? 'btn-outline border-emerald-500/30 text-emerald-400'
                          : 'btn-primary'
                      }`}
                    >
                      {s.is_scored
                        ? 'Review Score →'
                        : 'Start Judging →'}
                    </Link>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </section>

    </main>
  );
}