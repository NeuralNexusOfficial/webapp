import AdminPageShell from '@/components/admin/admin-page-shell';
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
    <AdminPageShell title="Leaderboard" activeTab="leaderboard">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <LeaderboardClient entries={entries} initialTrack={resolvedParams.track} />
    </AdminPageShell>
  );
}
