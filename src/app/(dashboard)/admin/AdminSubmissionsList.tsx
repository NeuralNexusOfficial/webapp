'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission } from '@/types';

// Submission type extending the base type to include fields fetched by the server action
interface AdminSubmission extends Submission {
  team_name: string;
  judge_assignments?: any[];
}

export default function AdminSubmissionsList({
  submissions,
}: {
  submissions: AdminSubmission[];
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic: case-insensitive, partial matching for project name (title) or team name (team_name)
  const filteredSubmissions = submissions.filter((submission) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    
    const projectNameMatch = submission.title?.toLowerCase().includes(query) ?? false;
    const teamNameMatch = submission.team_name?.toLowerCase().includes(query) ?? false;
    
    return projectNameMatch || teamNameMatch;
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Search Bar Component */}
      <div className="relative group">
        {/* Decorative background glow that triggers on focus inside the container */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project or team name..."
            className="input-nn pl-4 pr-12 w-full transition-all duration-200"
          />

          {/* Reset button shown only when text exists */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
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

      {/* Submissions List Container */}
      <div className="space-y-5 mt-8">
        <AnimatePresence mode="popLayout">
          {filteredSubmissions.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-cyber p-8 text-center"
            >
              <p className="text-white/70 text-lg font-bold">No submissions found</p>
              <p className="text-white/30 text-sm mt-1">
                {searchQuery 
                  ? `We couldn't find any results matching "${searchQuery}"`
                  : 'There are no submissions under this category.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-lg border border-white/[0.08] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold uppercase tracking-wider transition-all duration-200 text-white/80 hover:text-white"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          ) : (
            filteredSubmissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                layout="position"
              >
                <Link
                  href={`/admin/submissions/${submission.id}`}
                  className="block group"
                >
                  <div className="card-cyber p-6 hover:border-white/20 transition">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-white/30 text-sm mb-2">
                          {submission.team_name}
                        </p>
                        <h2
                          className="text-2xl font-bold text-white group-hover:text-blue-400 transition"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {submission.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="tag-label">{submission.track}</div>
                          <div className="tag-label">{submission.status}</div>
                          {submission.judge_assignments && submission.judge_assignments.length > 0 && (
                            <div className="text-xs text-blue-400">
                              {submission.judge_assignments.length} Judge(s) Assigned
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-white/30 text-sm group-hover:text-blue-400 transition shrink-0">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
