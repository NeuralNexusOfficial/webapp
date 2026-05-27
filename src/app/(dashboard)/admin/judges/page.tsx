import Sidebar from '@/components/dashboard/sidebar';
import { getAllJudges, getFilteredSubmissions } from '@/app/actions/judging';
import Link from 'next/link';
import AssignSubmissionClient from './AssignSubmissionClient';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {judges.length === 0 ? (
            <p className="text-white/50">No judges found.</p>
          ) : (
            judges.map((judge) => (
              <div key={judge.id} className="card-cyber p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-white/70 mb-4">
                    {judge.full_name ? judge.full_name[0].toUpperCase() : (judge.email ? judge.email[0].toUpperCase() : 'J')}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{judge.full_name || 'Unnamed Judge'}</h2>
                  <p className="text-sm text-white/50 mb-6">{judge.email}</p>
                  
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Assigned Submissions</p>
                    <ul className="space-y-2 text-sm">
                      {submissions.filter(s => s.judge_assignments?.some(a => a.judge_id === judge.id)).length > 0 ? (
                        submissions
                          .filter(s => s.judge_assignments?.some(a => a.judge_id === judge.id))
                          .map(s => (
                            <li key={s.id} className="flex items-center gap-2">
                              <span className="text-emerald-400">•</span>
                              <Link href={`/admin/submissions/${s.id}`} className="text-white hover:underline truncate block">
                                {s.title}
                              </Link>
                            </li>
                          ))
                      ) : (
                        <p className="text-white/30 italic">No submissions assigned.</p>
                      )}
                    </ul>
                  </div>
                </div>

                <AssignSubmissionClient 
                  judgeId={judge.id} 
                  allSubmissions={submissions} 
                  assignedSubmissions={submissions.filter(s => s.judge_assignments?.some(a => a.judge_id === judge.id))}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
