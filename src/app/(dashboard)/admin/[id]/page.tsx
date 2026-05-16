'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import { submissions } from '@/lib/mock-admin-data';

export default function AdminSubmissionPage() {
  const params = useParams();

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

            <h2 className="text-white text-xl font-bold mb-4">
              Judge Score
            </h2>

            <input
              type="number"
              placeholder="Enter score"
              className="input-nn mb-4"
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