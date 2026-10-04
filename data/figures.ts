import type { Aircraft } from "./types";

/**
 * Engineering figures taken from the team's own CAD and design reports.
 *
 * These are real drawings, not illustrations. Each carries the report section
 * it came from so a reader can go and check it. Add more by dropping a file in
 * /public/engineering/<aircraft>/ and adding a row here.
 */

export interface Figure {
  src: string;
  /** What the drawing shows, in one line. */
  caption: string;
  /** Design report section, e.g. "3.1.1". */
  section: string;
  /** Which part of the aircraft this belongs to. */
  group: "wing" | "fuselage" | "landing-gear" | "avionics" | "aero";
  aircraft: Aircraft["slug"];
  /** Wide drawings (side profiles, planforms) earn a full-width slot. */
  wide?: boolean;
}

export const figures: Figure[] = [
  {
    src: "/engineering/vajra/aircraft-side-profile.png",
    caption:
      "Side profile: the pod-and-boom layout, tractor propeller, dual tandem gear and swept vertical tail.",
    section: "3.1.3",
    group: "fuselage",
    aircraft: "vajra",
    wide: true,
  },
  {
    src: "/engineering/vajra/wing-planform.png",
    caption:
      "Wing planform. A rectangular centre section sits in the propwash; the outboard panels taper to reduce induced drag, built around a single hollow spar.",
    section: "3.1.1",
    group: "wing",
    aircraft: "vajra",
    wide: true,
  },
  {
    src: "/engineering/vajra/airfoil-ah79-100b.png",
    caption: "AH 79-100B section, selected on lift capability, efficiency and stall behaviour.",
    section: "3.1.1",
    group: "aero",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/flaps.png",
    caption: "Flaps, placed in the mid section where the propwash is strongest.",
    section: "3.1.1",
    group: "wing",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/aileron.png",
    caption: "Aileron and servo installation on the outboard panel.",
    section: "3.1.1",
    group: "wing",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/winglet.png",
    caption: "Wingtip winglet, carried on the taper to limit tip losses.",
    section: "3.1.1",
    group: "wing",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/fuselage-truss.png",
    caption:
      "Fuselage truss. Lightening cut-outs in every rib and former — the whole pod is the cargo bay.",
    section: "3.1.2",
    group: "fuselage",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/fuselage-structure.png",
    caption: "Fuselage structure, showing the bay and the joint to the boom.",
    section: "3.1.2",
    group: "fuselage",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/fuselage-shape.png",
    caption: "Fuselage shaping, refined toward a compact streamlined boom.",
    section: "3.1.3",
    group: "fuselage",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/avionics-bay.png",
    caption:
      "Avionics bay: a hatched opening in the mid-wing section securing the electronics with access for servicing.",
    section: "3.1.3",
    group: "avionics",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/main-landing-gear.png",
    caption: "Main landing gear development, part of the dual tandem arrangement.",
    section: "3.1.2",
    group: "landing-gear",
    aircraft: "vajra",
  },
  {
    src: "/engineering/vajra/nose-landing-gear.png",
    caption: "Nose landing gear assembly.",
    section: "3.1.2",
    group: "landing-gear",
    aircraft: "vajra",
  },
];

export function figuresFor(aircraft: Aircraft["slug"]): Figure[] {
  return figures.filter((f) => f.aircraft === aircraft);
}

export const GROUP_LABEL: Record<Figure["group"], string> = {
  wing: "Wing",
  fuselage: "Fuselage",
  "landing-gear": "Landing gear",
  avionics: "Avionics",
  aero: "Aerodynamics",
};
