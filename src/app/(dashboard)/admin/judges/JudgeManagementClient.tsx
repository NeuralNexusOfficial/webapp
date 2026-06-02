'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ChevronUp, UserCheck, Inbox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredJudges = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return judges
    return judges.filter((judge) => {
      const name = (judge.full_name ?? '').toLowerCase()
      const email = (judge.email ?? '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [judges, query])

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by judge name or email..."
            className="input-nn pl-4 pr-12 w-full transition-all duration-200"
            autoComplete="off"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="absolute right-4 text-white/40 hover:text-white transition duration-200"
                type="button"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Judge List */}
      <div className="space-y-5 mt-8">
        <AnimatePresence mode="popLayout">
          {filteredJudges.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-cyber p-8 text-center"
            >
              <Inbox className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/70 text-lg font-bold">No judges found</p>
              <p className="text-white/30 text-sm mt-1">
                {query
                  ? `We couldn't find any judges matching "${query}"`
                  : 'No judges have been assigned yet.'}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="mt-4 px-4 py-2 rounded-lg border border-white/[0.08] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold uppercase tracking-wider transition-all duration-200 text-white/80 hover:text-white"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          ) : (
            filteredJudges.map((judge) => {
              const assignedToJudge = submissions.filter((s) =>
                s.judge_assignments?.some((a) => a.judge_id === judge.id),
              )
              const isExpanded = expandedId === judge.id

              return (
                <motion.div
                  key={judge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  layout="position"
                >
                  <div className="card-cyber hover:border-white/20 transition overflow-hidden">
                    {/* Main Row — always visible */}
                    <div
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                      onClick={() => toggleExpand(judge.id)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-base sm:text-lg font-bold text-white/70 shrink-0">
                          {judge.full_name ? judge.full_name[0].toUpperCase() : (judge.email ? judge.email[0].toUpperCase() : 'J')}
                        </div>

                        {/* Name & Email */}
                        <div className="min-w-0">
                          <h2
                            className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition truncate"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {judge.full_name || 'Unnamed Judge'}
                          </h2>
                          <p className="text-sm text-white/40 truncate">{judge.email}</p>
                        </div>
                      </div>

                      {/* Right side: stats + expand toggle */}
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-white/20" />
                          <span className={`text-sm font-medium ${assignedToJudge.length > 0 ? 'text-emerald-400' : 'text-white/30'}`}>
                            {assignedToJudge.length} Assigned
                          </span>
                        </div>

                        {/* Assigned submission badges */}
                        <div className="hidden lg:flex items-center gap-2">
                          {assignedToJudge.slice(0, 2).map((s) => (
                            <span key={s.id} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-white/40 max-w-[120px] truncate">
                              {s.title}
                            </span>
                          ))}
                          {assignedToJudge.length > 2 && (
                            <span className="text-xs text-white/30">+{assignedToJudge.length - 2} more</span>
                          )}
                        </div>

                        <div className="text-white/30 hover:text-white transition">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 border-t border-white/[0.06]">
                            {/* Assigned Submissions List */}
                            <div className="mt-5 mb-5">
                              <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Assigned Submissions</p>
                              {assignedToJudge.length > 0 ? (
                                <div className="space-y-2">
                                  {assignedToJudge.map((s) => (
                                    <Link
                                      key={s.id}
                                      href={`/admin/submissions/${s.id}`}
                                      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all group/link"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                      <span className="text-sm text-white/70 group-hover/link:text-white transition truncate flex-1">{s.title}</span>
                                      <span className="text-[10px] uppercase tracking-wider text-white/20 px-2 py-0.5 rounded bg-white/5">{s.track}</span>
                                      <span className="text-xs text-white/20 group-hover/link:text-blue-400 transition shrink-0">View →</span>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-white/25 italic">No submissions assigned to this judge.</p>
                              )}
                            </div>

                            {/* Assignment Controls */}
                            <AssignSubmissionClient
                              judgeId={judge.id}
                              allSubmissions={submissions}
                              assignedSubmissions={assignedToJudge}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
