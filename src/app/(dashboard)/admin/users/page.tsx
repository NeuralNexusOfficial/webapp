import Sidebar from '@/components/dashboard/sidebar'
import { getAllUsers } from '@/app/actions/admin'
import UserTable from './UserTable'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const res = await getAllUsers()
  const users = res.success ? res.data : []
  const error = !res.success ? res.error : null

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
            User Management
          </h1>
          <div className="flex gap-6 border-b border-white/10 pb-4">
            <Link href="/admin" className="text-white/50 hover:text-white transition font-medium">Submissions</Link>
            <Link href="/admin/judges" className="text-white/50 hover:text-white transition font-medium">Judges</Link>
            <span className="text-white font-bold border-b-2 border-white pb-4 -mb-[18px]">Users</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              All Registered Users
            </h2>
            <p className="text-sm text-white/40 mt-1">
              View and manage roles for {users.length} total users.
            </p>
          </div>
        </div>

        <UserTable users={users} />
      </section>
    </main>
  )
}
