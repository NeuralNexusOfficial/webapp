import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Frequently Asked Questions
        </h1>
        
        <div className="space-y-6">
          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">Who can participate?</h3>
            <p className="text-white/70">Anyone with a passion for building! Whether you&apos;re a developer, designer, writer, animator, or innovator — you&apos;re welcome. AOT Hackathon is open to participants worldwide.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">What are the domains?</h3>
            <p className="text-white/70">There are 5 domains: Artificial Intelligence (AI), SaaS, Gaming, Storytelling, and Animation. Each has its own registration fee, prize structure, and judging criteria.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">How much does it cost?</h3>
            <p className="text-white/70">Registration fees vary by domain and participation type. Individual fees range from $8 (Storytelling) to $25 (AI). Team fees range from $18 (Animation) to $35 (AI). One payment per team covers all members.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">Can I participate alone?</h3>
            <p className="text-white/70">Absolutely. All domains allow individual participation. You can also form a team of up to 4 members. Note that pricing differs for teams vs individuals.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">What happens if my team leader pays?</h3>
            <p className="text-white/70">If one member of your team (usually the leader) successfully pays the registration fee, it covers the entire team. You will not be prompted to pay again.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">What are the prizes?</h3>
            <p className="text-white/70">The total prize pool is $37,000+ in cash prizes. AI 1st place wins $15,000, Gaming 1st place wins $10,000, SaaS 1st place wins $7,000, Animation 1st place wins $5,000. Additionally, winners receive full-time roles, internships, and annual subscriptions to tools like ChatGPT, Midjourney, and RunwayML.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">When does the hackathon run?</h3>
            <p className="text-white/70">University promotions run from June 20 to August 20, 2026. The official hackathon runs from August 21 to October 21, 2026 — approximately 2 months including registrations, submissions, evaluations, and winner announcements.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">What is Fraylon?</h3>
            <p className="text-white/70">Fraylon is the organising platform behind AOT Hackathon. Winning projects may be published, launched, or produced under the Fraylon brand — including games, animated films, and SaaS products.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">Can I use AI tools during the hackathon?</h3>
            <p className="text-white/70">Yes — you may use AI assistance for coding, ideation, and content. However, all core logic and creative work must be authored by your team during the hackathon period.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">What do I need to submit?</h3>
            <p className="text-white/70">For most domains: a working prototype, GitHub repository link, and a short demo video. For Storytelling: original stories, screenplays, or scripts. All submissions must be completed before the October 21st deadline.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
