import Sidebar from '@/components/dashboard/sidebar';
import { getFilteredSubmissions, getAllJudges } from '@/app/actions/judging';
import Link from 'next/link';
import AdminFilters from './AdminFilters';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { track?: string; status?: string };
}) {
  const res = await getFilteredSubmissions(
    searchParams.track,
    searchParams.status
  );
  
  const submissions = res.success ? res.data : [];
  const error = !res.success ? res.error : null;

  const judgesRes = await getAllJudges();
  const judges = judgesRes.success ? judgesRes.data : [];

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
            Admin Panel
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Submission Review
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        <AdminFilters initialTrack={searchParams.track} initialStatus={searchParams.status} />

        <div className="space-y-5 mt-8">
          {submissions?.length === 0 ? (
            <p className="text-white/50 text-center py-10">No submissions found.</p>
          ) : (
            submissions?.map((submission: any) => (
              <Link
                key={submission.id}
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
                        {submission.judge_assignments?.length > 0 && (
                          <div className="text-xs text-blue-400">
                            {submission.judge_assignments.length} Judge(s) Assigned
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-white/30 text-sm group-hover:text-blue-400 transition">
                      View Details →
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}