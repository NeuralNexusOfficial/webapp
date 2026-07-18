import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AOT Hackathon",
  description: "Terms of Service for AOT Hackathon — Architects of Tomorrow. Read about eligibility, registration, intellectual property, and more.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Terms of Service
        </h1>
        <p className="text-sm text-white/30 mb-10">Last updated: May 29, 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the AOT Hackathon platform (&quot;Platform&quot;), operated by Fraylon (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
              you may not use the Platform or participate in the hackathon.
            </p>
            <p className="mt-3">
              We reserve the right to modify these Terms at any time. Continued use of the Platform after
              changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 13 years old to create an account. Participants aged 13–17 must have parental or guardian consent.</li>
              <li>You must provide accurate, complete, and current registration information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Each individual may only register one account and participate in one team.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Registration &amp; Payment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Participation requires registration and payment of the applicable registration fee: ₹500 for Solo entry or ₹1,200 for Team entry.</li>
              <li>All payments are processed through Razorpay in Indian Rupees (INR). By making a payment, you also agree to <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors">Razorpay&apos;s Terms of Service</a>.</li>
              <li>Registration fees are <strong className="text-white/90">non-refundable</strong> once payment is successfully processed, except at our sole discretion in cases of event cancellation.</li>
              <li>One payment per team covers all team members for that track.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Teams &amp; Participation</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Teams can have between 1 and 4 members.</li>
              <li>Solo participants are treated as a one-person team.</li>
              <li>Once a team has paid, members cannot leave or disband the team.</li>
              <li>Team leaders are responsible for their team&apos;s submissions and compliance with these Terms.</li>
              <li>You may not participate in multiple teams simultaneously.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Submissions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All submissions must be made before the published deadline. Late submissions will not be accepted.</li>
              <li>Submissions must be original work created during the hackathon period (August 21 – October 21, 2026).</li>
              <li>Use of open-source libraries, APIs, frameworks, and AI assistance tools is permitted, provided the core logic and creative work is authored by your team.</li>
              <li>Submissions must not contain malicious code, illegal content, or material that infringes on third-party intellectual property rights.</li>
              <li>Once a submission is finalized and locked, it cannot be edited.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You retain ownership of all intellectual property in your submission.</li>
              <li>By submitting a project, you grant Fraylon a non-exclusive, worldwide, royalty-free license to showcase, promote, and reference your project in connection with AOT Hackathon marketing and promotional materials.</li>
              <li>Winning projects may be offered opportunities for production, publishing, or launch under the Fraylon brand. Such arrangements will be subject to separate, mutually agreed-upon agreements.</li>
              <li>You warrant that your submission does not infringe on any third-party intellectual property rights.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Judging &amp; Prizes</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Submissions will be evaluated by a panel of judges selected by the organizers.</li>
              <li>Judging criteria include innovation, technical execution, design, and impact — specific weights may vary by track.</li>
              <li>The judges&apos; decisions are final and binding. No appeals will be entertained.</li>
              <li>Prizes will be distributed to winning teams as announced. Prize amounts and distribution methods are at the organizers&apos; discretion.</li>
              <li>Winners may be required to provide additional information (tax details, identity verification) before prize disbursement.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Code of Conduct</h2>
            <p className="mb-3">All participants must adhere to the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be respectful and professional in all interactions.</li>
              <li>Harassment, discrimination, or abusive behavior of any kind will result in immediate disqualification.</li>
              <li>No plagiarism — all core work must be original.</li>
              <li>Do not attempt to manipulate the judging process, exploit platform vulnerabilities, or interfere with other participants.</li>
              <li>Violations may result in account suspension, disqualification, and forfeiture of prizes.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              The Platform is provided &quot;as is&quot; without warranties of any kind, express or implied. We are not liable
              for any direct, indirect, incidental, or consequential damages arising from your use of the Platform
              or participation in the hackathon.
            </p>
            <p className="mt-3">
              We do not guarantee the availability, accuracy, or reliability of the Platform. We reserve the right
              to modify, suspend, or discontinue any aspect of the hackathon or Platform at any time.
            </p>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Disqualification</h2>
            <p className="mb-3">We reserve the right to disqualify any participant or team for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Violation of these Terms or the Code of Conduct.</li>
              <li>Submitting plagiarized, stolen, or pre-existing work.</li>
              <li>Attempting to game the system, manipulate voting, or exploit platform vulnerabilities.</li>
              <li>Any behavior deemed inappropriate or harmful by the organizers.</li>
            </ul>
            <p className="mt-3">
              Disqualified participants forfeit all prizes and may have their accounts suspended.
            </p>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India.
              Any disputes arising out of or in connection with these Terms shall be subject to the
              exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-3 text-white/90 font-mono text-sm">
              support@aothackathon.com
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
