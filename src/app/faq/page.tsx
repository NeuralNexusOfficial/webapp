"use client";

import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "Who can participate?",
    answer: "Anyone with a passion for building! Whether you're a developer, designer, writer, animator, or innovator — you're welcome. AOT Hackathon is open to participants worldwide."
  },
  {
    question: "What are the domains?",
    answer: "There are 5 domains: Artificial Intelligence (AI), SaaS, Gaming, Storytelling, and Animation. Each has its own registration fee, prize structure, and judging criteria."
  },
  {
    question: "How much does it cost?",
    answer: "Registration fees vary by domain and participation type. Individual fees range from $8 (Storytelling) to $25 (AI). Team fees range from $36 (Animation) to $75 (AI). Storytelling is a Solo-only track. One payment per team covers all members."
  },
  {
    question: "Can I participate alone?",
    answer: "Absolutely. All domains allow individual participation. You can also form a team of up to 4 members for AI, SaaS, Gaming, and Animation. Storytelling is a Solo-only track."
  },
  {
    question: "What happens if my team leader pays?",
    answer: "If one member of your team (usually the leader) successfully pays the registration fee, it covers the entire team. You will not be prompted to pay again."
  },
  {
    question: "What are the prizes?",
    answer: "The total prize pool is $50K+ in cash prizes across 4 cash domains: AI ($15,000), SaaS ($10,000), Gaming ($10,000), and Animation ($15,000), while Storytelling is a non-cash track where top stories are adapted into animated films. Additionally, winners receive full-time roles, internships, PPOs, and premium tools/software subscriptions."
  },
  {
    question: "When does the hackathon run?",
    answer: "University promotions run from June 20 to August 20, 2026. The official hackathon runs from August 21 to October 21, 2026 — approximately 2 months including registrations, submissions, evaluations, and winner announcements."
  },
  {
    question: "What is Fraylon?",
    answer: "Fraylon is the organising platform behind AOT Hackathon. Winning projects may be published, launched, or produced under the Fraylon brand — including games, animated films, and SaaS products."
  },
  {
    question: "Can I use AI tools during the hackathon?",
    answer: "Yes — you may use AI assistance for coding, ideation, and content. However, all core logic and creative work must be authored by your team during the hackathon period."
  },
  {
    question: "What do I need to submit?",
    answer: "For most domains: a working prototype, GitHub repository link, and a short demo video. For Storytelling: original stories, screenplays, or scripts. All submissions must be completed before the October 21st deadline."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="card-cyber border border-white/10 rounded-lg overflow-hidden transition-colors hover:border-white/20">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-5 sm:p-6 text-left focus:outline-none"
      >
        <h3 className="text-xl font-bold text-white pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/70"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-0">
              <p className="text-white/70">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Frequently Asked Questions
        </h1>
        
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
