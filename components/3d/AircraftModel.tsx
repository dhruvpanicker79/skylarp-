"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AircraftPlaceholder } from "./AircraftPlaceholder";

/**
 * Renders an aircraft, from a real GLB when one exists and from the schematic
 * placeholder until then.
 *
 * Replacing the placeholder is meant to be a file drop, not a code change:
 * put `vajra.glb` in /public/models and set `modelIsPlaceholder: false` in
 * data/aircraft.ts. On load the model is measured and normalised so that it
 * arrives at the same span and origin the placeholder used, which means the
 * camera rig, flight path and lighting keep working untouched.
 */

export interface AircraftModelProps {
  /** Path under /public, e.g. "/models/vajra.glb". */
  src: string;
  /** When true, skip loading entirely and show the schematic stand-in. */
  placeholder: boolean;
  /** Target wingspan in world units, so any export lands at the right size. */
  targetSpan?: number;
  dimmed?: boolean;
}

export function AircraftModel({
  src,
  placeholder,
  targetSpan = 3.05,
  dimmed,
}: AircraftModelProps) {
  if (placeholder) return <AircraftPlaceholder dimmed={dimmed} />;

  return (
    <Suspense fallback={<AircraftPlaceholder dimmed />}>
      <LoadedModel src={src} targetSpan={targetSpan} />
    </Suspense>
  );
}

function LoadedModel({ src, targetSpan }: { src: string; targetSpan: number }) {
  const { scene } = useGLTF(src);
  const group = useRef<THREE.Group>(null);

  // Clone so the same model can appear in more than one place (the homepage
  // flight and an aircraft page) without them sharing a transform.
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    if (!group.current) return;

    // Normalise: centre on the origin and scale to the intended span, so a CAD
    // export in inches, millimetres or arbitrary units still lands correctly.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());

    const span = Math.max(size.x, 0.0001);
    const scale = targetSpan / span;

    model.position.set(-centre.x * scale, -centre.y * scale, -centre.z * scale);
    model.scale.setScalar(scale);

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model, targetSpan]);

  return (
    <group ref={group} name="aircraft-model">
      <primitive object={model} />
    </group>
  );
}

/**
 * Preload a model so it is ready before the visitor scrolls to it. Safe to call
 * for a path that does not exist yet — it simply does nothing useful.
 */
export function preloadAircraft(src: string) {
  useGLTF.preload(src);
}
