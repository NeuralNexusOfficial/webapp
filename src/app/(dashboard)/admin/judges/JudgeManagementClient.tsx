'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import AssignSubmissionClient from './AssignSubmissionClient'
import type { Profile, Submission } from '@/types'

type SubmissionWithAssignments = Submission & {
  team_name: string
  judge_assignments: Array<{ judge_id: string }>
}

export default function JudgeManagementClient({
  judges,
  submissions,
}: {
  judges: Profile[]
  submissions: SubmissionWithAssignments[]
}) {
  const [query, setQuery] = useState('')

  const filteredJudges = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return judges
    return judges.filter((judge) => {
      const name = (judge.full_name ?? '').toLowerCase()
      const email = (judge.email ?? '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [judges, query])

  return (
    <>
      <div className="mb-6 max-w-md">
        <label htmlFor="judge-search" className="text-xs uppercase tracking-widest text-white/30 mb-2 block">
          Search Judges
        </label>
        <input
          id="judge-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by judge name or email"
          className="input-nn"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJudges.length === 0 ? (
          <p className="text-white/50">No judges found.</p>
        ) : (
          filteredJudges.map((judge) => {
            const assignedToJudge = submissions.filter((s) =>
              s.judge_assignments?.some((a) => a.judge_id === judge.id),
            )
            return (
              <div key={judge.id} className="card-cyber p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-white/70 mb-4">
                    {judge.full_name ? judge.full_name[0].toUpperCase() : (judge.email ? judge.email[0].toUpperCase() : 'J')}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{judge.full_name || 'Unnamed Judge'}</h2>
                  <p className="text-sm text-white/50 mb-6">{judge.email}</p>

                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Assigned Submissions</p>
                    <ul className="space-y-2 text-sm">
                      {assignedToJudge.length > 0 ? (
                        assignedToJudge.map((s) => (
                          <li key={s.id} className="flex items-center gap-2">
                            <span className="text-emerald-400">•</span>
                            <Link href={`/admin/submissions/${s.id}`} className="text-white hover:underline truncate block">
                              {s.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <p className="text-white/30 italic">No submissions assigned.</p>
                      )}
                    </ul>
                  </div>
                </div>

                <AssignSubmissionClient
                  judgeId={judge.id}
                  allSubmissions={submissions}
                  assignedSubmissions={assignedToJudge}
                />
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
