export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Register",
      desc: "Sign up, choose your domain, and complete your profile. Fees start at just ₹500.",
    },
    {
      num: "02",
      title: "Build Your Team",
      desc: "Form a team of up to 3 or compete solo — your call.",
    },
    {
      num: "03",
      title: "Hack & Submit",
      desc: "Build your project over 2 months (Jan 1 – Mar 1, 2027) and submit via the dashboard.",
    },
    {
      num: "04",
      title: "Win Big",
      desc: "Top projects win from a ₹12,00,000 prize pool, plus roles, internships & career perks.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="tag-label mb-4">Process</div>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-4 relative z-10">
          {steps.map((step, i) => (
            <div key={step.num} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-4 h-px bg-white/10 z-10" />
              )}

              <div className="card-cyber p-5 sm:p-8 h-full flex flex-col gap-4">
                <span
                  className="text-5xl font-bold text-white/[0.4] group-hover:text-white/60 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}