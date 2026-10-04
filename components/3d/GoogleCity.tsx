"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TilesRenderer } from "3d-tiles-renderer";
import { GoogleCloudAuthPlugin } from "3d-tiles-renderer/plugins";

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

/**
 * Sign Google tile requests with the API key.
 *
 * `GoogleCloudAuthPlugin` signs the root tileset request, but not the child
 * tile requests discovered from it: those go out carrying only `session`, and
 * Google answers 403 to every one. Verified directly in the browser — the same
 * tile URL returns 403 without `key` and 200 with it.
 *
 * The library's own extension points do not reach these requests (both
 * `preprocessURL` and removing the competing compression plugin were tried), so
 * the parameter is added at the fetch layer. It touches only
 * `tile.googleapis.com` URLs that are missing a key, and leaves every other
 * request in the app alone.
 *
 * Revisit when upgrading `3d-tiles-renderer` — this is a workaround for a
 * library gap, not something that should live forever.
 */
let googleApiKey: string | null = null;

if (typeof window !== "undefined") {
  const w = window as unknown as Record<string, unknown>;
  if (!w.__skylarkTileSigner) {
    w.__skylarkTileSigner = true;
    const original = window.fetch.bind(window);

    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (googleApiKey) {
        const href =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : (input as Request).url;

        if (href && href.includes("tile.googleapis.com")) {
          const url = new URL(href);
          if (!url.searchParams.has("key")) {
            url.searchParams.set("key", googleApiKey);
            return original(url.toString(), init);
          }
        }
      }
      return original(input as RequestInfo, init);
    };
  }
}

/** Marine Drive, Mumbai — coastline on one side, city on the other. */
const ORIGIN = { lat: 18.9435, lon: 72.8235, height: 0 };

export function GoogleCity({ apiKey }: { apiKey?: string }) {
  if (typeof window !== "undefined") {
    const w = window as unknown as Record<string, unknown>;
    w.__cityRender = ((w.__cityRender as number) ?? 0) + 1;
    w.__cityKey = apiKey ? `${apiKey.slice(0, 8)}…` : String(apiKey);
  }

  const { camera, gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const [failed, setFailed] = useState(false);

  // The fetch signer above needs the key before the renderer makes its first
  // request, which happens during this render, not in an effect.
  if (apiKey) googleApiKey = apiKey;

  const tiles = useMemo(() => {
    if (!apiKey) return null;

    const t = new TilesRenderer();
    t.registerPlugin(new GoogleCloudAuthPlugin({ apiToken: apiKey, autoRefreshToken: true }));

    // Sign every Google URL with the API key.
    //
    // The auth plugin signs the root tileset request but not the child tile
    // requests it discovers: those go out carrying only `session`, and Google
    // answers 403 to every one. Verified directly — the same tile URL returns
    // 403 without `key` and 200 with it.
    //
    // `preprocessURL` is the library's own hook and runs for every plugin, so
    // this adds the parameter without monkey-patching fetch.
    t.registerPlugin({
      name: "SKYLARK_GOOGLE_KEY",
      preprocessURL: (uri: string | URL) => {
        const url = new URL(uri, location.href);
        if (url.hostname === "tile.googleapis.com" && !url.searchParams.has("key")) {
          url.searchParams.set("key", apiKey);
        }
        return url.toString();
      },
    });

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

      // Invert the east-north-up frame so the chosen lat/lon lands on the
      // origin with up pointing along +Y.
      //
      // No rescaling: the scene is already in metres — the flight path is about
      // 450 units long, i.e. 450 m — so the city goes in at 1:1. An earlier
      // version shrank it, which pushed the geometry hundreds of thousands of
      // units out and straight through the camera's far plane, so the tiles
      // loaded and were never visible.
      tiles.group.matrix.copy(matrix).invert();
      tiles.group.matrix.decompose(
        tiles.group.position,
        tiles.group.quaternion,
        tiles.group.scale,
      );
      tiles.group.updateMatrixWorld(true);
      void position;
    };

    tiles.addEventListener("load-tileset", onLoad);
    // Only a failure to load the root tileset is fatal. Individual tiles fail
    // routinely while streaming, and latching on those blanked the city.
    tiles.addEventListener("load-error", (event: unknown) => {
      if ((event as { tile?: unknown })?.tile == null) setFailed(true);
    });

    group.current.add(tiles.group);
    const owner = group.current;
    return () => {
      tiles.removeEventListener("load-tileset", onLoad);
      owner.remove(tiles.group);
      tiles.dispose();
    };
  }, [tiles]);

  const frames = useRef(0);

  useFrame(() => {
    frames.current += 1;
    const w = window as unknown as Record<string, unknown>;

    if (!tiles || failed) {
      w.__cityProbe = { state: "idle", hasKey: Boolean(apiKey), failed, frames: frames.current };
      return;
    }

    // A throw in here would silently kill this frame callback every frame, so
    // the error is captured rather than allowed to disappear.
    try {
      tiles.setCamera(camera);
      tiles.setResolutionFromRenderer(camera, gl);
      camera.updateMatrixWorld();
      tiles.update();

      w.__cityProbe = {
        state: "updating",
        frames: frames.current,
        parented: Boolean(tiles.group.parent),
        rootURL: (tiles as unknown as { rootURL?: string }).rootURL ?? null,
        tileChildren: tiles.group.children.length,
      };
    } catch (err) {
      w.__cityProbe = { state: "threw", message: String(err).slice(0, 300), frames: frames.current };
    }
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
