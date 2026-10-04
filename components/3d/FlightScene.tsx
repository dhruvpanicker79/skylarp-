"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { HERO_AIRCRAFT } from "@/data/aircraft";
import { flightState } from "@/lib/flight-store";
import type { Tier } from "@/lib/use-capability";
import { FlightEnvironment } from "./FlightEnvironment";
import { FlightRig } from "./FlightRig";
import { GoogleCity } from "./GoogleCity";

/**
 * The WebGL layer of the homepage.
 *
 * Fixed behind the content, driven entirely by scroll. It renders nothing on
 * the `static` tier — that path never mounts a canvas at all, so a device that
 * cannot run this well is not asked to.
 */
export function FlightScene({ tier }: { tier: Tier }) {
  if (tier === "static") return null;

  const reduced = tier === "reduced";

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        // The aircraft is the subject; a long lens keeps perspective calm and
        // stops the nose ballooning when the camera closes up on the ground.
        camera={{ fov: 38, near: 0.1, far: 700, position: [0, 1.8, 13] }}
        // Shadow maps are off everywhere: the pass cost more than it showed.
        // DPR is capped at 1.5 — on a 2x display a full-screen WebGL canvas at
        // dpr 2 is 4x the pixels for a difference nobody sees in motion.
        dpr={reduced ? [1, 1.25] : [1, 1.5]}
        shadows={false}
        gl={{
          antialias: !reduced,
          powerPreference: "high-performance",
          alpha: false,
          // A bright HDRI blows the airframe out at exposure 1. Pulling it
          // back keeps the sky bright while the aircraft holds its material.
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.78,
        }}
        onCreated={() => {
          flightState.ready = true;
        }}
      >
        <FlightEnvironment reduced={reduced} />
        {/* Off: tiles authenticate and download, but are not visible —
            see NOTES-google-tiles.md. Flip to render to resume. */}
        {false ? <GoogleCity apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} /> : null}
        <FlightRig
          src={HERO_AIRCRAFT.model}
          placeholder={HERO_AIRCRAFT.modelIsPlaceholder}
          reduced={reduced}
        />
        {/* Drop resolution rather than frame rate when the GPU is struggling. */}
        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
    </div>
  );
}
