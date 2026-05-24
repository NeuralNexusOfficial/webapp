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
            <p className="text-white/70">Anyone with a passion for building! Whether you're a seasoned developer, a creative designer, or a visionary student, you're welcome here.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">How much does it cost?</h3>
            <p className="text-white/70">Registration fees vary by domain and team size (from $8 to $35). This covers your access to tracks, platforms, and potential swag depending on the domain selected.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">Can I participate alone?</h3>
            <p className="text-white/70">Absolutely. You can participate as an individual or form a team of up to 4 members. Note that pricing differs for teams vs individuals.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">What happens if my team has paid?</h3>
            <p className="text-white/70">If one member of your team (usually the leader) successfully pays the registration fee, it covers the entire team. You will not be prompted to pay again.</p>
          </div>

          <div className="card-cyber p-6">
            <h3 className="text-xl font-bold text-white mb-2">When is the deadline?</h3>
            <p className="text-white/70">The hackathon ends on October 21st, 2026. All submissions, including code repositories and demo videos, must be finalised by this date.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
