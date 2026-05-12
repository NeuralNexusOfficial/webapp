"use client";

import Sidebar from "@/components/dashboard/sidebar";
import TeamActions from "@/components/dashboard/team-actions";
import PayButton from "@/components/dashboard/pay-button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex">
      <Sidebar />

      {/* Main content — offset on mobile to account for fixed sidebar toggle */}
      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between">
          {/* Left spacer for hamburger on mobile */}
          <div className="pl-10 md:pl-0">
            <h1
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dashboard
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">NeuralNexus Hackathon 2026</p>
          </div>
          <div className="tag-label hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Registrations Open
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-10 space-y-8 md:space-y-12">

          {/* Welcome card */}
          <div className="card-cyber p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Welcome back</p>
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to hack?
              </h2>
              <p className="text-white/40 mt-2 text-sm leading-relaxed max-w-md">
                Complete your registration, form a team, and start building. The clock is ticking.
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start md:items-end">
              <div className="text-xs text-white/30 uppercase tracking-widest">Event starts in</div>
              <div
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                24:00:00
              </div>
            </div>
          </div>

          {/* Team setup */}
          <TeamActions />

          {/* Registration fee */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="tag-label">Payment</div>
              <h2
                className="text-xl md:text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Registration Fee
              </h2>
            </div>
            <div className="card-cyber p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  ₹500
                </p>
                <p className="text-sm text-white/40">
                  One-time fee · Includes swag kit, meals, and access to all tracks
                </p>
              </div>
              <PayButton amount={500} />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}