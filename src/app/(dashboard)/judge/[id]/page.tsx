'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import { assignedSubmissions } from '@/lib/mock-judge-data';

export default function JudgeSubmissionPage() {
  const params = useParams();

  const submission =
    assignedSubmissions.find(
      (s) => s.id === params.id
    );

  const [scores, setScores] = useState({
    innovation: '0',
    technical: '0',
    uiux: '0',
    scalability: '0',
    comments: '',
  });

  if (!submission) {
    return (
      <div className="p-10 text-white">
        Submission not found.
      </div>
    );
  }

  function handleChange(
    key: string,
    value: string
  ) {
    setScores((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSave() {
    console.log(scores);

    alert('Scores saved!');
  }

  return (
    <main className="min-h-screen flex w-full max-w-[100vw] overflow-x-hidden bg-black">

      <Sidebar />

      <section className="flex-1 min-w-0 max-w-full overflow-x-hidden overflow-y-auto px-4 pt-16 pb-6 sm:px-6 md:px-10 md:pt-10 md:pb-10">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-white/30 text-sm mb-2">
            {submission.team}
          </p>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words"
            style={{
              fontFamily:
                'var(--font-display)',
            }}
          >
            {submission.title}
          </h1>

        </div>

        {/* DETAILS */}

        <div className="card-cyber p-6 mb-8">

          <h2 className="text-white text-xl font-bold mb-4">
            Submission Details
          </h2>

          <div className="space-y-3 text-white/60">

            <p>
              Track:
              {' '}
              {submission.track}
            </p>

            <p>
              Status:
              {' '}
              {submission.status}
            </p>

          </div>

        </div>

        {/* SCORING */}

        <div className="card-cyber p-6">

          <h2 className="text-white text-xl font-bold mb-6">
            Judge Scoring
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/40 uppercase tracking-wider">Innovation</span>
                <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                  {scores.innovation}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                value={scores.innovation}
                onChange={(e) =>
                  handleChange(
                    'innovation',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/40 uppercase tracking-wider">Technical</span>
                <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                  {scores.technical}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                value={scores.technical}
                onChange={(e) =>
                  handleChange(
                    'technical',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/40 uppercase tracking-wider">UI / UX</span>
                <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                  {scores.uiux}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                value={scores.uiux}
                onChange={(e) =>
                  handleChange(
                    'uiux',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/40 uppercase tracking-wider">Scalability</span>
                <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                  {scores.scalability}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
                value={scores.scalability}
                onChange={(e) =>
                  handleChange(
                    'scalability',
                    e.target.value
                  )
                }
              />
            </div>

          </div>

          <textarea
            placeholder="Judge comments..."
            className="input-nn min-h-[120px] sm:min-h-[140px] w-full mt-5"
            value={scores.comments}
            onChange={(e) =>
              handleChange(
                'comments',
                e.target.value
              )
            }
          />

          <button
            onClick={handleSave}
            className="btn-pill btn-primary mt-6"
          >
            Save Scores →
          </button>

        </div>

      </section>
    </main>
  );
}