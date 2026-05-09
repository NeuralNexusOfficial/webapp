"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 className="text-2xl font-bold">
          HackGlobal
        </h1>

        <div className="flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>

          <Link
            href="/login"
            className="bg-white text-black px-4 py-2 rounded-full font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}