import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security Policy | AOT Hackathon",
  description: "Security Policy and Vulnerability Disclosure guidelines for AOT Hackathon. Learn how to report security issues responsibly.",
};

export default function SecurityPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Security Policy
        </h1>
        <p className="text-sm text-white/30 mb-10">Last updated: June 26, 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Our Commitment</h2>
            <p>
              At AOT Hackathon, we take the security of our platform, participants, and data seriously. We welcome feedback and reports from independent security researchers to help us keep our platform safe. If you believe you have discovered a vulnerability, we appreciate your help in disclosing it to us responsibly.
            </p>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Program Scope</h2>
            <p className="mb-3">
              The scope of this security policy covers:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The primary web application and user portal hosted at <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">aothackathon.com</code>.</li>
              <li>Underlying APIs and services managed directly by us.</li>
            </ul>
            <p className="mt-4 mb-3 text-white/90 font-semibold">Out of Scope:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vulnerabilities in third-party services we integrate with (e.g., Supabase, Razorpay, or host provider infrastructure). Please report these directly to the respective service providers.</li>
              <li>Denial of Service (DoS/DDoS) attacks.</li>
              <li>Spam, phishing, or social engineering targeting our users or team.</li>
              <li>Physical security threats or attacks against our staff.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Guidelines for Responsible Disclosure</h2>
            <p className="mb-3">
              To encourage responsible reporting, we ask that you follow these guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Do not exploit, view, alter, or delete any data belonging to other users. Only test with accounts you own or have explicit permission to use.</li>
              <li>Give us a reasonable amount of time to investigate and resolve the issue before disclosing it publicly.</li>
              <li>Do not perform destructive actions, such as resource exhaustion or modifying production configurations.</li>
              <li>Avoid automated scanner floods that could impact platform performance.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. How to Submit a Report</h2>
            <p>
              Please send details of the vulnerability to:
            </p>
            <p className="mt-3 text-emerald-400 font-mono text-sm">
              <a href="mailto:aothackathonfraylon@gmail.com" className="hover:underline">aothackathonfraylon@gmail.com</a>
            </p>
            <p className="mt-4">
              For secure communication, you may encrypt your report using our PGP public key. You can find our key at:
            </p>
            <p className="mt-2 text-sm">
              <Link href="/pgp-key.txt" target="_blank" className="text-emerald-400 hover:underline font-mono">
                https://aothackathon.com/pgp-key.txt
              </Link>
            </p>
            <p className="mt-4 mb-2 text-white/90">Your report should ideally include:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A description of the vulnerability and its potential impact.</li>
              <li>Detailed steps to reproduce the vulnerability (proof-of-concept scripts or screenshots are highly appreciated).</li>
              <li>Your contact information and how you would like to be credited.</li>
            </ul>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Safe Harbor</h2>
            <p>
              If you conduct security research and report vulnerabilities in accordance with this policy, we consider your research to be authorized. We will not pursue legal action or request law enforcement to investigate your activities, provided you act in good faith and adhere to these guidelines.
            </p>
            <p className="mt-3">
              We look forward to collaborating with you to protect the Architects of Tomorrow community. Verified contributors may be featured in our <Link href="/acknowledgements" className="text-emerald-400 hover:underline">Acknowledgements</Link> list.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
