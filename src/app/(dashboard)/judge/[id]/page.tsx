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
    innovation: '',
    technical: '',
    uiux: '',
    scalability: '',
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
    <main className="min-h-screen flex">

      <Sidebar />

      <section className="flex-1 overflow-y-auto p-6 md:p-10">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-white/30 text-sm mb-2">
            {submission.team}
          </p>

          <h1
            className="text-4xl font-bold text-white"
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

            <input
              type="number"
              placeholder="Innovation Score"
              className="input-nn"
              value={scores.innovation}
              onChange={(e) =>
                handleChange(
                  'innovation',
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="Technical Score"
              className="input-nn"
              value={scores.technical}
              onChange={(e) =>
                handleChange(
                  'technical',
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="UI/UX Score"
              className="input-nn"
              value={scores.uiux}
              onChange={(e) =>
                handleChange(
                  'uiux',
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="Scalability Score"
              className="input-nn"
              value={scores.scalability}
              onChange={(e) =>
                handleChange(
                  'scalability',
                  e.target.value
                )
              }
            />

          </div>

          <textarea
            placeholder="Judge comments..."
            className="input-nn min-h-[140px] mt-5"
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