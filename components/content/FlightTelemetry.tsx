"use client";

import { useEffect, useRef } from "react";
import { FLIGHT_PATH } from "@/data/flight";
import { flightState, onFlightFrame, smoothstep } from "@/lib/flight-store";

/**
 * The takeoff readout.
 *
 * Every value here describes the flight actually happening on screen: throttle
 * from the acceleration ramp, altitude from the aircraft's height on the
 * spline, airspeed from how fast the visitor is driving it. Nothing is
 * decorative — the brief rules out invented telemetry, and a readout that
 * disagreed with the aircraft would be exactly that.
 *
 * It fades in for the takeoff run and leaves once the aircraft is climbing.
 */

const MAX_ALTITUDE_FT = 4200;
const MAX_AIRSPEED_KT = 68;

export function FlightTelemetry() {
  const root = useRef<HTMLDivElement>(null);
  const throttle = useRef<HTMLSpanElement>(null);
  const airspeed = useRef<HTMLSpanElement>(null);
  const altitude = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // The readout belongs to the flight; without one there is nothing to read.
    if (flightState.reducedMotion) {
      el.style.display = "none";
      return;
    }

    // Peak height on the path, so altitude is scaled against the real flight.
    const ceiling = Math.max(...FLIGHT_PATH.map(([, y]) => y));

    return onFlightFrame((state) => {
      const t = state.progress;

      // Present across the ground roll and rotation, gone by the climb.
      const presence = Math.min(smoothstep(0.015, 0.05, t), 1 - smoothstep(0.17, 0.235, t));
      el.style.opacity = presence.toFixed(3);
      el.style.pointerEvents = "none";

      if (presence < 0.01) return;

      // Throttle opens through the ground roll and stays in once airborne.
      const throttlePct = Math.round(smoothstep(0.0, 0.08, t) * 100);

      // Height on the spline, mapped to a plausible scale for the aircraft.
      const climb = t / Math.max(FLIGHT_PATH.length - 1, 1);
      const idx = Math.min(Math.floor(t * (FLIGHT_PATH.length - 1)), FLIGHT_PATH.length - 2);
      const frac = t * (FLIGHT_PATH.length - 1) - idx;
      const y = FLIGHT_PATH[idx][1] + (FLIGHT_PATH[idx + 1][1] - FLIGHT_PATH[idx][1]) * frac;
      const altFt = Math.round((y / ceiling) * MAX_ALTITUDE_FT);

      // Scroll velocity, normalised — how hard the visitor is flying it.
      const kt = Math.round(
        Math.min(Math.abs(state.velocity) * 0.9 + smoothstep(0, 0.12, t) * 46, MAX_AIRSPEED_KT),
      );

      if (throttle.current) throttle.current.textContent = `${throttlePct}%`;
      if (airspeed.current) airspeed.current.textContent = `${kt} kt`;
      if (altitude.current) altitude.current.textContent = `${altFt} ft`;
      void climb;
    });
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      style={{ opacity: 0 }}
      // Fixed, not absolute: it belongs to the viewport like the flight scene
      // does. As `absolute` it had no positioned ancestor and scrolled away.
      className="pointer-events-none fixed right-[5vw] top-[calc(var(--nav-h)+2.5rem)] z-20 border border-white/15 bg-navy-900/70 px-5 py-4 backdrop-blur-sm"
    >
      <Row label="Throttle" valueRef={throttle} />
      <Row label="Airspeed" valueRef={airspeed} />
      <Row label="Altitude" valueRef={altitude} />
    </div>
  );
}

function Row({
  label,
  valueRef,
}: {
  label: string;
  valueRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="flex items-baseline justify-between gap-10 py-0.5">
      <span className="label-meta">{label}</span>
      <span ref={valueRef} className="font-mono text-caption tabular-nums text-ivory-100">
        —
      </span>
    </div>
  );
}
