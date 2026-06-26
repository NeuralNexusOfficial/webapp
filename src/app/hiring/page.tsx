import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | AOT Hackathon",
  description: "Join AOT Hackathon. Explore open roles like our Full Stack Intern position and help shape the future of hackathons.",
};

export default function HiringPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Join the Team
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
            Help us build and scale the ultimate platform for developers, designers, and innovators. We are architects of tomorrow.
          </p>
        </div>

        <div className="space-y-8 text-white/70 leading-relaxed">
          {/* Job Card */}
          <div className="card-cyber p-6 sm:p-8 border border-white/10 rounded-2xl relative overflow-hidden bg-white/[0.01]">
            {/* Top Tag */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Remote
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/60 border border-white/10 rounded-full">
                Internship
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 pr-28" style={{ fontFamily: "var(--font-display)" }}>
              Full Stack Intern
            </h2>
            <p className="text-xs text-white/30 mb-6">Engineering • 3-6 Months Duration</p>

            <hr className="border-white/10 mb-6" />

            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">About the Role</h3>
                <p className="text-sm">
                  We are looking for a motivated Full Stack Developer Intern who is passionate about coding, user interfaces, and building products. You will work closely with the core team to add new features, design dashboards, and optimize performance for the AOT Hackathon platform.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Responsibilities</h3>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>Collaborate to design, build, and deploy new features and interactive dashboards.</li>
                  <li>Develop responsive, interactive UI components using React, Next.js, and TypeScript.</li>
                  <li>Integrate backend logic and database capabilities using Supabase (Postgres, RLS policies, Auth).</li>
                  <li>Identify performance bottlenecks and improve overall application loading speed.</li>
                  <li>Participate in code reviews, debug existing codebase issues, and ensure code quality.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>Strong foundations in React, Next.js, TypeScript, and modern CSS practices.</li>
                  <li>Familiarity with PostgreSQL database querying and Supabase or Firebase services.</li>
                  <li>Comfortable working with Git version control and GitHub workflows.</li>
                  <li>A proactive attitude with the ability to research and learn new concepts quickly.</li>
                  <li>Prior projects (academic, hackathon, or open-source) demonstrating functional code.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">How to Apply</h3>
                <p className="text-sm">
                  Send your resume, links to your GitHub profile, portfolio, or past projects to:
                </p>
                <p className="mt-3 text-emerald-400 font-mono text-sm font-semibold">
                  <a href="mailto:aothackathonfraylon@gmail.com" className="hover:underline">
                    aothackathonfraylon@gmail.com
                  </a>
                </p>
                <p className="text-xs text-white/40 mt-2">
                  Please use the subject line: <code className="bg-white/10 px-1 py-0.5 rounded text-white text-[11px] font-mono">Full Stack Intern Application - [Your Name]</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
