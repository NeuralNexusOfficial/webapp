import Sidebar from '@/components/dashboard/sidebar';
import Link from 'next/link';
import { getLeaderboard } from '@/app/actions/leaderboard';
import LeaderboardClient from './LeaderboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const resolvedParams = await searchParams;
  const res = await getLeaderboard(resolvedParams.track);
  const entries = res.success ? res.data : [];
  const error = !res.success ? res.error : null;

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
            Admin Panel
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Leaderboard
          </h1>
          <div className="flex gap-6 border-b border-white/10 pb-4">
            <Link href="/admin" className="text-white/50 hover:text-white transition font-medium">Submissions</Link>
            <Link href="/admin/judges" className="text-white/50 hover:text-white transition font-medium">Judges</Link>
            <Link href="/admin/users" className="text-white/50 hover:text-white transition font-medium">Users</Link>
            <span className="text-white font-bold border-b-2 border-white pb-4 -mb-[18px]">Leaderboard</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <LeaderboardClient entries={entries} initialTrack={resolvedParams.track} />
      </section>
    </main>
  );
}
