"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { AircraftModel } from "./AircraftModel";

/**
 * A single aircraft, free to orbit.
 *
 * Lit explicitly rather than with drei's <Stage>, which pulls an HDR
 * environment map from a remote CDN — a dependency this site should not have,
 * since it has to work on a venue's network or none at all.
 *
 * Drag to rotate. Zoom is disabled so the controls do not swallow the wheel and
 * trap the page; auto-rotation stops as soon as the visitor takes hold.
 */
export function AircraftViewer({
  src,
  placeholder,
}: {
  src: string;
  placeholder: boolean;
}) {
  return (
    <Canvas
      camera={{ fov: 32, position: [3.1, 1.5, 4.2] }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      {/* Three-point setup: warm key, cool fill, rim from behind to separate
          the airframe from the dark panel it sits on. */}
      <hemisphereLight args={["#8FA4D8", "#4A3A2E", 0.75]} />
      <directionalLight position={[4, 6, 5]} intensity={2.3} color="#FFE2C2" />
      <directionalLight position={[-5, 2, -3]} intensity={0.9} color="#7E9BE8" />
      <directionalLight position={[0, 3, -6]} intensity={1.2} color="#FFB877" />

      <Suspense fallback={null}>
        <group position={[0, -0.1, 0]}>
          <AircraftModel src={src} placeholder={placeholder} targetSpan={3.05} />
        </group>
      </Suspense>

      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.55}
        enablePan={false}
        enableZoom={false}
        target={[0, 0, 0]}
        minPolarAngle={Math.PI * 0.14}
        maxPolarAngle={Math.PI * 0.6}
      />
    </Canvas>
  );
}
