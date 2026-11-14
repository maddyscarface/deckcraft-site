"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/tracking";

const PRESETS = [[12, 12], [12, 16], [16, 20], [20, 24]] as const;
const EXTRAS = [
  { id: "stairs", label: "Stairs" }, { id: "composite", label: "Composite boards" }, { id: "elevated", label: "Elevated / second story" },
  { id: "rail", label: "Railings" }, { id: "demo", label: "Remove an old deck" }, { id: "lighting", label: "Lighting" },
];

/**
 * Phase 4 SCOPE PLANNER (replaces the Phase 2 price calculator). Customers see dimensions only: area and open-edge
 * length from their own width × length. No prices, rates, bands or cost calculations are shown (owner rule).
 * The plan is carried into the estimate form / guided walkthrough as customer-reported scope.
 */
export function ProjectCalculator({ compact = false }: { compact?: boolean }) {
  const [w, setW] = useState("16");
  const [l, setL] = useState("20");
  const [extras, setExtras] = useState<string[]>([]);
  const [seen, setSeen] = useState(false);
  const W = Number(w) || 0; const L = Number(l) || 0;
  const sqft = useMemo(() => Math.max(0, Math.round(W * L)), [W, L]);
  const openEdge = Math.round(W + 2 * L); // three open sides when one side meets the house (customer to confirm)
  const touch = () => { if (!seen) { setSeen(true); track.toolComplete("project_calculator", "used"); } };
  const field = "field !h-12 text-lg";
  const q = `sqft=${sqft}${extras.length ? `&extras=${extras.join(",")}` : ""}`;

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
            <button key={`${a}x${b}`} type="button" className="choice !min-h-[40px] !px-3 text-sm" aria-pressed={W === a && L === b} onClick={() => { setW(String(a)); setL(String(b)); touch(); }}>{a}×{b}</button>
          ))}
        </div>
        {!compact && (
          <div className="mt-7">
            <p className="label">Anything else in the plan?</p>
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
        <p className="eyebrow text-cedar-light">Your scope plan</p>
        <p className="mt-5 font-display text-[46px] leading-none" data-testid="calc-start">{sqft ? `${sqft.toLocaleString("en-US")} sq ft` : "—"}</p>
        {sqft > 0 && <p className="mt-3 text-[15px] text-white/80">About <b className="text-white">{openEdge} ft</b> of open edge for railings if one long side meets the house.</p>}
        {extras.length > 0 && <p className="mt-3 text-[14px] text-white/70">Also in the plan: {extras.map((x) => EXTRAS.find((e) => e.id === x)?.label.toLowerCase()).join(", ")}.</p>}
        <p className="mt-6 text-[12.5px] leading-relaxed text-white/60">These are your own dimensions, used to plan scope. We don&rsquo;t publish prices: your price comes only in a written estimate after we confirm the site.</p>
        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <Link href={`/walkthrough/start?service=new_deck&${q}`} className="btn btn-cedar flex-1" data-testid="calc-walkthrough">Start a guided walkthrough</Link>
          <Link href={`/new-deck-estimate?${q}`} className="btn btn-ghost flex-1">Request an estimate</Link>
        </div>
        <p className="mt-4 text-[12.5px] text-white/60">Existing deck? <Link href="/free-assessment" className="underline underline-offset-2">Send 3 photos instead</Link></p>
      </div>
    </div>
  );
}
