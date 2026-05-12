"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/sidebar";
import TeamActions from "@/components/dashboard/team-actions";
import PayButton from "@/components/dashboard/pay-button";

export default function DashboardPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName("Hello");
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b18] flex">

      <Sidebar />

      <section className="flex-1 p-10">

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-white">
            Hey, {name}!
          </h1>

          <p className="text-zinc-400 mt-3">
            Welcome to your hackathon dashboard.
          </p>

        </div>

        <div className="space-y-10">
          <TeamActions />

          {/* ── Registration Fee ─────────────────────────────────── */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Registration Fee</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Pay the ₹500 hackathon registration fee to lock in your spot.
            </p>
            <PayButton amount={500} />
          </div>
        </div>

      </section>
    </main>
  );
}