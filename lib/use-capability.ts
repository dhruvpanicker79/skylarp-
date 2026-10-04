"use client";

import { useEffect, useState } from "react";

export type Tier = "full" | "reduced" | "static";

/**
 * Decide how much flight this device and this visitor should get.
 *
 * `full`    — the scroll-driven 3D flight.
 * `reduced` — a lighter 3D scene: shorter path, fewer lights, no shadows.
 * `static`  — no WebGL loop at all; ordinary sectioned scrolling.
 *
 * The brief is explicit that a weak device should not be shown a broken 3D
 * scene, and that `prefers-reduced-motion` must replace the sequence rather
 * than merely speed it up. Both routes end at `static`.
 */
export function useCapability(): Tier {
  // Server render and first paint assume `full`, then correct on mount. The
  // scene does not start until `ready`, so nothing heavy runs in between.
  const [tier, setTier] = useState<Tier>("full");

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const decide = () => {
      if (motionQuery.matches) return setTier("static");

      if (!hasWebGL()) return setTier("static");

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.innerWidth < 768;
      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;

      // Phones get the reduced scene: still a flight, but one that holds frame
      // rate. Genuinely weak hardware drops to static.
      if (cores <= 2 || memory <= 2) return setTier("static");
      if (coarse || narrow) return setTier("reduced");
      return setTier("full");
    };

    decide();
    motionQuery.addEventListener("change", decide);
    window.addEventListener("resize", decide, { passive: true });
    return () => {
      motionQuery.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
    };
  }, []);

  return tier;
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}
