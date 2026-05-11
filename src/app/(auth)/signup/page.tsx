"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful!");

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded-xl bg-zinc-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            onClick={handleSignup}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold"
          >
            Sign Up
          </button>

        </div>
      </div>
    </div>
  );
}