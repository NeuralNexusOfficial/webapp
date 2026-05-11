import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Authentication</h1>
        <p className="text-zinc-400">Sign in or create an account to get started with NeuralNexus.</p>
        
        <div className="mt-10 grid gap-4">
          <Link href="/login" className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="w-full rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-900 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
