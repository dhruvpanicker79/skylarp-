import { Navbar } from "@/components/navigation/Navbar";
import { aircraftBySlug } from "@/data/aircraft";
import { flightLog } from "@/data/team";

export const metadata = {
  title: "Flight Log",
  description:
    "Every test: what changed, why, what happened, what broke, what it taught us, and the number that proves it.",
};

/**
 * The flight log.
 *
 * The entry layout follows the storyboard: date and test number on a timeline
 * rail, then the change, the failure, the fix and the result, with the figure
 * that proves it set apart.
 *
 * `flightLog` is empty until the team supplies real entries. The empty state
 * explains the format rather than showing a fabricated example, because a
 * single invented entry would make every real one unbelievable.
 */
export default function FlightLogPage() {
  return (
    <>
      <Navbar />

      <main id="main" className="pt-[var(--nav-h)]">
        <section className="mx-auto max-w-[1500px] px-[5vw] py-14 lg:py-20">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 bg-ember-500" />
            <span className="label-meta text-ivory-200">06 — Flight log</span>
          </div>
          <h1 className="h-display mt-5">
            Failure is
            <br />
            <span className="text-ember-500">engineering data.</span>
          </h1>
          <p className="prose-skylark mt-6">
            Test flights are where a design stops being a prediction. This log records what we
            changed, why we changed it, what broke, and the measurement that settled it. Entries
            that went badly stay in — they are the ones worth reading.
          </p>
        </section>

        <section className="mx-auto max-w-[1500px] px-[5vw] pb-24">
          {flightLog.length === 0 ? <EmptyLog /> : (
            <ol className="border-t border-white/[0.1]">
              {flightLog.map((entry) => (
                <li key={entry.id} className="border-b border-white/[0.1]">
                  <article className="grid gap-8 py-10 lg:grid-cols-[200px_minmax(0,1fr)_240px]">
                    <header>
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 bg-ember-500" />
                        <time className="font-mono text-caption tabular-nums text-ivory-100">
                          {entry.date}
                        </time>
                      </div>
                      <h2 className="h-heading mt-3">{entry.testNumber}</h2>
                      <p className="label-meta mt-2">
                        {aircraftBySlug[entry.aircraft]?.name ?? entry.aircraft}
                      </p>
                    </header>

                    <div className="space-y-5">
                      <Field label="What we changed" body={entry.changed} />
                      <Field label="Why" body={entry.why} />
                      <Field label="What happened" body={entry.happened} />
                      {entry.broke ? (
                        <Field label="What broke" body={entry.broke} tone="warn" />
                      ) : null}
                      <Field label="What we learned" body={entry.learned} />
                      <Field label="What we changed next" body={entry.next} />
                    </div>

                    <aside className="border-l-2 border-ember-500 pl-5">
                      <p className="label-meta">Result</p>
                      <p className="mt-2 text-caption text-ivory-100">{entry.result}</p>
                      {entry.evidence ? (
                        <div className="mt-5">
                          <div className="font-mono text-heading tabular-nums text-ember-500">
                            {entry.evidence.value}
                          </div>
                          <div className="mt-1 text-caption text-slate-400">
                            {entry.evidence.label}
                          </div>
                        </div>
                      ) : null}
                    </aside>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </>
  );
}

function Field({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone?: "warn";
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-6">
      <p className={`label-meta ${tone === "warn" ? "text-ember-400" : ""}`}>{label}</p>
      <p className="text-caption text-ivory-200">{body}</p>
    </div>
  );
}

/**
 * The empty state documents the format. It is what the team fills in, and it
 * doubles as the brief for collecting entries from test days.
 */
function EmptyLog() {
  const fields = [
    ["Date", "When the test ran"],
    ["Aircraft", "Vajra, Tejas or Garuda"],
    ["Test / flight number", "e.g. Test Flight 07"],
    ["What we changed", "The modification under test"],
    ["Why", "What problem it was meant to solve"],
    ["What happened", "Observed behaviour in the air"],
    ["What broke", "Left blank if nothing did"],
    ["What we learned", "The engineering conclusion"],
    ["What we changed next", "What it led to"],
    ["Result", "Outcome, and the number proving it"],
  ];

  return (
    <div className="border border-dashed border-ember-500/35 p-8 sm:p-12">
      <p className="label-meta text-ember-300">No entries yet</p>
      <h2 className="h-heading mt-3 max-w-2xl">
        This log is written from real test days, not from the design reports.
      </h2>
      <p className="prose-skylark mt-4">
        A design report says what an aircraft was intended to do. A flight log says what it did.
        Nothing is published here until the team supplies real entries — add them to{" "}
        <code className="font-mono text-ivory-100">data/team.ts</code> and they appear in this
        layout automatically.
      </p>

      <dl className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {fields.map(([label, hint]) => (
          <div key={label} className="flex items-baseline gap-4 border-b border-white/[0.09] py-2">
            <dt className="label-meta w-[11rem] shrink-0">{label}</dt>
            <dd className="text-caption text-slate-400">{hint}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
