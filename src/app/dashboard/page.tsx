export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Welcome back!</span>
            <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700" />
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-semibold mb-2">Team</h2>
            <p className="text-zinc-400">You are not currently in a team.</p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-semibold mb-2">Submission</h2>
            <p className="text-zinc-400">Submissions are not open yet.</p>
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
