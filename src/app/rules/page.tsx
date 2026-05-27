import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Official Rules
        </h1>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Eligibility</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>AOT Hackathon is open to all developers, designers, and innovators worldwide.</li>
              <li>Participants must be at least 18 years old or have parental consent.</li>
              <li>Teams can consist of 1 to 4 members. Individual participation is also allowed.</li>
            </ul>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Code & Submissions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All project code must be written during the hackathon period (Aug 21 - Oct 21, 2026).</li>
              <li>Use of open-source libraries and APIs is highly encouraged, but the core logic must be original.</li>
              <li>A working prototype, GitHub repository link, and a short demo video are required for a valid submission.</li>
            </ul>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Domains & Tracks</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Submissions must target one of the specific domains: SaaS, Animation, Storytelling, Gaming, or AI.</li>
              <li>Cross-domain projects are allowed but must declare a primary domain for judging.</li>
            </ul>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Code of Conduct</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be respectful. Harassment of any kind will not be tolerated and will result in immediate disqualification.</li>
              <li>Collaborate and share knowledge. Hackathons are about community.</li>
              <li>The judges' decisions are final and binding.</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
