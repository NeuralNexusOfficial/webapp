import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Official Rules
        </h1>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Eligibility</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>AOT Hackathon: Architects of Tomorrow is open to all developers, designers, writers, animators, and innovators worldwide.</li>
              <li>Participants must be at least 18 years old or have parental consent.</li>
              <li>Teams can consist of 1 to 4 members. Individual participation is allowed in all domains.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Domains</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Submissions must target one of the five domains: AI, SaaS, Gaming, Storytelling, or Animation.</li>
              <li>Cross-domain projects are allowed but must declare a primary domain for judging.</li>
              <li>Each domain has its own registration fee and prize structure. See the Tracks page for details.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Code &amp; Submissions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All project code must be written during the hackathon period (Aug 21 – Oct 21, 2026).</li>
              <li>Use of open-source libraries, APIs, and frameworks is encouraged, but the core logic must be original.</li>
              <li>A working prototype, GitHub repository link, and a short demo video are required for a valid submission (except Storytelling domain which requires original stories/screenplays).</li>
              <li>AI tools (e.g., ChatGPT) may be used for assistance, but all core logic must be authored by your team.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Registration &amp; Fees</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Registration fees vary by domain: AI ($25/$35), SaaS ($15/$25), Gaming ($18/$30), Storytelling ($8), Animation ($12/$18).</li>
              <li>Individual and team pricing differs. If one team member pays, it covers the entire team.</li>
              <li>All team members must have completed registration to be eligible for prizes.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Timeline</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>University Promotions: June 20 – August 20, 2026.</li>
              <li>Hackathon Period: August 21 – October 21, 2026 (approx. 2 months).</li>
              <li>Includes registrations, team formations, submission rounds, evaluations, final presentations, and winner announcements.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Code of Conduct</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be respectful. Harassment of any kind will not be tolerated and will result in immediate disqualification.</li>
              <li>No plagiarism — all work must be original.</li>
              <li>Projects must not infringe on third-party intellectual property.</li>
              <li>Collaborate and share knowledge. Hackathons are about community.</li>
              <li>The judges&apos; decisions are final and binding.</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
