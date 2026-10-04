import type { Aircraft } from "./types";

/**
 * Team, quotes and alumni.
 *
 * The 2026 Technical Design Reports describe a 47-member team organised around
 * aerodynamics, structures & stability, avionics and marketing, with dedicated
 * Design Report and FDRR sub-teams. That structure is below and is real.
 *
 * The roster itself is NOT. `members`, `quotes` and `alumni` are deliberately
 * empty: inventing people, their branches or what they said would be the worst
 * kind of filler on a site like this. Add real entries and every team view
 * fills in automatically.
 */

export interface Department {
  slug: string;
  name: string;
  /** What this sub-team owns. */
  remit: string;
}

export interface Member {
  name: string;
  role: string;
  /** Year of study, e.g. "TY" or "3rd". */
  year: string;
  branch: string;
  department: Department["slug"];
  /** Path under /public/team. Omit when there is no portrait — never generate one. */
  photo?: string;
  currentProject?: string;
}

export interface Quote {
  text: string;
  name: string;
  role: string;
  year: string;
}

export interface Alumnus {
  name: string;
  batch: string;
  /** Current role, company or university. */
  destination: string;
}

/** Sub-teams as described in the 2026 reports. */
export const departments: Department[] = [
  { slug: "aerodynamics", name: "Aerodynamics", remit: "Planform, airfoil selection, CFD and performance." },
  { slug: "structures", name: "Structures & Stability", remit: "Spars, airframe, FEA and stability analysis." },
  { slug: "avionics", name: "Avionics", remit: "Flight controllers, telemetry, wiring and control linkages." },
  { slug: "payload", name: "Payload", remit: "Cargo systems, containment and CG management." },
  { slug: "manufacturing", name: "Manufacturing", remit: "Layup, printing, assembly and field repair." },
  { slug: "design-report", name: "Design Report", remit: "The written submission the competition scores." },
  { slug: "fdrr", name: "FDRR", remit: "Flight demonstration and readiness review." },
  { slug: "marketing", name: "Marketing", remit: "Sponsorship, outreach and media." },
];

/** Add real members here. Empty until the team supplies the roster. */
export const members: Member[] = [];

/**
 * Three to five genuine quotes. The brief is explicit that these must be real
 * and specific — what surprised someone, what a test taught them — not
 * motivational filler.
 */
export const quotes: Quote[] = [];

/** Add real alumni destinations only. */
export const alumni: Alumnus[] = [];

export function membersOf(department: string): Member[] {
  return members.filter((m) => m.department === department);
}

/** Team size as stated in the 2026 Technical Design Reports. */
export const TEAM_SIZE = 47;

/**
 * Flight log entries.
 *
 * Empty by design. A flight log is the one part of this site that cannot be
 * written from a design report — it records what actually happened on a given
 * day, what broke and what changed because of it. Invented entries would
 * destroy the credibility of the whole section.
 */
export interface FlightLogEntry {
  id: string;
  date: string;
  aircraft: Aircraft["slug"];
  testNumber: string;
  changed: string;
  why: string;
  happened: string;
  broke: string | null;
  learned: string;
  next: string;
  result: string;
  evidence?: { value: string; label: string };
}

export const flightLog: FlightLogEntry[] = [];
