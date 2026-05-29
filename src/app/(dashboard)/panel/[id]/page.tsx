import Sidebar from '@/components/dashboard/sidebar';
import { getSubmissionById, getSubmissionScores } from '@/app/actions/judging';
import { notFound } from 'next/navigation';
import JudgeScoreForm from '@/components/dashboard/judge-score-form';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function JudgeSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const submissionRes = await getSubmissionById(resolvedParams.id);
  
  if (!submissionRes.success || !submissionRes.data) {
    return notFound();
  }

  const submission = submissionRes.data;

  // Fetch current user to get their score specifically
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const scoresRes = await getSubmissionScores(resolvedParams.id);
  const existingScore = scoresRes.success && user 
    ? scoresRes.data?.find((s: any) => s.judge_id === user.id) 
    : null;

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mb-8">
          <Link href="/panel" className="text-white/50 hover:text-white transition">
            ← Back to Submissions
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-white/30 text-sm mb-2">
            Team: {submission.team_name}
          </p>
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {submission.title}
          </h1>
          <div className="flex gap-3">
            <div className="tag-label">{submission.track}</div>
            <div className="tag-label">{submission.status}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* DETAILS */}
          <div className="md:col-span-2 space-y-6">
            <div className="card-cyber p-6">
              <h3 className="text-xl font-bold text-white mb-4">Description</h3>
              <p className="text-white/70 whitespace-pre-wrap">{submission.description}</p>
            </div>

            <div className="card-cyber p-6">
              <h3 className="text-xl font-bold text-white mb-4">Links</h3>
              <div className="space-y-3">
                {submission.repo_url ? (
                  <a href={submission.repo_url} target="_blank" rel="noreferrer" className="block text-blue-400 hover:underline">
                    GitHub / GitLab Repository ↗
                  </a>
                ) : (
                  <p className="text-white/50">No repository provided.</p>
                )}
                {submission.demo_url ? (
                  <a href={submission.demo_url} target="_blank" rel="noreferrer" className="block text-blue-400 hover:underline">
                    Live Demo / Video ↗
                  </a>
                ) : (
                  <p className="text-white/50">No demo provided.</p>
                )}
                {submission.file_url ? (
                  <a href={submission.file_url} target="_blank" rel="noreferrer" className="block text-blue-400 hover:underline">
                    Download Presentation/Doc ↗
                  </a>
                ) : (
                  <p className="text-white/50">No file uploaded.</p>
                )}
              </div>
            </div>

            <div className="card-cyber p-6">
              <h3 className="text-xl font-bold text-white mb-4">Team Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/40">Team:</span>
                  <span className="text-sm font-semibold text-white">{submission.team_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/40">Track:</span>
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs uppercase tracking-wider text-white/60">
                    {submission.track}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-white/40 block mb-2">Members:</span>
                  {submission.team_members.length === 0 ? (
                    <p className="text-white/30 text-sm italic">No member data available.</p>
                  ) : (
                    <ul className="space-y-2">
                      {submission.team_members.map((member, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                        >
                          <div>
                            <p className="text-sm font-medium text-white/90">
                              {member.full_name || 'Unknown'}
                            </p>
                            {member.email && (
                              <p className="text-xs text-white/30">{member.email}</p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${
                              member.role === 'LEADER'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                          >
                            {member.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SCORING */}
          <div>
            <JudgeScoreForm submissionId={submission.id} existingScore={existingScore} />
          </div>
        </div>
      </section>
    </main>
  );
}