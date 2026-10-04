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
