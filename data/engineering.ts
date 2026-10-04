/**
 * Research & development areas, and the design/build/test process.
 *
 * Content is drawn from the 2026 Technical Design Reports. Where a report
 * names a tool, a test or a result, it is quoted as such; where it does not,
 * the field is left for the team to fill rather than invented.
 */

export interface Discipline {
  slug: string;
  name: string;
  /** What this group actually does, in the team's own terms. */
  body: string;
  /** Tools and methods named in the design reports. */
  methods: string[];
  /** A real result, where a report states one. */
  result?: { value: string; label: string; aircraft: string };
}

export const disciplines: Discipline[] = [
  {
    slug: "aerodynamics",
    name: "Aerodynamics",
    body:
      "Planform, airfoil and stability are chosen by trade study rather than preference. Candidate configurations are scored against the competition's own scoring curve, narrowed by low-fidelity sweeps, then taken to higher-fidelity CFD before anything is built.",
    methods: ["CFD", "MATLAB Tornado VLM solver", "Airfoil trade studies", "Wind tunnel testing"],
    result: { value: "−16.23%", label: "drag after refinement", aircraft: "Vajra" },
  },
  {
    slug: "structures",
    name: "Structures",
    body:
      "Airframes are built to survive the load case with the least mass that will do it. Wings are built around a hollow aluminium main spar with a round dowel resisting torsion, and prototypes are instrumented and flown rather than signed off on analysis alone.",
    methods: ["ANSYS Mechanical FEA", "Topology optimisation", "Response surface methods", "Wingtip gyro deflection testing"],
    result: { value: "+4.81%", label: "wing stiffness, final iteration", aircraft: "Vajra" },
  },
  {
    slug: "propulsion",
    name: "Propulsion",
    body:
      "Motor and propeller are selected by simulating a whole competition round, with throttle varied across flight phases and a factor of safety covering wind gusts. Predicted thrust is then checked against a thrust stand before it is trusted.",
    methods: ["Full-round flight simulation", "Thrust stand testing", "MATLAB Simulink", "Dynamic thrust validation"],
    result: { value: "3.91%", label: "median deviation, predicted vs experimental thrust", aircraft: "Tejas" },
  },
  {
    slug: "avionics",
    name: "Avionics",
    body:
      "Flight controllers, telemetry and control linkages, including the firmware trade-offs behind autonomous and manual mission profiles. Garuda's tilt mechanism is driven through ArduPilot with parameters tuned to vary tilt precisely during testing.",
    methods: ["ArduPilot", "Telemetry logging", "GPS, accelerometers, pitot tubes, altimeters"],
  },
  {
    slug: "payload",
    name: "Payload",
    body:
      "Carrying mass is the mission, so the payload system is designed as carefully as the airframe. Containers are evaluated empirically for slosh, weight and fill-and-flow; cargo bays are integrated into the structure rather than bolted into it.",
    methods: ["Empirical water container analysis", "Slosh testing", "CG envelope analysis"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    body:
      "Modular construction around a single spar, with hatches for access to the avionics bay and wiring routed internally through the boom for protection and aerodynamic cleanliness.",
    methods: ["Composite layup", "3D printed PLA interfaces", "Modular wing construction"],
  },
  {
    slug: "flight-testing",
    name: "Flight Testing",
    body:
      "Nothing is claimed that has not been flown. Test campaigns run at Aamby Valley with instrumented aircraft; VTOL stability is proven on a tether before any untethered flight is attempted.",
    methods: ["Instrumented flight testing", "Tether testing", "Post-flight optimisation", "Five-round scoring runs"],
  },
];

/** The loop the team actually works in. */
export const PROCESS = [
  { step: "Research", body: "Read the rules, the scoring curve and the previous year's failures." },
  { step: "Design", body: "Trade studies narrow thousands of configurations to a feasible region." },
  { step: "Analyse", body: "CFD, FEA and stability analysis on the survivors." },
  { step: "Manufacture", body: "Build the prototype, usually more than one." },
  { step: "Test", body: "Bench, tunnel and thrust stand before the aircraft leaves the ground." },
  { step: "Fly", body: "Instrumented flight tests, scored across repeated rounds." },
  { step: "Iterate", body: "Feed what broke back into the next airframe." },
] as const;
