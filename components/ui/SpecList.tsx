import { VALUE_KIND_LABEL, type Spec } from "@/data/types";
import { Placeholder } from "./Placeholder";

/**
 * The aircraft specification component.
 *
 * Every row states what kind of value it is. That is the whole point: a design
 * payload and a payload the aircraft was recorded carrying are different claims,
 * and a reader — especially a judge or a sponsor — should not have to guess
 * which one they are looking at.
 */
export function SpecList({
  specs,
  columns = 2,
  className = "",
}: {
  specs: Spec[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const cols = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns];

  return (
    <dl className={`grid grid-cols-1 gap-x-10 gap-y-0 ${cols} ${className}`}>
      {specs.map((spec) => (
        <SpecRow key={spec.label} spec={spec} />
      ))}
    </dl>
  );
}

function SpecRow({ spec }: { spec: Spec }) {
  const missing = spec.value === null;

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5">
      <dt className="label-meta shrink-0">{spec.label}</dt>
      <dd className="flex min-w-0 flex-col items-end text-right">
        {missing ? (
          <Placeholder kind="data" note={`${spec.label} — ${VALUE_KIND_LABEL[spec.kind].toLowerCase()} value`} />
        ) : (
          <span className="font-mono text-sub tabular-nums text-ivory-100">{spec.value}</span>
        )}

        {/* The provenance line. Shown for anything that is not a plain design
            figure, and for every value that carries a note. */}
        {(spec.note || spec.kind !== "design") && !missing ? (
          <span className="mt-0.5 text-caption text-slate-400">
            {spec.kind !== "design" ? VALUE_KIND_LABEL[spec.kind] : null}
            {spec.kind !== "design" && spec.note ? " · " : null}
            {spec.note}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

/**
 * A single headline figure, for use inside an editorial composition where a
 * table would be too much — "one number" as a whole panel.
 */
export function SpecFigure({
  value,
  label,
  kind,
  className = "",
}: {
  value: string;
  label: string;
  kind?: Spec["kind"];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-mono text-title tabular-nums text-ember-500">{value}</div>
      <div className="mt-1 max-w-xs text-caption text-ivory-200">{label}</div>
      {kind ? <div className="label-meta mt-1">{VALUE_KIND_LABEL[kind]}</div> : null}
    </div>
  );
}
