'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/sidebar';
import { submissions } from '@/lib/mock-admin-data';

export default function AdminPage() {
  const [track, setTrack] = useState('');
  const [status, setStatus] = useState('');

  const filtered = submissions.filter((s) => {
    return (
      (track ? s.track === track : true) &&
      (status ? s.status === status : true)
    );
  });

  return (
    <main className="min-h-screen flex">

      <Sidebar />

      <section className="flex-1 overflow-y-auto p-6 md:p-10">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
            Admin Panel
          </p>

          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{
              fontFamily: 'var(--font-display)',
            }}
          >
            Submission Review
          </h1>

        </div>

        {/* FILTERS */}

        <div className="card-cyber p-6 mb-8 grid md:grid-cols-2 gap-4">

          <select
            value={track}
            onChange={(e) =>
              setTrack(e.target.value)
            }
            className="input-nn"
          >
            <option value="">
              All Tracks
            </option>

            <option value="AI/ML">
              AI/ML
            </option>

            <option value="Web3">
              Web3
            </option>

            <option value="HealthTech">
              HealthTech
            </option>

            <option value="FinTech">
              FinTech
            </option>

          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="input-nn"
          >
            <option value="">
              All Status
            </option>

            <option value="DRAFT">
              Draft
            </option>

            <option value="SUBMITTED">
              Submitted
            </option>

          </select>

        </div>

        {/* LIST */}

        <div className="space-y-5">

          {filtered.map((submission) => (
            <Link
              key={submission.id}
              href={`/admin/${submission.id}`}
              className="block"
            >

              <div className="card-cyber p-6 hover:border-white/20 transition">

                <div className="flex items-start justify-between gap-6">

                  <div>

                    <p className="text-white/30 text-sm mb-2">
                      {submission.team}
                    </p>

                    <h2
                      className="text-2xl font-bold text-white"
                      style={{
                        fontFamily:
                          'var(--font-display)',
                      }}
                    >
                      {submission.title}
                    </h2>

                    <div className="flex items-center gap-3 mt-3">

                      <div className="tag-label">
                        {submission.track}
                      </div>

                      <div className="tag-label">
                        {submission.status}
                      </div>

                    </div>

                  </div>

                  <div className="text-white/30 text-sm">
                    View →
                  </div>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </section>
    </main>
  );
}