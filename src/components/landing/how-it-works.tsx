export default function HowItWorks() {
  const steps = [
    "Register",
    "Build Team",
    "Hack & Submit",
    "Win Prizes",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
            >
              <span className="text-zinc-500">
                0{i + 1}
              </span>

              <h3 className="text-2xl font-semibold mt-4">
                {step}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}