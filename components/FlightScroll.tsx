"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { flightState, notifyFlight, setLenis, tickFlight } from "@/lib/flight-store";

/**
 * Turns scrolling into flight progress.
 *
 * Lenis smooths the wheel/touch input; this writes the resulting position into
 * the shared flight state and exposes it to CSS as `--flight-progress`. It does
 * not re-render anything: the 3D scene reads the value in its own frame loop,
 * and the panel layer reads it in a single rAF pass.
 *
 * When `enabled` is false (reduced motion, or a device on the static tier) no
 * Lenis instance is created and the browser's own scrolling is left alone.
 */
export function FlightScroll({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) {
      flightState.reducedMotion = true;
      notifyFlight();
      return;
    }

    flightState.reducedMotion = false;

    const lenis = new Lenis({
      // Anchor links and the skip link must still work: Lenis owns the scroll
      // position, so a plain window.scrollTo would be overwritten next frame.
      anchors: true,
      // Long, heavy easing: the page should feel like it has mass.
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    // Published so the rest of the app (and manual testing) can move the page
    // through Lenis rather than fighting it.
    setLenis(lenis);

    const root = document.documentElement;
    let frame = 0;
    let lastMilestone = -1;

    const tick = (time: number) => {
      lenis.raf(time);

      const max = document.body.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;

      flightState.progress = Math.min(Math.max(progress, 0), 1);
      flightState.velocity = lenis.velocity ?? 0;
      root.style.setProperty("--flight-progress", flightState.progress.toFixed(4));

      tickFlight();

      // Notify subscribers only when the flight crosses a tenth, so chrome that
      // genuinely needs React state does not re-render every frame.
      const milestone = Math.floor(flightState.progress * 10);
      if (milestone !== lastMilestone) {
        lastMilestone = milestone;
        notifyFlight();
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
      root.style.removeProperty("--flight-progress");
    };
  }, [enabled]);

  return null;
}
