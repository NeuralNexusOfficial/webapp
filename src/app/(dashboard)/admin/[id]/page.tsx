'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import { submissions } from '@/lib/mock-admin-data';
import { useState } from 'react';

export default function AdminSubmissionPage() {
  const params = useParams();
  const [score, setScore] = useState(0);

  const submission =
    submissions.find(
      (s) => s.id === params.id
    );

  if (!submission) {
    return (
      <div className="p-10 text-white">
        Submission not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen flex">

      <Sidebar />

      <section className="flex-1 overflow-y-auto p-6 md:p-10">

        <div className="mb-10">

          <p className="text-white/30 text-sm mb-2">
            {submission.team}
          </p>

          <h1
            className="text-4xl font-bold text-white"
            style={{
              fontFamily: 'var(--font-display)',
            }}
          >
            {submission.title}
          </h1>

        </div>

        <div className="space-y-6">

          <div className="card-cyber p-6">
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

          <div className="card-cyber p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">
                Judge Score
              </h2>
              <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
                {score}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-4 focus:outline-none"
            />

            <textarea
              placeholder="Judge notes..."
              className="input-nn min-h-[120px]"
            />

            <button className="btn-pill btn-primary mt-5">
              Save Score →
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}