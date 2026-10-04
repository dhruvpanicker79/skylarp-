/**
 * Shared content types.
 *
 * The important one is `ValueKind`. A number printed on this site must say
 * where it came from: a figure in a Technical Design Report is a *design* or
 * *calculated* value, not something the aircraft was observed to do. Keeping
 * that on the type means a spec cannot be added without answering the question.
 */

export type ValueKind =
  | "design" // specified/target value from the design report
  | "calculated" // derived analytically or in simulation
  | "measured" // observed on the bench, in a tunnel, or on a test stand
  | "recorded" // observed in flight
  | "projected"; // a forecast, e.g. expected competition score

export const VALUE_KIND_LABEL: Record<ValueKind, string> = {
  design: "Design",
  calculated: "Calculated",
  measured: "Measured",
  recorded: "Recorded in flight",
  projected: "Projected",
};

export interface Spec {
  label: string;
  /** `null` renders the [ADD DATA] placeholder rather than inventing a number. */
  value: string | null;
  kind: ValueKind;
  /** Short clarifier shown beneath the value, e.g. "4 full + 2 empty bottles". */
  note?: string;
  /** Where it came from, e.g. "Vajra TDR 2026". Shown on hover/focus. */
  source?: string;
}

export type AircraftClass = "Regular" | "Micro" | "Advanced";

export interface Aircraft {
  slug: "vajra" | "tejas" | "garuda";
  name: string;
  className: AircraftClass;
  year: number;
  /** One line on what the aircraft has to do to score. */
  mission: string;
  /** Two or three sentences, factual, from the design report. */
  summary: string;
  /** Path under /public. Replace the file to replace the aircraft — no code change. */
  model: string;
  /** True until a real CAD export has been dropped in. Drives the placeholder notice. */
  modelIsPlaceholder: boolean;
  specs: Spec[];
  /** Engineering decisions worth showing, each tied to a real figure or result. */
  highlights: Highlight[];
}

export interface Highlight {
  title: string;
  body: string;
  /** A real result, where the report states one. */
  metric?: { value: string; label: string; kind: ValueKind };
  source?: string;
}

export interface FlightLogEntry {
  id: string;
  date: string; // ISO
  aircraft: Aircraft["slug"];
  testNumber: string;
  changed: string;
  why: string;
  happened: string;
  broke: string | null;
  learned: string;
  next: string;
  result: string;
  /** The number that proves the result, if one was recorded. */
  evidence?: { value: string; label: string; kind: ValueKind };
}

export interface Achievement {
  year: number;
  className: AircraftClass;
  category: string; // "Design Report", "Oral Presentation", "Overall"
  place: number;
  scope?: string; // e.g. "Worldwide"
}
