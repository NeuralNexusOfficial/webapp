"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/sidebar";
import TeamActions from "@/components/dashboard/team-actions";

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

        <TeamActions />

      </section>
    </main>
  );
}