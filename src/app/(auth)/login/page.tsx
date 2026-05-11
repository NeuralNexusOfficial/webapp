// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()
//   const supabase = createClient()

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (error) {
//       setError(error.message)
//       setLoading(false)
//     } else {
//       router.refresh()
//       router.push('/dashboard')
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
//       <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
//           <p className="mt-2 text-zinc-400">Sign in to your account to continue</p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//           {error && (
//             <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
//               {error}
//             </div>
//           )}
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-zinc-300">Email address</label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 placeholder="you@example.com"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-zinc-300">Password</label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
//           >
//             {loading ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-zinc-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-zinc-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}
