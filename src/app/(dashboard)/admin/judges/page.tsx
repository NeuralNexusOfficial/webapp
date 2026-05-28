import Sidebar from '@/components/dashboard/sidebar';
import { getAllJudges, getFilteredSubmissions } from '@/app/actions/judging';
import Link from 'next/link';
import JudgeManagementClient from './JudgeManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminJudgesPage() {
  const judgesRes = await getAllJudges();
  const judges = judgesRes.success ? judgesRes.data : [];

  const submissionsRes = await getFilteredSubmissions();
  const submissions = submissionsRes.success ? submissionsRes.data : [];

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
            Judge Management
          </h1>
          
          <div className="flex gap-6 border-b border-white/10 pb-4">
            <Link href="/admin" className="text-white/50 hover:text-white transition font-medium">Submissions</Link>
            <span className="text-white font-bold border-b-2 border-white pb-4 -mb-[18px]">Judges</span>
            <Link href="/admin/users" className="text-white/50 hover:text-white transition font-medium">Users</Link>
          </div>
        </div>

        <JudgeManagementClient judges={judges} submissions={submissions} />
      </section>
    </main>
  );
}
