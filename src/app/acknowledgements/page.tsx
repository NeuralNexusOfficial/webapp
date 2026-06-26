import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security Acknowledgements | AOT Hackathon",
  description: "AOT Hackathon Security Hall of Fame. We thank all security researchers who help keep our platform and participants secure.",
};

export default function AcknowledgementsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Security Acknowledgements
        </h1>
        <p className="text-sm text-white/30 mb-10">Honoring those who help secure the Architects of Tomorrow platform</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Hall of Fame</h2>
            <p className="mb-6">
              We appreciate the efforts of security researchers who identify vulnerabilities and report them to us in accordance with our <Link href="/security-policy" className="text-emerald-400 hover:underline">Security Policy</Link>. Below is a list of individuals and teams who have made significant contributions to the security of AOT Hackathon.
            </p>

            {/* Placeholder / Empty State for fresh launch */}
            <div className="border border-white/10 rounded-xl p-8 text-center bg-white/[0.02]">
              <p className="text-white/40 text-sm mb-4">No security reports have been submitted yet.</p>
              <p className="text-xs text-white/35">
                Be the first to help secure our platform! Check our{" "}
                <Link href="/security-policy" className="text-emerald-400/80 hover:text-emerald-400 hover:underline transition-colors">
                  Security Policy
                </Link>{" "}
                to learn how to submit a report.
              </p>
            </div>

            {/* Standard layout for future entries */}
            <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.01] hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white">
                    <th className="px-6 py-4">Researcher</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description / Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm text-white/80">
                  {/* Future rows will look like this:
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">John Doe (example)</td>
                    <td className="px-6 py-4 font-mono text-xs">2026-06-26</td>
                    <td className="px-6 py-4">Vulnerability in user sessions</td>
                  </tr>
                  */}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card-cyber p-5 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-3">How to be listed</h2>
            <p className="text-sm">
              If you believe you have found a security vulnerability in the AOT Hackathon platform, please report it via email to{" "}
              <a href="mailto:aothackathonfraylon@gmail.com" className="text-emerald-400 hover:underline font-mono">
                aothackathonfraylon@gmail.com
              </a>
              . Once the vulnerability has been validated, fixed, and verified, we will be glad to add your name to this page as a token of our appreciation.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
