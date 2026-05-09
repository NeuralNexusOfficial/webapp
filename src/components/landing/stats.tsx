export default function Stats() {
  const stats = [
    { value: "5000+", label: "Hackers" },
    { value: "100+", label: "Projects" },
    { value: "24hrs", label: "Build Time" },
    { value: "₹5L+", label: "Prize Pool" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-zinc-900 rounded-3xl p-8 text-center border border-zinc-800"
          >
            <h2 className="text-4xl font-bold">
              {item.value}
            </h2>

            <p className="text-zinc-400 mt-2">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}