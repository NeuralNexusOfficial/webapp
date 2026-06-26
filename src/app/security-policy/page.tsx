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

            <p className="mt-4 mb-2 text-white/90">To help us quickly verify and resolve reports, please use the following submission template:</p>
            
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 my-4 font-mono text-xs text-white/80 space-y-3 leading-relaxed">
              <div>
                <span className="text-emerald-400 font-bold">1. Vulnerability Type / Class</span>
                <p className="text-white/40 mt-1">Specify the bug category (e.g., Cross-Site Scripting (XSS), IDOR / Privilege Escalation, SQL Injection, SSRF, CSRF, Authentication Bypass, Sensitive Information Disclosure).</p>
              </div>
              
              <div>
                <span className="text-emerald-400 font-bold">2. Affected URL &amp; Parameter</span>
                <p className="text-white/40 mt-1">Provide the exact page URL, API endpoint, or payload parameter that is vulnerable (e.g., GET /api/user?id=[vulnerable_parameter]).</p>
              </div>

              <div>
                <span className="text-emerald-400 font-bold">3. Attack Vector &amp; Impact Description</span>
                <p className="text-white/40 mt-1">Explain the realistic security impact. What can an attacker achieve? (e.g., read private data of other participants, hijack administrative user sessions, bypass gatekeeping controls).</p>
              </div>

              <div>
                <span className="text-emerald-400 font-bold">4. Step-by-Step Proof of Concept (PoC)</span>
                <ul className="list-disc pl-5 mt-1 space-y-1.5 text-white/40">
                  <li>List the exact sequential steps needed to trigger the bug.</li>
                  <li>Include request headers/payloads, curl commands, or script code if applicable.</li>
                  <li>For authorization issues (IDOR/Auth Bypass), outline steps demonstrating access from one test account to another test account's data.</li>
                  <li>For client-side vulnerabilities like XSS, please include a screenshot showing the alert/prompt execution with your browser/OS version.</li>
                </ul>
              </div>

              <div>
                <span className="text-emerald-400 font-bold">5. Remediation Suggestion (Optional)</span>
                <p className="text-white/40 mt-1">Provide any specific recommendations or library references to fix the flaw.</p>
              </div>
            </div>
            
            <p className="text-xs text-white/40 mt-4">
              Failure to provide a working Proof of Concept (PoC) or sufficient detail to reproduce the bug may delay response times or result in the report being marked as incomplete.
            </p>
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
