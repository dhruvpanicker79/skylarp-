# DJS Skylark — website

The homepage is one continuous flight. Scrolling flies Vajra down a runway, into
the air and through the engineering story, with content windows opening along
the way. Inner pages are conventional and practical.

This file assumes no web development experience. Everything you need to run,
edit and publish the site is here.

---

## 1. Running it on your computer

Node.js is **not** installed system-wide on this machine, because the Windows
installer needs an administrator prompt. Instead it lives as a portable copy at:

```
C:\Users\nairb\AppData\Local\skylark-tools\node-v22.20.0-win-x64
```

Open **PowerShell**, then paste these two lines. The first makes Node available
for that window only; the second starts the site.

```bash
$env:Path = "$env:LOCALAPPDATA\skylark-tools\node-v22.20.0-win-x64;$env:Path"
npm run dev
```

Then open <http://localhost:3000> in a browser. The first page takes about
20 seconds to appear; after that it is instant. Leave the window open while you
work — edit a file, save, and the browser updates itself.

Press `Ctrl+C` in that window to stop it.

### Why the extra first line

Windows **Smart App Control** is switched on, and it blocks Next.js's fast
compiler (`next-swc...node`). Next.js falls back to a slower WebAssembly
compiler automatically, so everything works — you will just see a warning like
*"An Application Control policy has blocked this file"* every time it compiles.
**That warning is expected and harmless.** It does not appear when the site is
built on Vercel, which uses Linux.

Two consequences worth knowing:

- `npm run dev` is fine (~20s to start, instant afterwards).
- `npm run build` is slow locally (several minutes). You rarely need it — Vercel
  does the build when you deploy.

---

## 2. Where everything lives

```
app/                      One folder per page
  page.tsx                  The homepage (the flight)
  aircraft/ sae/ ...        Inner pages
components/
  3d/                       The flight scene
    FlightScene.tsx           Sets up the 3D canvas
    FlightRig.tsx             Moves the aircraft and the camera
    FlightEnvironment.tsx     Ground, runway, lighting
    AircraftModel.tsx         Loads your .glb files
    AircraftPlaceholder.tsx   The stand-in used until CAD arrives
  content/                  Panels and page sections
  navigation/               The navbar
  ui/                       Specs, placeholders
data/                     ← YOU WILL EDIT THESE MOST
  aircraft.ts               The three aircraft and their specifications
  achievements.ts           Competition results
  flight.ts                 The flight path and where panels appear
  types.ts                  Shared definitions
lib/                      Scroll handling and device capability
public/                   ← YOU WILL DROP FILES HERE
  models/                   Aircraft .glb files
  aircraft/ team/ ...       Images
styles/globals.css        Colours, type, shared styles
```

---

## 3. Adding your own content

### Aircraft CAD models

Export from SolidWorks as **.glb** (GLB, ideally Draco-compressed, under ~5 MB),
then save as:

```
public/models/vajra.glb
public/models/tejas.glb
public/models/garuda.glb
```

Then open `data/aircraft.ts` and change that aircraft's line from:

```ts
modelIsPlaceholder: true,
```

to:

```ts
modelIsPlaceholder: false,
```

**That is the whole job.** The model is measured and rescaled automatically to
the right wingspan and centred, so the camera, flight path and lighting keep
working. You do not need to change any 3D code.

### Aircraft specifications

`data/aircraft.ts`. Each value carries a `kind`, and this matters:

| `kind` | Means |
|---|---|
| `design` | A target from the design report |
| `calculated` | Worked out analytically or in simulation |
| `measured` | Observed on a bench, tunnel or test stand |
| `recorded` | Observed in actual flight |
| `projected` | A forecast |

A design payload is **not** a payload the aircraft was recorded carrying. The
site displays the kind next to the value so a judge or sponsor can tell them
apart. Please keep that honest — it is one of the strongest things about the
site.

Leave `value: null` for anything you do not have. It renders as `[ADD DATA]`
rather than a made-up number.

### Images

