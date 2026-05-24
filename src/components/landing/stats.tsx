import { AnimatedNumber } from "@/components/ui/animated-number";

export default function Stats() {
  const stats = [
    { value: 5000, suffix: "+", label: "Hackers Worldwide" },
    { value: 100, suffix: "+", label: "Projects Submitted" },
    { value: 24, suffix: " hrs", label: "Non-Stop Hacking" },
    { value: 5, prefix: "₹", suffix: "L+", label: "Prize Pool" },
  ];

  return (
    <section className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="glow-line mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-black/50 hover:bg-white/[0.04] transition-colors p-10 text-center"
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