import Sidebar from '@/components/dashboard/sidebar';
import Link from 'next/link';
import { getFilteredSubmissions } from '@/app/actions/judging';
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

  return (
    <main className="min-h-screen flex w-full max-w-[100vw] overflow-x-hidden bg-black">
      <Sidebar />
      <section className="flex-1 min-w-0 max-w-full overflow-x-hidden overflow-y-auto px-4 pt-16 pb-6 sm:px-6 md:px-10 md:pt-10 md:pb-10">
        <div className="mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
            Admin Panel
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 break-words"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Submission Review
          </h1>
          <nav
            className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Admin sections"
          >
            <div className="flex flex-nowrap gap-4 sm:gap-6 border-b border-white/10 pb-4 w-max max-w-full sm:w-auto sm:flex-wrap">
              <span className="text-white font-bold border-b-2 border-white pb-4 -mb-[18px] shrink-0 text-sm sm:text-base">
                Submissions
              </span>
              <Link href="/dashboard/admin/judges" className="text-white/50 hover:text-white transition font-medium shrink-0 text-sm sm:text-base">
                Judges
              </Link>
              <Link href="/dashboard/admin/users" className="text-white/50 hover:text-white transition font-medium shrink-0 text-sm sm:text-base">
                Users
              </Link>
              <Link href="/dashboard/admin/leaderboard" className="text-white/50 hover:text-white transition font-medium shrink-0 text-sm sm:text-base">
                Leaderboard
              </Link>
            </div>
          </nav>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        <AdminFilters
          initialTrack={resolvedParams.track}
          initialStatus={resolvedParams.status}
        />

        <div className="mt-8">
          <AdminSubmissionsList submissions={submissions} />
        </div>
      </section>
    </main>
  );
}
