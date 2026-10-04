"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TilesRenderer } from "3d-tiles-renderer";
import { GoogleCloudAuthPlugin, TileCompressionPlugin } from "3d-tiles-renderer/plugins";

/**
 * Photorealistic Mumbai, from Google's 3D Tiles.
 *
 * This is real photogrammetry of the actual city, not scenery: the aircraft
 * genuinely flies over Mumbai's coastline.
 *
 * Two things make this work with a hand-built flight path. The tileset is in
 * earth-centred, earth-fixed coordinates — metres from the centre of the
 * planet — so it has to be rotated and translated until the chosen latitude
 * and longitude sit at the origin with "up" pointing along +Y. And it streams,
 * so it is told where the camera is each frame and left to fetch what it needs.
 *
 * Without an API key this renders nothing and the plain ground stays visible,
 * so the site never depends on Google being reachable.
 */

/** Marine Drive, Mumbai — coastline on one side, city on the other. */
const ORIGIN = { lat: 18.9435, lon: 72.8235, height: 0 };

/** World units per metre. The flight is ~450 units long; the city is km wide. */
const SCALE = 1 / 26;

export function GoogleCity({ apiKey }: { apiKey?: string }) {
  const { camera, gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const [failed, setFailed] = useState(false);

  const tiles = useMemo(() => {
    if (!apiKey) return null;

    const t = new TilesRenderer();
    t.registerPlugin(new GoogleCloudAuthPlugin({ apiToken: apiKey, autoRefreshToken: true }));
    // Draco/KTX2 payloads arrive compressed; decoding them on the GPU keeps
    // memory sane while streaming a city.
    t.registerPlugin(new TileCompressionPlugin());

    // Stream less aggressively than the default. The city is background: it
    // must not compete with the aircraft for frame time.
    t.errorTarget = 24;
    t.maxDepth = 15;
    t.lruCache.minSize = 300;
    t.lruCache.maxSize = 600;

    return t;
  }, [apiKey]);

  // Place the chosen lat/lon at the origin, oriented so up is +Y.
  useEffect(() => {
    if (!tiles || !group.current) return;

    const onLoad = () => {
      const ellipsoid = tiles.ellipsoid;
      const position = new THREE.Vector3();
      const matrix = new THREE.Matrix4();

      ellipsoid.getCartographicToPosition(
        THREE.MathUtils.degToRad(ORIGIN.lat),
        THREE.MathUtils.degToRad(ORIGIN.lon),
        ORIGIN.height,
        position,
      );
      ellipsoid.getEastNorthUpFrame(
        THREE.MathUtils.degToRad(ORIGIN.lat),
        THREE.MathUtils.degToRad(ORIGIN.lon),
        ORIGIN.height,
        matrix,
      );

      // Invert the local frame so that point ends up at the origin facing up,
      // then scale the whole planet down to the size of this flight.
      tiles.group.matrix.copy(matrix).invert();
      tiles.group.matrix.decompose(
        tiles.group.position,
        tiles.group.quaternion,
        tiles.group.scale,
      );
      tiles.group.scale.setScalar(SCALE);
      tiles.group.position.multiplyScalar(SCALE);

      // Sit the city below the flight so the aircraft is genuinely above it.
      tiles.group.position.y -= 2;
      tiles.group.updateMatrixWorld(true);
      void position;
    };

    tiles.addEventListener("load-tile-set", onLoad);
    tiles.addEventListener("load-error", () => setFailed(true));

    group.current.add(tiles.group);
    const owner = group.current;
    return () => {
      tiles.removeEventListener("load-tile-set", onLoad);
      owner.remove(tiles.group);
      tiles.dispose();
    };
  }, [tiles]);

  useFrame(() => {
    if (!tiles || failed) return;
    tiles.setCamera(camera);
    tiles.setResolutionFromRenderer(camera, gl);
    camera.updateMatrixWorld();
    tiles.update();
  });

  if (!apiKey || failed) return null;

  return <group ref={group} name="mumbai" />;
}

/**
 * Google requires its attribution to be shown wherever its tiles are. This is
 * a licensing condition, not decoration — do not remove it.
 */
export function GoogleCityAttribution({ apiKey }: { apiKey?: string }) {
  if (!apiKey) return null;
  return (
    <p className="pointer-events-none fixed bottom-3 left-[5vw] z-20 font-mono text-[0.625rem] uppercase tracking-wider text-white/70 drop-shadow">
      Imagery ©2026 Google
    </p>
  );
}
