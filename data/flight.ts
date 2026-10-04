/**
 * The homepage flight.
 *
 * Scroll progress (0 → 1) drives one continuous flight. The aircraft follows a
 * 3D spline; the camera follows the aircraft. Content panels are anchored to
 * progress ranges along that path, alternating sides so the aircraft and the
 * panel compose against each other rather than overlapping.
 *
 * Tuning: the `at` values are the starting points from the brief. Adjust them
 * here — no component reads a hard-coded progress number.
 */

export type PanelSide = "left" | "right" | "center";

export interface FlightScene {
  id: string;
  /** Scroll progress where this scene is fully present. */
  at: number;
  /** How wide a band of scroll the panel stays legible for. */
  span: number;
  label: string;
  side: PanelSide;
  /** Panel weight: how much of the viewport it is allowed to take. */
  size: "sm" | "md" | "lg";
}

/**
 * Scene bands must not overlap, or two panels are legible at once and the text
 * collides. A panel is fully gone at `at ± span`, so for any neighbouring pair
 * `span[i] + span[i+1]` has to stay below the gap between their `at` values.
 * The spacing below leaves roughly a third of each gap as clear air.
 */
export const FLIGHT_SCENES: FlightScene[] = [
  { id: "start", at: 0.0, span: 0.055, label: "Start", side: "center", size: "md" },
  { id: "takeoff", at: 0.12, span: 0.04, label: "Takeoff", side: "center", size: "sm" },
  { id: "climb", at: 0.22, span: 0.042, label: "Climb", side: "right", size: "sm" },
  { id: "about", at: 0.33, span: 0.045, label: "About", side: "left", size: "lg" },
  { id: "achievements", at: 0.44, span: 0.045, label: "Achievements", side: "right", size: "lg" },
  { id: "fleet", at: 0.55, span: 0.045, label: "Aircraft", side: "right", size: "lg" },
  { id: "engineering", at: 0.66, span: 0.042, label: "Engineering", side: "left", size: "md" },
  { id: "flight-log", at: 0.755, span: 0.04, label: "Flight log", side: "right", size: "md" },
  { id: "team", at: 0.84, span: 0.038, label: "Team", side: "left", size: "md" },
  { id: "sponsors", at: 0.915, span: 0.032, label: "Partners", side: "right", size: "sm" },
  { id: "join", at: 0.985, span: 0.045, label: "Join", side: "left", size: "lg" },
];

/**
 * Control points for the flight path, in world units (metres-ish).
 *
 * +X is right, +Y is up, −Z is away from the opening camera. The aircraft
 * starts near the camera facing away down the runway, climbs out, banks left
 * then right through the content sections, and descends to land.
 *
 * These are fed to a Catmull-Rom curve, so the aircraft eases through them
 * rather than running between them in straight lines.
 */
export const FLIGHT_PATH: [number, number, number][] = [
  [0, 0.0, 6], // on the ground, close to camera
  [0, 0.0, -14], // ground roll
  [0, 1.2, -34], // rotation
  [0, 7, -58], // initial climb
  [-3, 14, -86], // climb out, drifting left
  [-16, 19, -116], // bank left  → About panel opens right of frame
  [-6, 21, -150], // levelling
  [18, 22, -184], // bank right → Achievements
  [24, 23, -220], // Aircraft / fleet
  [6, 24, -256], // Engineering
  [-18, 23, -292], // Flight log
  [-10, 21, -326], // Team
  [4, 16, -360], // descent begins, Sponsors
  [2, 7, -392], // final approach
  [0, 0.6, -418], // flare
  [0, 0.0, -440], // rollout
];

/** Bank angle in radians at each control point, interpolated along the path. */
export const FLIGHT_BANK: number[] = [
  0, 0, 0, -0.04, -0.12, -0.42, -0.1, 0.44, 0.28, -0.18, -0.38, 0.06, 0.3, 0.1, 0, 0,
];

/**
 * How far behind and above the aircraft the camera rides, by progress.
 * It starts close behind on the ground and eases back once airborne so the
 * aircraft reads as travelling away without shrinking to nothing.
 */
export const CAMERA_RIG = {
  // The aircraft is the protagonist: it recedes as it accelerates away, but it
  // must never shrink to a speck. These distances keep it reading as a solid
  // object at every phase.
  distance: { ground: 7.5, cruise: 10.5, landing: 9 },
  height: { ground: 1.5, cruise: 2.6, landing: 2 },
  /** How much the camera adopts the aircraft's bank. 0 = level, 1 = locked. */
  bankFollow: 0.35,
  /** Seconds of lag, so the camera trails rather than being welded on. */
  lag: 0.45,
};

/** Total scroll length of the homepage, in viewport heights. */
export const FLIGHT_SCROLL_VH = 900;
