import { AnimatedNumber } from "@/components/ui/animated-number";

export default function Stats() {
  const stats = [
    { value: 5, suffix: "", label: "Domains" },
    { value: 37, prefix: "$", suffix: "K+", label: "Prize Pool" },
    { value: 60, suffix: "", label: "Days of Hacking" },
    { value: 5, suffix: "+", label: "Career Opportunities" },
  ];

  return (
    <section className="py-8 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="glow-line mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden relative z-10">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-black/50 hover:bg-white/[0.04] transition-colors p-6 sm:p-10 text-center"
            >
              <p
                className="text-4xl md:text-5xl font-bold mb-2 text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <AnimatedNumber 
                  value={item.value} 
                  prefix={item.prefix} 
                  suffix={item.suffix} 
                />
              </p>
              <p className="text-xs uppercase tracking-widest text-white/40 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="glow-line mt-16" />
      </div>
    </section>
  );
}