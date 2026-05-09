import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-6">

      <div className="max-w-5xl">
        <p className="uppercase tracking-widest text-zinc-400 mb-4">
          Global Hackathon Platform
        </p>

        <h1 className="text-6xl md:text-8xl font-bold leading-tight">
          Build. Compete.
          <br />
          Change The Future.
        </h1>

        <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto">
          Join developers, designers and innovators
          to solve real world challenges.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold"
          >
            Register Now
          </Link>

          <button className="border border-zinc-700 px-8 py-4 rounded-full">
            Explore Tracks
          </button>
        </div>
      </div>
    </section>
  );
}