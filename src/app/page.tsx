import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6 selection:bg-white selection:text-zinc-950">
      <main className="text-center space-y-8 max-w-3xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">
            Neural<span className="text-zinc-500">Nexus</span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            The next generation hackathon management platform. 
            Streamlined, secure, and built for scale.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link 
            href="/auth" 
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-zinc-950 font-bold hover:scale-105 transition-all text-center"
          >
            Get Started
          </Link>
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-zinc-800 text-white font-medium hover:bg-zinc-900 transition-all text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-zinc-600 text-sm">
        © 2026 NEURALNEXUS. All rights reserved.
      </footer>
    </div>
  )
}

