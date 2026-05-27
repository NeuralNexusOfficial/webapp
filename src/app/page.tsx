import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import HowItWorks from "@/components/landing/how-it-works";
import Tracks from "@/components/landing/tracks";
import Sponsors from "@/components/landing/sponsors";
import Footer from "@/components/landing/footer";
import { BackgroundPaths } from "@/components/ui/background-paths";
import Chatbot from "@/components/landing/chatbot";
import SplashCursor from "@/components/ui/splash-cursor";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col text-white">
      <SplashCursor zIndex={1} />
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Tracks />
      <Sponsors />
      <Footer />
      <Chatbot />
    </div>
  );
}
