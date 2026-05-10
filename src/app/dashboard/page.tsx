import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-zinc-400">Welcome back!</span>
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700" />
              </>
            ) : (
              <Link 
                href="/login" 
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Sign in to participate
              </Link>
            )}
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-semibold mb-2">Team</h2>
            {user ? (
              <p className="text-zinc-400">You are not currently in a team.</p>
            ) : (
              <p className="text-zinc-500">Sign in to join or create a team.</p>
            )}
          </div>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-semibold mb-2">Submission</h2>
            {user ? (
              <p className="text-zinc-400">Submissions are not open yet.</p>
            ) : (
              <p className="text-zinc-500">Sign in to submit your project.</p>
            )}
          </div>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <p className="text-zinc-400">No upcoming events.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
