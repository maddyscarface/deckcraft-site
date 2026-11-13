"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { site } from "@/config/site";
import { nextDeadline } from "@/lib/seasonal";
import { track } from "@/lib/tracking";

const TYPES = [
  { v: "condo", l: "Condo association" }, { v: "hoa", l: "HOA" }, { v: "multifamily", l: "Multifamily" },
  { v: "triple-deckers", l: "Triple-deckers" }, { v: "commercial", l: "Commercial" }, { v: "mixed", l: "Mixed portfolio" },
];
const URGENCY = [{ v: "safety", l: "Known safety concerns" }, { v: "season", l: "Before next season" }, { v: "budget", l: "For budget planning" }];
const FREQ = [{ v: "annual", l: "Annual" }, { v: "semi", l: "Twice a year" }, { v: "once", l: "One-time" }];

/**
 * Preliminary inspection schedule. The per-day rate is an owner-configurable planning assumption,
 * not a commitment. Output is a rough plan to discuss at the walkthrough.
 */
export function PortfolioPlanner({ compact = false }: { compact?: boolean }) {
  const [n, setN] = useState(10);
  const [structures, setStructures] = useState(0);
  const [type, setType] = useState("condo");
  const [urgency, setUrgency] = useState("season");
  const [freq, setFreq] = useState("annual");
  const perDay = site.inspectionsPerDay;

  const plan = useMemo(() => {
    // If they gave structure counts, plan by structures (≈ perDay*2 structures/day); else by properties.
    const days = structures > 0 ? Math.ceil(structures / (perDay * 2)) : Math.ceil(n / perDay);
    const priority = urgency === "safety" ? "Safety items first: any property with a known concern is visited in the first round." : "Properties are grouped by town to keep the route tight.";
    const rounds = freq === "semi" ? "Spring and fall rounds" : freq === "annual" ? "One round per year, ideally " + nextDeadline() : "A single round";
    return { days, priority, rounds };
  }, [n, structures, urgency, freq, perDay]);

  const href = `/request-walkthrough?properties=${n}&type=${type}`;
  return (
    <div className="rounded-[2px] bg-hunter p-6 text-white shadow-premium md:p-8" data-testid="planner">
      <h3 className="font-display text-2xl">Plan Your Inspection Round</h3>
      <div className="mt-6 space-y-5">
        <div>
          <p className="label text-white">Number of properties</p>
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Fewer properties" onClick={() => setN(Math.max(1, n - 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-linen text-hunter"><Minus size={18} /></button>
            <input aria-label="Number of properties" type="number" min={1} max={200} value={n} onChange={(e) => setN(Math.min(200, Math.max(1, Number(e.target.value) || 1)))} className="w-20 rounded-[2px] bg-hunter-mid px-2 py-2 text-center text-2xl font-semibold" />
            <button type="button" aria-label="More properties" onClick={() => setN(Math.min(200, n + 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-linen text-hunter"><Plus size={18} /></button>
          </div>
        </div>
        <label className="block">
          <span className="label text-white">Property type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="field">{TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select>
        </label>
        {!compact && (
          <>
            <label className="block">
              <span className="label text-white">Decks, porches and fence runs (optional total)</span>
              <input type="number" min={0} value={structures || ""} onChange={(e) => setStructures(Math.max(0, Number(e.target.value) || 0))} className="field" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="label text-white">Urgency</span><select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="field">{URGENCY.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
              <label className="block"><span className="label text-white">Frequency</span><select value={freq} onChange={(e) => setFreq(e.target.value)} className="field">{FREQ.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
            </div>
          </>
        )}
      </div>
      <div className="mt-6 rounded-[2px] border border-hunter-light bg-hunter-mid p-5" aria-live="polite" data-testid="planner-output">
        <p className="text-sm text-sage">Estimated inspection days</p>
        <p className="font-display text-4xl text-linen">{plan.days}</p>
        <p className="mt-2 text-sm">Suggested timing: complete {nextDeadline()}.</p>
        {!compact && <><p className="mt-1 text-sm">{plan.rounds}.</p><p className="mt-1 text-sm">{plan.priority}</p></>}
        <p className="mt-3 text-xs text-sage">Planning estimate only, based on about {perDay} properties per inspection day. Your walkthrough sets the real schedule.</p>
      </div>
      <Link href={href} onClick={() => track.toolComplete("portfolio_planner", String(plan.days))} className="btn btn-linen mt-6 w-full">Book a Walkthrough</Link>
    </div>
  );
}
