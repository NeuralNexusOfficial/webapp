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
          <Link href="/judge" className="text-white/50 hover:text-white transition">
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