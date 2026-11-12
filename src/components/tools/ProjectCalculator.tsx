"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PRICING, bandFor, newDeckStartingAt, pricingLabel, usd } from "@/config/pricing";
import { track } from "@/lib/tracking";

const PRESETS = [[12, 12], [12, 16], [16, 20], [20, 24]] as const;
const EXTRAS = [
  { id: "stairs", label: "Stairs" }, { id: "composite", label: "Composite boards" }, { id: "elevated", label: "Elevated / second story" },
  { id: "rail", label: "Upgraded railings" }, { id: "demo", label: "Remove an old deck" }, { id: "lighting", label: "Lighting" },
];

/**
 * New-deck project calculator (spec §1). Shows ONLY the labelled starting assumption (sq ft × $/sq ft) and the
 * matching planning band. Extras are listed as cost drivers with no invented prices.
 */
export function ProjectCalculator({ compact = false }: { compact?: boolean }) {
  const [w, setW] = useState("16");
  const [l, setL] = useState("20");
  const [extras, setExtras] = useState<string[]>([]);
  const [seen, setSeen] = useState(false);
  const sqft = useMemo(() => Math.max(0, Math.round((Number(w) || 0) * (Number(l) || 0))), [w, l]);
  const start = newDeckStartingAt(sqft);
  const band = bandFor(start);
  const touch = () => { if (!seen) { setSeen(true); track.toolComplete("project_calculator", "used"); } };
  const field = "field !h-12 text-lg";

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.1fr_1fr]" data-testid="project-calculator">
      <div className="bg-white p-6 md:p-8">
        <p className="eyebrow text-cedar">Your deck</p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <label className="block"><span className="label">Width (ft)</span><input inputMode="decimal" className={field} value={w} onChange={(e) => { setW(e.target.value.replace(/[^\d.]/g, "")); touch(); }} data-testid="calc-w" /></label>
          <label className="block"><span className="label">Length (ft)</span><input inputMode="decimal" className={field} value={l} onChange={(e) => { setL(e.target.value.replace(/[^\d.]/g, "")); touch(); }} data-testid="calc-l" /></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Common sizes">
          {PRESETS.map(([a, b]) => (
            <button key={`${a}x${b}`} type="button" className="choice !min-h-[40px] !px-3 text-sm" aria-pressed={Number(w) === a && Number(l) === b} onClick={() => { setW(String(a)); setL(String(b)); touch(); }}>{a}×{b}</button>
          ))}
        </div>
        {!compact && (
          <div className="mt-7">
            <p className="label">Anything else in the plan? <span className="font-normal text-stone">(raises the price; quoted after review)</span></p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXTRAS.map((x) => {
                const on = extras.includes(x.id);
                return <button key={x.id} type="button" className="choice !min-h-[40px] !px-3 text-sm" aria-pressed={on} onClick={() => { setExtras(on ? extras.filter((y) => y !== x.id) : [...extras, x.id]); touch(); }}>{x.label}</button>;
              })}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col bg-navy p-6 text-white md:p-8" aria-live="polite">
        <p className="eyebrow text-cedar-light">{pricingLabel()}</p>
        <p className="mt-5 text-sm text-white/70">{sqft.toLocaleString("en-US")} sq ft × ${PRICING.newDeckStartPerSqFt} / sq ft starting</p>
        <p className="mt-1 font-display text-[46px] leading-none" data-testid="calc-start">{sqft ? `from ${usd(start)}` : "—"}</p>
        {band && <p className="mt-4 text-[15px]"><span className="text-white/65">Planning band:</span> <b>{band.label}</b> <span className="text-white/65">· {band.fits}</span></p>}
        {!band && sqft > 0 && <p className="mt-4 text-[15px] text-white/70">Below our smallest planning band. Small decks and landings are quoted individually.</p>}
        {extras.length > 0 && <p className="mt-3 text-[14px] text-white/70">Plus {extras.length} item{extras.length > 1 ? "s" : ""} that raise the price ({extras.map((x) => EXTRAS.find((e) => e.id === x)?.label.toLowerCase()).join(", ")}). We price these after reviewing photos.</p>}
        <p className="mt-6 text-[12.5px] leading-relaxed text-white/60">{PRICING.assumptions[0]} {PRICING.exclusions} {PRICING.noGuarantee}</p>
        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <Link href={`/new-deck-estimate?sqft=${sqft}${extras.length ? `&extras=${extras.join(",")}` : ""}`} className="btn btn-cedar flex-1">Get a New Deck Estimate</Link>
        </div>
        <p className="mt-4 text-[12.5px] text-white/60">{PRICING.repairNote} <Link href="/free-assessment" className="underline underline-offset-2">Send 3 photos instead</Link></p>
      </div>
    </div>
  );
}
