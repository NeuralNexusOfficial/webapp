import Sidebar from '@/components/dashboard/sidebar';
import { getSubmissionById, getAllJudges, getSubmissionScores } from '@/app/actions/judging';
import AssignJudgeClient from './AssignJudgeClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminSubmissionDetails({
  params,
}: {
  params: { id: string };
}) {
  const [submissionRes, judgesRes, scoresRes] = await Promise.all([
    getSubmissionById(params.id),
    getAllJudges(),
    getSubmissionScores(params.id),
  ]);

  const submission = submissionRes.success ? submissionRes.data : null;
  const judges = judgesRes.success ? judgesRes.data : [];
  const scores = scoresRes.success ? scoresRes.data : [];

  if (!submission) return notFound();

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mb-8">
          <Link href="/admin" className="text-white/50 hover:text-white transition">
            ← Back to Submissions
          </Link>
        </div>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
            Team: {submission.team_name}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            {submission.title}
          </h1>
          <div className="flex gap-3">
            <div className="tag-label">{submission.track}</div>
            <div className="tag-label">{submission.status}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-bold text-white mb-4">Scores Given</h3>
              {scores && scores.length > 0 ? (
                <div className="space-y-4">
                  {scores.map((score: any) => (
                    <div key={score.id} className="border border-white/10 p-4 rounded-lg">
                      <p className="font-bold text-white mb-2">Judge: {score.profiles?.full_name || score.profiles?.email}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm text-white/70">
                        <div>Innovation: <span className="text-white">{score.innovation_score}</span></div>
                        <div>Technical: <span className="text-white">{score.technical_score}</span></div>
                        <div>UI/UX: <span className="text-white">{score.ui_ux_score}</span></div>
                        <div>Scalability: <span className="text-white">{score.scalability_score}</span></div>
                      </div>
                      <div className="font-bold text-blue-400 mb-2">Total: {score.total_score} / 40</div>
                      {score.comments && (
                        <p className="text-white/50 italic text-sm">"{score.comments}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50">No scores have been submitted yet.</p>
              )}
            </div>
          </div>

          <div>
            <div className="card-cyber p-6">
              <h3 className="text-xl font-bold text-white mb-4">Status & Info</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-white/50">Submitted at:</span> <span className="text-white">{new Date(submission.submitted_at || submission.created_at).toLocaleString()}</span></p>
                <p className="flex justify-between"><span className="text-white/50">Deadline:</span> <span className="text-white">{new Date(submission.deadline).toLocaleString()}</span></p>
              </div>
            </div>

            <AssignJudgeClient submissionId={submission.id} judges={judges || []} />
          </div>
        </div>
      </section>
    </main>
  );
}
