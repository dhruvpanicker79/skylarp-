# Google Photorealistic 3D Tiles — current state

The integration is written and compiles. It is **switched off** behind a `false`
flag in two places until the problem below is solved:

- `components/3d/FlightEnvironment.tsx` — the `<GoogleCity />` element
- `components/FlightHome.tsx` — the `<GoogleCityAttribution />` element

Turn both back on by replacing `{false ? … : null}` with the element.

## The problem

`3d-tiles-renderer`'s `GoogleCloudAuthPlugin` gets **HTTP 403** from
`https://tile.googleapis.com/v1/3dtiles/root.json`.

What has been ruled out:

| Check | Result |
|---|---|
| Key valid, Map Tiles API enabled, billing on | ✅ server-side request returns 200 |
| Referrer restriction blocking localhost | ✅ fixed — request with `Referer: http://localhost:3100/` returns 200 |
| Key reaching the client bundle | ✅ confirmed (attribution rendered, which is gated on it) |
| Same URL fetched from inside the page | ✅ **returns 200** |

So: a plain `fetch()` of the exact URL from the running page succeeds, while the
library's own request for the same URL fails with 403. The difference is in how
the plugin builds the request, not in the key or the Google project.

## Where to look next

1. Intercept `window.fetch` **before** the tiles renderer mounts (the plugin
   requests the root tileset from its constructor, not from the React effect),
   and log the exact URL, method and headers it sends. The earlier attempt
   installed the interceptor too late to catch it.
2. Check whether the installed plugin version authenticates with a
   `X-GOOG-API-KEY` header rather than `?key=`, and whether Google rejects
   header auth for browser-origin API keys.
3. Compare against the library's own Google tiles example for v0.5.3; the
   plugin options changed across releases (`apiToken` vs `apiKey`).
4. Consider the session flow: Photorealistic 3D Tiles issues a `session`
   parameter from the root tileset that every child tile request must carry.

## Known API differences in v0.5.3

Two were already fixed and are worth remembering:

- `errorThreshold` does not exist on `TilesRenderer`.
- `ellipsoid.getEastNorthUpFrame(lat, lon, height, target)` takes **four**
  arguments; an older signature took three.

## Update — narrowed further

The 403s in the console were **stale entries**, replayed from earlier page
loads. With a fetch interceptor installed at module load (so it catches the
renderer's very first request), a fresh page makes **zero** requests to
googleapis — nothing is being asked for at all.

So the problem is not authentication. `tiles.update()` is running from
`useFrame`, but the renderer never issues the root request. Next things to
check:

1. Whether `apiKey` is actually truthy inside `GoogleCity` — `.env.local` is
   loaded by Next and the var is `NEXT_PUBLIC_`, so it should be inlined, but
   this has not been proven at the component itself. Probe it directly.
2. Whether `tiles.group` ever gets added to the scene: the effect early-returns
   on `!group.current`, and if the component rendered `null` first (because
   `failed` latched true from an earlier error) the ref never attaches and the
   tileset is never parented.
3. `failed` latches permanently once set and never resets — a single transient
   error kills the city for the whole session. It should reset when the key or
   the component changes.
4. `setCamera()` is called every frame; confirm that is idempotent in v0.5.3
   rather than re-registering and resetting internal state each frame.

## Update 2 — authentication SOLVED, rendering still open

Two real bugs were found and fixed. Tiles now authenticate and download
successfully (verified: 36 requests, all carrying `key`, all 200).

**Bug 1 — wrong event name.** The code listened for `load-tile-set`; the
library dispatches `load-tileset`. The positioning handler therefore never ran.

**Bug 2 — unsigned tile requests.** `GoogleCloudAuthPlugin` signs the root
tileset request but not the child tile requests discovered from it. Those went
out with only `session` and Google returned 403 to every one. Proven directly in
the browser: the same tile URL gives 403 without `key` and 200 with it.
Neither removing the competing `TileCompressionPlugin` nor a `preprocessURL`
plugin reached those requests, so the key is now added in a narrow `window.fetch`
wrapper at the top of `GoogleCity.tsx`, scoped to `tile.googleapis.com` URLs
that lack one. Revisit on upgrade.

**Still open: the tiles download but never appear.** `tiles.group` is parented
to the scene and `update()` runs every frame, but `tiles.group.children` stays
at 0 and nothing renders.

The remaining problem is the transform. Google's tiles are in earth-centred,
earth-fixed coordinates — millions of metres from the origin — and have to be
rotated and translated so the chosen lat/lon sits at the scene origin. Attempted:
inverting the east-north-up frame and decomposing it onto `tiles.group`, both
at 1:26 scale (geometry ended up past the camera far plane) and at 1:1 with the
far plane raised to 24000 (still nothing visible).

Next steps:

1. Log `tiles.group.matrixWorld` and the world position of the first loaded tile
   to find out where the geometry actually is. Everything so far has been
   inferred rather than measured.
2. Check whether loaded tiles are parented somewhere other than
   `tiles.group.children` in v0.5.3 — the count may simply be looking in the
   wrong place while the geometry is fine.
3. Compare against the library's official Google example for this version
   rather than reasoning about the transform from first principles.
4. Consider the `GlobeControls` / `ReorientationPlugin` helpers, which exist
   precisely to put a lat/lon at the origin — doing it by hand may be
   unnecessary.
