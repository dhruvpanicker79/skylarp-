"use client";

import Link from "next/link";
import { useState } from "react";
import { aircraft } from "@/data/aircraft";
import { VALUE_KIND_LABEL } from "@/data/types";

/**
 * The aircraft selector from the storyboard: a tab per aircraft, with the
 * selected one's headline specifications listed beneath.
 *
 * Interactive rather than decorative — this is the one place on the homepage
 * where the visitor can compare the fleet without leaving the flight.
 * Specifications that have no measured value show a dash rather than borrowing
 * the design figure.
 */
export function FleetTabs() {
  const [active, setActive] = useState(aircraft[0].slug);
  const selected = aircraft.find((a) => a.slug === active) ?? aircraft[0];

  // The rows the storyboard lists, in its order.
  const rows = [
    "Wingspan",
    "Empty weight",
    "Design payload",
    "Wing area",
    "Aspect ratio",
    "Airfoil",
    "Best recorded payload",
  ];

  return (
    <div>
      {/* Tabs */}
      <div role="tablist" aria-label="Aircraft" className="flex gap-px border-b border-white/[0.12]">
        {aircraft.map((a) => {
          const isActive = a.slug === active;
          return (
            <button
              key={a.slug}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(a.slug)}
              className={`flex-1 px-3 py-2.5 text-center font-mono text-meta uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "bg-ember-500 text-navy-900"
                  : "bg-white/[0.04] text-ivory-300 hover:bg-white/[0.09]"
              }`}
            >
              {a.name}
            </button>
          );
        })}
      </div>

      {/* Selected aircraft */}
      <div className="mt-6">
        <p className="label-meta">
          {selected.className} Class · {selected.year}
        </p>
        <h3 className="h-title mt-1">{selected.name}</h3>

        <dl className="mt-5">
          {rows.map((label) => {
            const spec = selected.specs.find((s) => s.label === label);
            if (!spec) return null;
            return (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 border-b border-white/[0.09] py-2"
              >
                <dt className="label-meta">{label}</dt>
                <dd className="text-right">
                  {spec.value ? (
                    <span className="font-mono text-caption tabular-nums text-ivory-50">
                      {spec.value}
                    </span>
                  ) : (
                    <span
                      className="font-mono text-caption text-slate-500"
                      title={`No ${VALUE_KIND_LABEL[spec.kind].toLowerCase()} value yet`}
                    >
                      —
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>

        <Link href={`/aircraft/${selected.slug}`} className="link-action mt-6 inline-block">
          Explore {selected.name} →
        </Link>
      </div>
    </div>
  );
}
