import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AOT Hackathon",
  description: "Privacy Policy for AOT Hackathon — Architects of Tomorrow. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-white/30 mb-10">Last updated: May 29, 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to AOT Hackathon (&quot;Architects of Tomorrow&quot;), organized by Fraylon (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              We are committed to protecting your personal information and your right to privacy. This Privacy Policy
              explains what information we collect, how we use it, and what rights you have in relation to it.
            </p>
            <p className="mt-3">
              By using the AOT Hackathon platform (the &quot;Platform&quot;), you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white/90">Account Information:</strong> When you register, we collect your name, email address, and authentication credentials (via Google OAuth or email/password).</li>
              <li><strong className="text-white/90">Profile Information:</strong> Your display name, team associations, and hackathon track preferences.</li>
              <li><strong className="text-white/90">Payment Information:</strong> Payment transactions are processed through Razorpay. We store your Razorpay order ID, payment status, and transaction amount. We do not store your credit/debit card numbers, UPI IDs, or bank account details.</li>
              <li><strong className="text-white/90">Submission Data:</strong> Project titles, descriptions, repository URLs, demo links, and uploaded files that you submit as part of the hackathon.</li>
              <li><strong className="text-white/90">Usage Data:</strong> We may collect information about how you access and use the Platform, including your IP address, browser type, and timezone (used for currency detection).</li>
            </ul>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To create and manage your account and team registrations.</li>
              <li>To process hackathon registration payments.</li>
              <li>To facilitate team formation, project submissions, and judging.</li>
              <li>To communicate with you about the hackathon (updates, deadlines, results).</li>
              <li>To display participant and team information on leaderboards and public listings.</li>
              <li>To detect your local currency for accurate pricing display.</li>
              <li>To improve, maintain, and secure the Platform.</li>
            </ul>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing &amp; Third Parties</h2>
            <p className="mb-3">We do not sell your personal information. We may share your data with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white/90">Razorpay:</strong> Our payment processor. Subject to <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors">Razorpay&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-white/90">Supabase:</strong> Our database and authentication provider. Data is stored securely on Supabase infrastructure.</li>
              <li><strong className="text-white/90">Judges &amp; Organizers:</strong> Your submission data (project title, description, links) will be shared with hackathon judges for evaluation.</li>
              <li><strong className="text-white/90">Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
            </ul>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. Your data
              is stored in Supabase with Row Level Security (RLS) policies, and all communications are encrypted
              via HTTPS/TLS. Payment processing is handled entirely by Razorpay&apos;s PCI-DSS compliant infrastructure.
            </p>
            <p className="mt-3">
              While we strive to protect your information, no method of electronic storage or transmission is 100% secure.
              We cannot guarantee absolute security.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide
              you services related to the hackathon. After the hackathon concludes, we may retain certain data
              for record-keeping, legal compliance, or to resolve disputes. You may request deletion of your
              account and associated data by contacting us.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict our processing of your data.</li>
              <li>Withdraw consent at any time (where consent is the basis for processing).</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies &amp; Tracking</h2>
            <p>
              The Platform uses essential cookies for authentication and session management. We do not use
              third-party advertising or analytics trackers. Your IP address may be used temporarily for
              currency detection via third-party geolocation APIs but is not stored on our servers.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Children&apos;s Privacy</h2>
            <p>
              The Platform is not intended for individuals under the age of 13. We do not knowingly collect
              personal information from children under 13. Participants between 13 and 18 must have parental
              or guardian consent to register.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users of material
              changes via email or a prominent notice on the Platform. Your continued use of the Platform after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="card-cyber p-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your data rights,
              please contact us at:
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
