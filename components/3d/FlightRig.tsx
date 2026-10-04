"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_RIG, FLIGHT_BANK, FLIGHT_PATH, FLIGHT_SCENES } from "@/data/flight";
import { flightState, lerp, smoothstep } from "@/lib/flight-store";
import { AircraftModel } from "./AircraftModel";

/**
 * Moves the aircraft along the flight path and rides the camera behind it.
 *
 * The brief's requirement is that the site should not feel like "a website with
 * a 3D plane floating on top". Two things do most of that work here: the camera
 * is positioned *relative to the aircraft's own heading* rather than in world
 * space, so banking carries the viewpoint with it; and it is damped toward its
 * target rather than welded to it, so it trails and settles like a chase plane.
 */

export interface FlightRigProps {
  src: string;
  placeholder: boolean;
  /** Reduced tier shortens the path and softens the camera work. */
  reduced?: boolean;
}

export function FlightRig({ src, placeholder, reduced = false }: FlightRigProps) {
  const aircraft = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        FLIGHT_PATH.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        "catmullrom",
        0.4,
      ),
    [],
  );

  // Scratch vectors, reused every frame so the loop allocates nothing.
  const scratch = useMemo(
    () => ({
      position: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
      ahead: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      offset: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      lookAt: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      matrix: new THREE.Matrix4(),
    }),
    [],
  );

  // How far the aircraft is pushed off-centre, smoothed across frames so the
  // composition slides rather than jumping when one panel hands over to the next.
  const framing = useRef(0);

  useFrame((_, delta) => {
    const group = aircraft.current;
    if (!group) return;

    // Clamp delta: a backgrounded tab returns with a huge frame time, which
    // would snap the camera across the scene on the first frame back.
    const dt = Math.min(delta, 0.05);
    const t = Math.min(Math.max(flightState.progress, 0), 1);

    curve.getPointAt(t, scratch.position);
    curve.getTangentAt(t, scratch.tangent).normalize();

    group.position.copy(scratch.position);

    // Face along the path. The aircraft travels away from the opening camera,
    // so it is oriented down the tangent, not toward the viewer.
    scratch.lookAt.copy(scratch.position).add(scratch.tangent);
    scratch.matrix.lookAt(scratch.position, scratch.lookAt, scratch.up);
    scratch.quaternion.setFromRotationMatrix(scratch.matrix);

    // Bank, interpolated between control points, then applied about the
    // aircraft's own forward axis so it rolls into the turn.
    const bank = sampleBank(t) * (reduced ? 0.6 : 1);
    group.quaternion.slerp(scratch.quaternion, 1 - Math.exp(-10 * dt));
    group.rotateZ(bank);

    // A little nose attitude: pitch up through the climb, down on descent.
    const climb = smoothstep(0.08, 0.24, t) - smoothstep(0.84, 0.99, t);
    group.rotateX(lerp(-0.02, 0.07, climb));

    // --- Camera -------------------------------------------------------------
    const phase = t < 0.16 ? "ground" : t > 0.86 ? "landing" : "cruise";
    const distance = CAMERA_RIG.distance[phase];
    const height = CAMERA_RIG.height[phase];

    // Sit behind the aircraft along its own heading, raised a little.
    scratch.offset
      .copy(scratch.tangent)
      .multiplyScalar(-distance)
      .addScaledVector(scratch.up, height);

    // Swing the camera slightly outboard of the turn, which reads as the
    // viewer being carried through the bank rather than pivoting in place.
    scratch.desired
      .copy(scratch.position)
      .add(scratch.offset)
      .addScaledVector(
        scratch.tangent.clone().cross(scratch.up).normalize(),
        bank * -6 * CAMERA_RIG.bankFollow,
      );

    // A jump — an anchor link, a flung scrollbar, a restored scroll position —
    // can leave the camera hundreds of units behind, where it then crawls
    // forward for several seconds with the aircraft nowhere in frame. Past a
    // threshold, cut rather than chase.
    if (camera.position.distanceTo(scratch.desired) > 60) {
      camera.position.copy(scratch.desired);
    } else {
      const smoothing = 1 - Math.exp(-(1 / CAMERA_RIG.lag) * dt);
      camera.position.lerp(scratch.desired, smoothing);
    }

    // Compose the aircraft against the open panel: when a panel occupies the
    // left of the screen the aircraft is pushed right, and vice versa. This is
    // what stops the layout reading as text sitting on top of a 3D scene.
    framing.current = lerp(framing.current, framingTarget(t), 1 - Math.exp(-3 * dt));

    // Look a little ahead of the aircraft so it sits slightly low in frame and
    // the space it is flying into is visible.
    curve.getPointAt(Math.min(t + 0.015, 1), scratch.ahead);
    scratch.lookAt.lerpVectors(scratch.position, scratch.ahead, 0.6);

    // Aiming off to one side moves the subject to the other side of frame.
    // Note the negation: aiming the camera to the right pushes the subject to
    // the LEFT of frame. `framing` says where the aircraft should sit, so the
    // camera has to look the opposite way.
    scratch.right.copy(scratch.tangent).cross(scratch.up).normalize();
    scratch.lookAt
      .addScaledVector(scratch.right, -framing.current * 2.6)
      .addScaledVector(scratch.up, 0.75);

    camera.lookAt(scratch.lookAt);

    if (process.env.NODE_ENV !== "production") {
      // Dev readout: makes it possible to check framing numerically instead of
      // eyeballing how large the aircraft looks.
      (window as unknown as Record<string, unknown>).__flightDebug = {
        t: +t.toFixed(3),
        aircraft: scratch.position.toArray().map((n) => +n.toFixed(2)),
        camera: camera.position.toArray().map((n) => +n.toFixed(2)),
        distance: +camera.position.distanceTo(scratch.position).toFixed(2),
        framing: +framing.current.toFixed(2),
      };
    }

    // Roll the camera a fraction of the aircraft's bank. Subtle on purpose:
    // full roll is nauseating, none at all feels detached.
    camera.rotateZ(bank * CAMERA_RIG.bankFollow);
  });

  return (
    <group ref={aircraft}>
      <AircraftModel src={src} placeholder={placeholder} />
    </group>
  );
}

/**
 * Where the aircraft should sit in frame at progress `t`.
 *
 * Returns −1 (hard left) to +1 (hard right), blended by how present each scene
 * is, so the aircraft drifts across frame as one panel gives way to the next
 * instead of snapping between fixed positions.
 */
function framingTarget(t: number): number {
  let weighted = 0;
  let total = 0;

  for (const scene of FLIGHT_SCENES) {
    const d = Math.abs(t - scene.at);
    if (d > scene.span * 2.2) continue;
    const weight = 1 - d / (scene.span * 2.2);
    // A panel on the left wants the aircraft on the right.
    const target = scene.side === "left" ? 1 : scene.side === "right" ? -1 : 0;
    weighted += target * weight;
    total += weight;
  }

  return total > 0 ? weighted / total : 0;
}

/** Bank angle at progress `t`, interpolated between the control-point values. */
function sampleBank(t: number): number {
  const n = FLIGHT_BANK.length - 1;
  const scaled = t * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  return lerp(FLIGHT_BANK[i], FLIGHT_BANK[i + 1], scaled - i);
}
