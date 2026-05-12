import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import HowItWorks from "@/components/landing/how-it-works";
import Footer from "@/components/landing/footer";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col text-white">
      {/* Flowing SVG path animation — homepage only */}
      <BackgroundPaths />
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Footer />
    </div>
  );
}
