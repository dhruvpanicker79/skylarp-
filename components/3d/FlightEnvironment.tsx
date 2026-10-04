"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { SUN_DIRECTION } from "./Sky";
import { GoogleCity } from "./GoogleCity";

/**
 * The world the flight happens in: a hangar, a runway and daylight.
 *
 * Performance choices worth knowing about, because this runs every frame behind
 * the whole homepage:
 *
 *  - No shadow maps. A shadow pass re-renders the scene from the light every
 *    frame and bought little here — the aircraft is small in frame and mostly
 *    over cloud. Contact darkness under the wheels is a plain dark quad.
 *  - No per-frame JavaScript in the environment. Everything is static geometry
 *    built once; the clouds drift on a single parent rotation.
 *  - Runway markings are one merged geometry rather than ~50 separate meshes,
 *    which was ~50 draw calls for a row of white dashes.
 */

const RUNWAY_LENGTH = 460;
const RUNWAY_WIDTH = 13;

export function FlightEnvironment({ reduced = false }: { reduced?: boolean }) {
  return (
    <>
      {/* Daylight haze: pale and thin, so distance reads as depth rather than
          as a grey wall swallowing the scene. */}
      {/* Light haze only. Heavy fog greys out the HDRI and undoes it. */}
      <fogExp2 attach="fog" args={["#CFE0F0", 0.0008]} />

      {/* A photographic 360 sky (CC0, Poly Haven). This does two jobs that a
          hand-written gradient cannot: it IS the sky you see, and it lights
          every surface in the scene from a real sky's distribution — which is
          most of why CGI either looks photographed or looks like plastic. */}
      <Environment files="/hdri/sky-day.hdr" background backgroundBlurriness={0} />

      <Lighting reduced={reduced} />

      {/* Real Mumbai, when a Map Tiles API key is configured. Falls back to the
          plain ground below so the site never depends on Google being up. */}
      {/* Temporarily off: the tiles library gets 403 from Google even though
          the same request succeeds from the page via fetch. Re-enable once
          that is understood — see NOTES-google-tiles.md. */}
      {false ? <GoogleCity apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} /> : null}

      <Ground />
      <Runway />
      <Hangar />
    </>
  );
}

function Lighting({ reduced }: { reduced: boolean }) {
  const sunPosition = useMemo(() => SUN_DIRECTION.clone().multiplyScalar(120), []);

  return (
    <>
      {/* The HDRI already supplies sky and bounce light, so this is only the
          sun: a single direction for highlights and a sense of time of day.
          Adding the old hemisphere and ambient lights on top would double-count
          the sky and flatten everything out. */}
      <directionalLight position={sunPosition} intensity={1.4} color="#FFF6E6" />
      {!reduced ? (
        <directionalLight position={[60, 30, -80]} intensity={0.25} color="#9FC0F0" />
      ) : null}
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -200]}>
      <planeGeometry args={[1300, 1300]} />
      <meshStandardMaterial color="#5E6E55" roughness={1} metalness={0} />
    </mesh>
  );
}

