import Sidebar from '@/components/dashboard/sidebar';
import { getFilteredSubmissions, getAllJudges } from '@/app/actions/judging';
import Link from 'next/link';
import AdminFilters from './AdminFilters';
import AdminSubmissionsList from './AdminSubmissionsList';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const res = await getFilteredSubmissions(
    resolvedParams.track,
    resolvedParams.status
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
          <div className="flex gap-6 border-b border-white/10 pb-4">
            <span className="text-white font-bold border-b-2 border-white pb-4 -mb-[18px]">Submissions</span>
            <Link href="/admin/judges" className="text-white/50 hover:text-white transition font-medium">Judges</Link>
            <Link href="/admin/users" className="text-white/50 hover:text-white transition font-medium">Users</Link>
            <Link href="/admin/leaderboard" className="text-white/50 hover:text-white transition font-medium">Leaderboard</Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        <AdminFilters initialTrack={resolvedParams.track} initialStatus={resolvedParams.status} />

        <div className="mt-8">
          <AdminSubmissionsList submissions={submissions} />
        </div>
      </section>
    </main>
  );
}
