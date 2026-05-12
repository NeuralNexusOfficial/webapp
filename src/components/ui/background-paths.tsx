"use client";

import { motion } from "framer-motion";

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Slim: width tops out at ~0.65px
    width: 0.25 + i * 0.01,
    // Transparent: opacity tops out at ~0.45
    opacity: 0.035 + i * 0.012,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        // Larger viewBox = paths appear zoomed out / smaller on screen
        viewBox="0 0 1100 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="white"
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: path.opacity }}
            animate={{
              pathLength: 1,
              opacity: [path.opacity * 0.5, path.opacity, path.opacity * 0.5],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 25 + (path.id % 6) * 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/** Homepage-only fixed background of flowing animated paths. */
export function BackgroundPaths() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
