/**
 * Placeholders.
 *
 * The rule from the brief: missing content is shown as missing, never filled
 * with invented facts or generated imagery. These render consistently with the
 * rest of the design so the site looks deliberate while incomplete, and so it
 * is obvious at a glance what still needs real material.
 */

export type PlaceholderKind = "data" | "image" | "model" | "flight-log" | "photo" | "logo";

const LABEL: Record<PlaceholderKind, string> = {
  data: "ADD DATA",
  image: "ADD IMAGE",
  model: "ADD GLB",
  "flight-log": "ADD FLIGHT LOG",
  photo: "ADD PHOTO",
  logo: "ADD LOGO",
};

export function Placeholder({
  kind = "data",
  note,
  className = "",
}: {
  kind?: PlaceholderKind;
  /** What specifically is needed, e.g. "measured endurance, Garuda". */
  note?: string;
  className?: string;
}) {
  return (
    <span
      className={`is-placeholder inline-flex items-center gap-2 px-2 py-1 ${className}`}
      title={note ? `Needed: ${note}` : undefined}
    >
      <span aria-hidden="true">[</span>
      {LABEL[kind]}
      <span aria-hidden="true">]</span>
      <span className="sr-only">{note ? ` — ${note}` : ""}</span>
    </span>
  );
}

/** A block-level placeholder standing in for an image or figure. */
export function PlaceholderBlock({
  kind = "image",
  note,
  aspect = "4 / 3",
  className = "",
}: {
  kind?: PlaceholderKind;
  note?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`is-placeholder flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`Placeholder: ${LABEL[kind]}${note ? ` — ${note}` : ""}`}
    >
      <span className="px-3 text-center">
        [{LABEL[kind]}]
        {note ? <span className="mt-1 block normal-case tracking-normal opacity-70">{note}</span> : null}
      </span>
    </div>
  );
}
