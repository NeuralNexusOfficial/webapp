"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { BackgroundPaths } from "@/components/ui/background-paths";
import Link from "next/link";
import { Users, FileText, BookOpen, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [timeLeft, setTimeLeft] = useState("00:00:00:00");

  useEffect(() => {
    const deadlineStr = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE || "2027-03-01T18:00:00+05:30";
    const deadline = new Date(deadlineStr).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline - now;
      
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00:00");
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <BackgroundPaths />
      </div>
      <Sidebar />

      {/* Main content — offset on mobile to account for fixed sidebar toggle */}
      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 sm:px-6 md:px-10 py-5 flex items-center justify-between">
          {/* Left spacer for hamburger on mobile */}
          <div className="pl-10 md:pl-0">
            <h1
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dashboard
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">AOT Hackathon 2026</p>
          </div>
          <div className="tag-label hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Registrations Open
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 space-y-8 md:space-y-12">

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
              <div className="flex gap-4 md:gap-6 text-center tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                {timeLeft.split(':').map((val, idx) => {
                  const labels = ['Days', 'Hours', 'Mins', 'Secs'];
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-3xl md:text-4xl font-bold text-white leading-none">{val}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-sans font-medium">{labels[idx]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/team" className="card-cyber p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                <Users size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Team Setup</p>
                <p className="text-xs text-white/40 mt-1">Create or join a team</p>
              </div>
            </Link>

            <Link href="/dashboard/resources" className="card-cyber p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-amber-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Resources</p>
                <p className="text-xs text-white/40 mt-1">Tools and templates</p>
              </div>
            </Link>

            <Link href="/dashboard/submit" className="card-cyber p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Submit Project</p>
                <p className="text-xs text-white/40 mt-1">Finalize your work</p>
              </div>
            </Link>
          </div>

          <div className="flex justify-end pt-4">
            <Link 
              href="/dashboard/team" 
              className="btn-pill btn-primary flex items-center gap-2"
            >
              Next Step: Team Setup <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}