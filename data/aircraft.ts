import type { Aircraft } from "./types";

/**
 * The 2026 fleet.
 *
 * Every value here is traceable to a Technical Design Report. Where a report
 * states a design or calculated figure, it is labelled as such — none of these
 * are flight-recorded results unless marked `recorded`. Values the reports do
 * not provide are `null`, which renders as [ADD DATA].
 *
 * To update: edit this file. To replace an aircraft model: drop a new .glb at
 * the `model` path and set `modelIsPlaceholder` to false.
 */

export const aircraft: Aircraft[] = [
  {
    slug: "vajra",
    name: "Vajra",
    className: "Regular",
    year: 2026,
    mission:
      "Carry the heaviest payload the airframe can lift, inside a fuselage that doubles as the cargo bay.",
    summary:
      "A twin-fuselage Regular Class aircraft built around a single hollow aluminium main spar. The whole fuselage is the cargo bay, carrying filled and empty bottles to an 18 lb design payload, with an H-tail chosen for yaw authority under crosswind and asymmetric thrust.",
    model: "/models/vajra.glb",
    modelIsPlaceholder: true,
    specs: [
      { label: "Wingspan", value: "120 in", kind: "design", source: "Vajra TDR 2026" },
      { label: "Empty weight", value: "15.432 lb", kind: "design", source: "Vajra TDR 2026" },
      { label: "All-up weight", value: "33.432 lb", kind: "design", source: "Vajra TDR 2026" },
      { label: "Wing area", value: "2466 in²", kind: "design", source: "Vajra TDR 2026" },
      { label: "Aspect ratio", value: "5.88", kind: "design", source: "Vajra TDR 2026" },
      { label: "Airfoil", value: "AH 79-100B", kind: "design", source: "Vajra TDR 2026" },
      { label: "Fuselage", value: "Twin semi-monocoque", kind: "design", source: "Vajra TDR 2026" },
      { label: "Tail", value: "H-tail", kind: "design", source: "Vajra TDR 2026" },
      { label: "TMA", value: "55.21 in", kind: "design", source: "Vajra TDR 2026" },
      { label: "MAC", value: "20.64 in", kind: "design", source: "Vajra TDR 2026" },
      {
        label: "Design payload",
        value: "18 lb",
        kind: "design",
        note: "4 full bottles + 2 empty bottles",
        source: "Vajra TDR 2026",
      },
      // The reports do not state a flight-recorded best payload. Left blank
      // deliberately: a design payload is not an achieved one.
      { label: "Best recorded payload", value: null, kind: "recorded" },
      { label: "Test flights", value: null, kind: "recorded" },
    ],
    highlights: [
      {
        title: "The H-tail was chosen for yaw, and paid for itself in weight",
        body:
          "Flat-plate vertical surfaces mounted at the outboard ends of the horizontal tail cut tail weight against a conventional empennage, while increasing available yawing moment — the margin that matters in crosswind and under asymmetric thrust. Sizing used a tail volume coefficient of 0.06 with crosswind analysis for Fort Worth.",
        metric: { value: "+27.4%", label: "yawing moment vs conventional tail", kind: "calculated" },
        source: "Vajra TDR 2026",
      },
      {
        title: "Three wings were built before one was flown",
        body:
          "The wing uses a single hollow square aluminium dowel as the main spar with a hollow round dowel resisting torsion. Three successive prototypes were built and tested across a range of wind speeds, with deflection and dynamic response measured by gyro modules mounted at the wingtips.",
        metric: { value: "+4.81%", label: "wing stiffness, final iteration", kind: "measured" },
        source: "Vajra TDR 2026",
      },
      {
        title: "Ten thousand configurations, narrowed to one",
        body:
          "A constraint-led sweep reduced a design space of over 10,000 configurations to roughly 500 viable ones. The top-scoring 10% at each span went to higher-fidelity CFD, with ANSYS Mechanical for structural FEA and MATLAB's Tornado VLM solver for stability analysis.",
        metric: { value: "−16.23%", label: "drag after refinement", kind: "calculated" },
        source: "Vajra TDR 2026",
      },
      {
        title: "Propulsion was sized by simulating the whole flight round",
        body:
          "The propulsion system was selected by simulating an entire competition round with a factor of safety of 1.38 to cover wind gusts, with battery efficiency constrained to 80% and throttle varied across flight phases. That led to a Cobra C-4120/12 850 KV motor paired with a Gemfan 12×7×3 triblade propeller.",
        source: "Vajra TDR 2026",
      },
    ],
  },

  {
    slug: "tejas",
    name: "Tejas",
    className: "Micro",
    year: 2026,
    mission:
      "Pack into a container, assemble fast, and lift the most water the lightest possible airframe can carry.",
    summary:
      "A tailless diamond cropped delta with a flat-plate section and 67° sweep. Micro Class scoring punishes empty weight sharply, so the airframe was driven down to 2.21 lb while carrying a payload fraction that a conventional planform could not match.",
    model: "/models/tejas.glb",
    modelIsPlaceholder: true,
    specs: [
      { label: "Wingspan", value: "33.6 in", kind: "design", source: "Tejas TDR 2026" },
      { label: "Empty weight", value: "2.21 lb", kind: "design", source: "Tejas TDR 2026" },
      { label: "All-up weight", value: "6.18 lb", kind: "design", source: "Tejas TDR 2026" },
      { label: "Wing area", value: "976.51 in²", kind: "design", source: "Tejas TDR 2026" },
      { label: "Aspect ratio", value: "1.156", kind: "design", source: "Tejas TDR 2026" },
      { label: "Airfoil", value: "Flat plate", kind: "design", source: "Tejas TDR 2026" },
      { label: "Planform", value: "Diamond cropped delta", kind: "design", source: "Tejas TDR 2026" },
      { label: "Sweep", value: "67°", kind: "design", source: "Tejas TDR 2026" },
      { label: "Vertical tail", value: "60°", kind: "design", source: "Tejas TDR 2026" },
      { label: "Tail", value: "Tailless", kind: "design", source: "Tejas TDR 2026" },
      { label: "Container volume", value: "70.16 fl oz", kind: "design", source: "Tejas TDR 2026" },
      { label: "Design payload", value: "3.97 lb", kind: "design", source: "Tejas TDR 2026" },
      {
        label: "Takeoff distance",
        value: "< 10 ft",
        kind: "design",
        note: "As stated in the design report",
        source: "Tejas TDR 2026",
      },
      { label: "Assembly time", value: null, kind: "measured" },
      { label: "Best recorded payload", value: null, kind: "recorded" },
    ],
    highlights: [
      {
        title: "The scoring curve decided the airframe before aerodynamics did",
        body:
          "Score sensitivity to empty weight steepens as the aircraft gets heavier — from roughly −4 points/lb at 2.0 lb to worse than −10 points/lb beyond about 2.8 lb. That bounded empty weight to 2.0–2.8 lb and wingspan to 1.5–3 ft before any planform was drawn, giving a feasible region with predictable competition performance.",
        source: "Tejas TDR 2026",
      },
      {
        title: "Conventional and biplane were built, tested, and eliminated",
        body:
          "Conventional, biplane and delta configurations were each taken to flight test, five flights apiece at the derived payload. The conventional layout was eliminated for lower scores and longer takeoff distances; the biplanes carried competitive payload but added structural complexity, empty weight and crosswind sensitivity. The delta survived.",
        source: "Tejas TDR 2026",
      },
      {
        title: "Predicted thrust was checked against a thrust stand",
        body:
          "Dynamic thrust predictions were validated empirically rather than assumed. Across the tested range, predicted and experimental results agreed to a median deviation of 3.91% — which is why the propulsion figures in this report are treated as calculated values with known error, not as guesses.",
        metric: { value: "3.91%", label: "median deviation, predicted vs experimental", kind: "measured" },
        source: "Tejas TDR 2026",
      },
      {
        title: "Water moves, so the container was designed against slosh",
        body:
          "Cuboidal and cylindrical containers were evaluated empirically for slosh reduction, empty weight and fill-and-flow. The cylindrical container was eliminated across all configurations on empty weight; the symmetric delta achieved the best slosh reduction but was itself eliminated for being heavier.",
        source: "Tejas TDR 2026",
      },
    ],
  },

  {
    slug: "garuda",
    name: "Garuda",
    className: "Advanced",
    year: 2026,
    mission:
      "Take off vertically, transition to wing-borne flight, and deliver a payload to a target.",
    summary:
      "A hybrid VTOL with wing-mounted twin tilt rotors and a rear rotor, built around a half-fuselage and half-boom layout with an inverted T-tail. Hover and transition stability were proven on a tether before any untethered flight was attempted.",
    model: "/models/garuda.glb",
    modelIsPlaceholder: true,
    specs: [
      { label: "Wingspan", value: "40 in", kind: "design", source: "Garuda TDR 2026" },
      { label: "Empty weight", value: "2.5 lb", kind: "design", source: "Garuda TDR 2026" },
      { label: "Wing area", value: "320 in²", kind: "design", source: "Garuda TDR 2026" },
      { label: "Aspect ratio", value: "5.0", kind: "design", source: "Garuda TDR 2026" },
      { label: "Airfoil", value: "NACA 6409", kind: "design", source: "Garuda TDR 2026" },
      { label: "Fuselage", value: "Half fuselage + half boom", kind: "design", source: "Garuda TDR 2026" },
      { label: "Tail", value: "Inverted T-tail", kind: "design", source: "Garuda TDR 2026" },
      { label: "Configuration", value: "Hybrid VTOL", kind: "design", source: "Garuda TDR 2026" },
      { label: "TMA", value: "24.02 in", kind: "design", source: "Garuda TDR 2026" },
      {
        label: "Rotors",
        value: "Twin wing-mounted tilt + rear",
        kind: "design",
        source: "Garuda TDR 2026",
      },
      // The report documents the test programme but states no endurance or drop
      // accuracy figure. These stay empty until the team supplies measurements.
      { label: "Endurance", value: null, kind: "recorded" },
      { label: "Drop accuracy", value: null, kind: "recorded" },
      { label: "Best recorded payload", value: null, kind: "recorded" },
    ],
    highlights: [
      {
        title: "Nothing flew free until it had flown on a tether",
        body:
          "Hover and transition stability were established under tether before untethered flight. Flight testing was carried out at Aamby Valley instrumented with GPS, accelerometers, pitot tubes and altimeters, so transition behaviour was recorded rather than judged by eye.",
        source: "Garuda TDR 2026",
      },
      {
        title: "Tilt angle was tested, not assumed",
        body:
          "To assess tilt angle effects, motors were mounted on a tilting mechanism controlled through ArduPilot, with parameters tuned to vary tilt precisely during testing, and a mesh used to condition the flow. The transition is the hardest part of a hybrid VTOL, and it was characterised on the stand first.",
        source: "Garuda TDR 2026",
      },
      {
        title: "Autonomy was a trade, not a feature",
        body:
          "The report works through autonomous and manual mission trade-offs against flight controller and firmware compatibility, rather than treating autonomy as free. The payload mechanism, telemetry and propulsion were each tested as separate systems before the full mission profile was attempted.",
        source: "Garuda TDR 2026",
      },
    ],
  },
];

export const aircraftBySlug = Object.fromEntries(
  aircraft.map((a) => [a.slug, a]),
) as Record<Aircraft["slug"], Aircraft>;

/** The aircraft that flies the homepage. Vajra, by design — see the brief. */
export const HERO_AIRCRAFT = aircraftBySlug.vajra;