/** Runway, with its markings merged into single draw calls. */
function Runway() {
  const markings = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];

    for (let z = 10; z > -RUNWAY_LENGTH; z -= 16) {
      const dash = new THREE.PlaneGeometry(0.45, 7);
      dash.rotateX(-Math.PI / 2);
      dash.translate(0, 0.012, z);
      parts.push(dash);
    }

    // Threshold bars at the near end.
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const bar = new THREE.PlaneGeometry(0.5, 9);
      bar.rotateX(-Math.PI / 2);
      bar.translate(i * 1.3, 0.012, 4);
      parts.push(bar);
    }

    return mergeGeometries(parts);
  }, []);

  const edges = useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    for (let z = 10; z > -RUNWAY_LENGTH; z -= 20) {
      for (const x of [-RUNWAY_WIDTH / 2 - 0.8, RUNWAY_WIDTH / 2 + 0.8]) {
        const pad = new THREE.PlaneGeometry(0.5, 0.5);
        pad.rotateX(-Math.PI / 2);
        pad.translate(x, 0.02, z);
        parts.push(pad);
      }
    }
    return mergeGeometries(parts);
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -RUNWAY_LENGTH / 2 + 10]}>
        <planeGeometry args={[RUNWAY_WIDTH, RUNWAY_LENGTH]} />
        <meshStandardMaterial color="#42464B" roughness={0.95} />
      </mesh>

      <mesh geometry={markings}>
        <meshStandardMaterial color="#EFEFE8" roughness={0.85} />
      </mesh>

      <mesh geometry={edges}>
        <meshBasicMaterial color="#FFD9A0" />
      </mesh>

      {/* Faked contact shadow where the aircraft starts. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 6]}>
        <planeGeometry args={[3.4, 1.6]} />
        <meshBasicMaterial color="#2A2E33" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/**
 * The hangar the flight starts inside.
 *
 * In daylight this earns its place: a dark interior framing a bright opening is
 * the whole of the first shot. Only what the camera can see is modelled.
 *
 * The doorway sits in FRONT of the opening camera (which starts near z = 13),
 * so the shot reads as looking out rather than at a shed.
 */
function Hangar() {
  const shell = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#6E7279",
        roughness: 0.95,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const frame = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#4A4E55", roughness: 0.9 }),
    [],
  );

  // Sized so the doorway actually frames the opening shot. A 30 m-wide shed
  // put its piers outside the camera's 38 degree field at this range, so the
  // first frame just showed open runway. A hangar for a 3 m-span aircraft is
  // small, and small is also what reads.
  const W = 16;
  const H = 7.5;
  const PIER = 3.6; // half-width of the clear opening
  const MOUTH = 0;
  const BACK = 38;

  return (
    <group>
      {[-W / 2, W / 2].map((x) => (
        <mesh
          key={x}
          position={[x, H / 2, (MOUTH + BACK) / 2]}
          rotation={[0, Math.PI / 2, 0]}
          material={shell}
        >
          <planeGeometry args={[BACK - MOUTH, H]} />
        </mesh>
      ))}

      <mesh position={[0, H, (MOUTH + BACK) / 2]} rotation={[Math.PI / 2, 0, 0]} material={shell}>
        <planeGeometry args={[W, BACK - MOUTH]} />
      </mesh>

      <mesh position={[0, H / 2, BACK]} material={shell}>
        <planeGeometry args={[W, H]} />
      </mesh>

      {/* Floor, so the interior does not show grass through it. */}
      <mesh
        position={[0, 0.01, (MOUTH + BACK) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={shell}
      >
        <planeGeometry args={[W, BACK - MOUTH]} />
      </mesh>

      {/* Doorway: a lintel and two piers leaving the gap the aircraft faces
          out through. */}
      <group position={[0, 0, MOUTH]}>
        <mesh position={[0, H - 0.9, 0]} material={frame}>
          <boxGeometry args={[W, 1.8, 0.9]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (PIER + (W / 2 - PIER) / 2), H / 2, 0]}
            material={frame}
          >
            <boxGeometry args={[W / 2 - PIER, H, 0.9]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Merge geometries that share a material, to cut draw calls. */
function mergeGeometries(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  const vertexCount = parts.reduce((n, g) => n + g.attributes.position.count, 0);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);

  let offset = 0;
  const indices: number[] = [];
  let base = 0;

  for (const g of parts) {
    positions.set(g.attributes.position.array as Float32Array, offset);
    if (g.attributes.normal) {
      normals.set(g.attributes.normal.array as Float32Array, offset);
    }
    offset += g.attributes.position.count * 3;

    const idx = g.index;
    if (idx) for (let i = 0; i < idx.count; i++) indices.push(idx.getX(i) + base);
    base += g.attributes.position.count;
    g.dispose();
  }

  merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  merged.setIndex(indices);
  return merged;
}
