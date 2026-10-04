import Link from "next/link";
import { PanelFrame } from "@/components/content/PanelFrame";
import { Placeholder } from "@/components/ui/Placeholder";
import { aircraft } from "@/data/aircraft";
import { achievementsByYear, TEAM_FACTS, UNVERIFIED_YEARS } from "@/data/achievements";

/**
 * The homepage without the flight.
 *
 * Served to visitors who have asked for reduced motion, and to devices that
 * cannot run the 3D scene well. It is also rendered (visually hidden) alongside
 * the flight so the page has a real document structure for search engines and
 * screen readers, which a canvas cannot provide.
 *
 * This is ordinary sectioned scrolling with the same content and the same
 * design language — not a stripped-down apology.
 */
export function StaticHome() {
  return (
    <main id="main" className="mx-auto max-w-[1100px] px-[6vw] pb-32 pt-[calc(var(--nav-h)+5rem)]">
      <section>
        <p className="label-meta mb-5 text-ember-500">Aero Design Team · DJSCE · Mumbai</p>
        <h1 className="h-display">We engineer flight.</h1>
        <p className="prose-skylark mt-6">
          DJS Skylark is the Aero Design team of {TEAM_FACTS.college}. We design, build and fly
          radio-controlled aircraft for SAE Aero Design, and have competed since{" "}
          {TEAM_FACTS.competingSince} — entering the Regular, Micro and Advanced classes
          simultaneously.
        </p>
      </section>

      <Section index="01" label="Aircraft" title="Three classes. One season.">
        <ul className="divide-y divide-white/[0.09]">
          {aircraft.map((a) => (
            <li key={a.slug} className="py-5">
              <Link href={`/aircraft/${a.slug}`} className="no-underline">
                <span className="h-heading">{a.name}</span>
                <span className="label-meta ml-3">
                  {a.className} Class · {a.year}
                </span>
              </Link>
              <p className="prose-skylark mt-2 text-caption">{a.mission}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section index="02" label="Achievements" title="SAE Aero Design results">
        <div className="space-y-6">
          {achievementsByYear().map(({ year, results }) => (
            <div key={year} className="flex gap-6 border-t border-white/[0.09] pt-4">
              <div className="w-16 shrink-0">
                <span className="font-mono text-heading tabular-nums text-ember-500">{year}</span>
                {UNVERIFIED_YEARS.includes(year) ? (
                  <span className="label-meta mt-1 block text-ember-300/70">Unconfirmed</span>
                ) : null}
              </div>
              <ul className="flex-1 space-y-1.5">
                {results.map((r) => (
                  <li key={`${r.className}-${r.category}`} className="text-caption text-ivory-200">
                    <span className="font-mono text-ivory-50">{r.place}</span> · {r.className} ·{" "}
                    {r.category}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section index="03" label="Engineering" title="From idea to flight.">
        <ol className="label-meta flex flex-wrap gap-x-3 gap-y-2 text-ivory-200">
          {["Research", "Design", "Analyse", "Manufacture", "Test", "Fly", "Iterate"].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="prose-skylark mt-5">
          Each aircraft is narrowed from thousands of candidate configurations by trade study, taken
          through CFD and finite-element analysis, then built and flown — with the flight results fed
          back into the next iteration.
        </p>
      </Section>

      <Section index="04" label="Flight log" title="Failure is engineering data.">
        <p className="prose-skylark">
          What we changed, what broke, what we learned, and the number that proved it.
        </p>
        <div className="mt-4">
          <Placeholder kind="flight-log" note="test and flight entries from the team" />
        </div>
      </Section>

      <Section index="05" label="Team" title="The people behind the flight.">
        <p className="prose-skylark">
          {TEAM_FACTS.memberCount} members across aerodynamics, structures and stability, avionics
          and marketing, with dedicated Design Report and FDRR sub-teams.
        </p>
        <div className="mt-4">
          <Placeholder kind="data" note="current roster" />
        </div>
      </Section>

      <section className="mt-24 border-t border-white/[0.09] pt-12">
        <h2 className="h-title">
          Don&rsquo;t just watch the flight. <span className="text-ember-500">Build it.</span>
        </h2>
        <Link
          href="/join"
          className="label-meta mt-7 inline-block border border-ember-500 px-5 py-3 text-ember-500"
        >
          Join Skylark →
        </Link>
      </section>
    </main>
  );
}

function Section({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-24">
      <PanelFrame index={index} label={label} className="bg-transparent shadow-none">
        <h2 className="h-title">{title}</h2>
        <div className="mt-6">{children}</div>
      </PanelFrame>
    </section>
  );
}
