"use client";

import Link from "next/link";

const items = [
  "Home",
  "My Team",
  "Submissions",
  "Resources",
  "Leaderboard",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#121228] border-r border-zinc-800 p-6 flex flex-col justify-between">

      <div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white">
            HackGlobal
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            hackathon platform
          </p>
        </div>

        <nav className="space-y-3">
          {items.map((item) => (
            <Link
              key={item}
              href="#"
              className="block px-4 py-3 rounded-xl text-zinc-300 hover:bg-blue-600 hover:text-white transition"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      <button className="text-red-500 text-left">
        Logout
      </button>
    </aside>
  );
}