Drop files into the matching folder under `public/` (`team/`, `events/`,
`engineering/`, `flight-log/`, `sponsors/`, `media/`). Reference them from a
data file as `/team/name.jpg` — the path always starts at `public`.

### Sponsor logos

`public/sponsors/`, as **SVG** or **transparent PNG**. Use the real logo files
from the sponsor; do not recreate them.

### Competition results

`data/achievements.ts`. Once you have confirmed the 2026 results are final
rather than projected, empty the `UNVERIFIED_YEARS` list to remove the
"Unconfirmed" marker.

### Team, flight log, quotes, alumni

These pages exist and explain what they need, but the data files are not written
yet — see *What is not built* below.

### Changing navigation links

`components/navigation/Navbar.tsx`, the `LINKS` list at the top.

### Tuning the flight

`data/flight.ts`:

- `FLIGHT_PATH` — the 3D route the aircraft flies.
- `FLIGHT_SCENES` — where each panel appears along the scroll (`at`) and how
  long it stays (`span`).
- `CAMERA_RIG` — how far behind and above the aircraft the camera rides.
- `FLIGHT_SCROLL_VH` — total page length; larger means a slower flight.

One rule: neighbouring scenes must not overlap, or two panels become readable at
once and the text collides. Keep `span[i] + span[i+1]` smaller than the gap
between their `at` values.

---

## 4. Publishing it

Vercel is free for this and builds the site properly (no Smart App Control
there, so it uses the fast compiler).

1. Put the project on GitHub.
2. Go to <https://vercel.com>, sign in with GitHub, click **Add New → Project**.
3. Pick the repository. Vercel detects Next.js by itself — change nothing.
4. Click **Deploy**.

There are **no environment variables** and no database. Every later push to
GitHub redeploys automatically.

---

## 5. What is real, and what is a placeholder

**Real, drawn from your three 2026 Technical Design Reports:** all aircraft
specifications, and the engineering highlights — the H-tail's +27.4% yawing
moment and 13.46% tail weight saving, the −16.23% drag reduction, the 4.81% wing
stiffness gain across three wing prototypes, the Cobra C-4120/12 850 KV and
Gemfan 12×7×3 selection, Tejas's score-sensitivity bounds and 3.91% thrust
prediction accuracy, Garuda's tether testing at Aamby Valley.

**Placeholder, waiting on you:**

| Shows as | Needs |
|---|---|
| The schematic aircraft | `vajra.glb`, `tejas.glb`, `garuda.glb` |
| `[ADD DATA]` on some specs | Measured values: best recorded payload, test flight count, Garuda endurance and drop accuracy, Tejas assembly time |
| `[ADD FLIGHT LOG]` | Real test entries |
| Team / Media / Sponsors / SAE / Join pages | Listed on each page |
| "Unconfirmed" on 2026 results | Confirmation these are final, not projected |

The aircraft you currently see is **deliberately schematic** — flat panels with
visible edges. It is correct in layout and proportion (twin fuselage, high wing,
H-tail, 120 in span) but obviously a stand-in, so nobody mistakes it for the
real Vajra.

## 6. Performance and devices

The site chooses one of three levels by itself:

- **Full** — desktop: the complete flight, shadows, full resolution.
- **Reduced** — phones and tablets: same flight, no shadows, lower resolution,
  gentler camera.
- **Static** — if the visitor has "reduce motion" switched on, or the device is
  too weak, or WebGL is unavailable: no 3D at all. An ordinary, complete,
  scrollable page with the same content.

Resolution drops before frame rate does. The static version is also rendered
invisibly behind the flight so search engines and screen readers get a real
document.

---

## 7. Still needed from you

1. **Which proposal is authoritative** — your brief names "DJS Skylark
   Proposal", but the VYŪHA brochure was attached, and Downloads holds three
   differently-named proposal files.
2. **Whether the 2026 competition results are final or projected.**
3. The CAD exports, roster, flight log entries, quotes, alumni, sponsor logos
   and photographs listed above.
