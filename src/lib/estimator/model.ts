import { createHash } from "node:crypto";
import type { NormalizedCapture } from "../walkthrough/capture";

/**
 * PRIVATE estimating model (staff only). Rates ship blank. A total exists only when every line has a manual quantity
 * AND a manual rate; otherwise the estimate is "incomplete" and no figure is produced. Nothing is ever guessed.
 */
export const LINE_CATEGORIES = ["materials", "labor", "disposal", "mobilization", "structural_allowance", "permit_contingency", "other"] as const;
export type LineCategory = (typeof LINE_CATEGORIES)[number];
export type Line = { id: string; category: LineCategory; description: string; quantity: number | null; unit: string; rate: number | null; rate_source: "manual" | "pricebook" | null; notes?: string };
export type Adjustments = { minimum: number | null; mobilization: number | null; waste_pct: number | null; tax_pct: number | null; margin_pct: number | null };
export type ScopeItem = { id: string; description: string; quantity: number | null; unit: string; source: "customer_tape" | "staff_verified" | "staff_entered"; measurement_ref?: string };

export const EMPTY_ADJ: Adjustments = { minimum: null, mobilization: null, waste_pct: null, tax_pct: null, margin_pct: null };

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null);
const r2 = (n: number) => Math.round(n * 100) / 100;

export function compute(lines: Line[], adj: Adjustments) {
  const missing = lines.filter((l) => num(l.quantity) === null || num(l.rate) === null).map((l) => l.id);
  if (!lines.length || missing.length) return { complete: false as const, missing_lines: missing, reason: !lines.length ? "No lines yet" : `${missing.length} line(s) need a manual quantity and rate` };
  const byCat = (c: LineCategory) => lines.filter((l) => l.category === c).reduce((a, l) => a + l.quantity! * l.rate!, 0);
  const lineSum = lines.reduce((a, l) => a + l.quantity! * l.rate!, 0);
  const materials = byCat("materials");
  const waste = num(adj.waste_pct) !== null ? materials * (adj.waste_pct! / 100) : 0;
  const mobilization = num(adj.mobilization) ?? 0;
  const cost = lineSum + waste + mobilization;
  const marginAmt = num(adj.margin_pct) !== null ? cost * (adj.margin_pct! / 100) : 0;
  let beforeTax = cost + marginAmt;
  const minimumApplied = num(adj.minimum) !== null && beforeTax < adj.minimum!;
  if (minimumApplied) beforeTax = adj.minimum!;
  const tax = num(adj.tax_pct) !== null ? beforeTax * (adj.tax_pct! / 100) : 0;
  return {
    complete: true as const, missing_lines: [] as string[],
    line_sum: r2(lineSum), materials: r2(materials), waste: r2(waste), mobilization: r2(mobilization), cost: r2(cost), margin_amount: r2(marginAmt),
    minimum_applied: minimumApplied, before_tax: r2(beforeTax), tax: r2(tax), total: r2(beforeTax + tax),
    unset_adjustments: (Object.keys(adj) as (keyof Adjustments)[]).filter((k) => num(adj[k]) === null),
  };
}
export type Computation = ReturnType<typeof compute>;

/** Snapshot hash of everything an approval covers. Any later edit changes it, so stale approvals can't be exported. */
export function snapshotHash(e: { lines: Line[]; adjustments: Adjustments; scope: ScopeItem[]; customer_scope_text?: string; exclusions?: string; capture_revision_no?: number }) {
  return createHash("sha256").update(JSON.stringify([e.lines, e.adjustments, e.scope, e.customer_scope_text ?? "", e.exclusions ?? "", e.capture_revision_no ?? 0])).digest("hex");
}

let seq = 0;
const lid = () => `ln_${Date.now().toString(36)}${(seq++).toString(36)}`;
const ft = (inches?: number) => (inches ? Math.round((inches / 12) * 10) / 10 : null);

/** Draft scope + blank-rate lines from the customer's measurements. Quantities are customer-reported until verified. */
export function draftFromCapture(service: string, cap: NormalizedCapture | null) {
  const m = (f: string) => cap?.measures.find((x) => x.field === f);
  const area = cap?.plan_area_sqft ?? null;
  const rail = ft(m("railing_length")?.inches);
  const steps = m("stairs_count")?.count ?? null;
  const fence = ft(m("fence_length")?.inches);
  const gates = m("gates_count")?.count ?? null;
  const scope: ScopeItem[] = [];
  const lines: Line[] = [];
  const add = (category: LineCategory, description: string, quantity: number | null, unit: string) => lines.push({ id: lid(), category, description, quantity, unit, rate: null, rate_source: null });
  if (area !== null) scope.push({ id: "area", description: "Deck plan area (customer tape measurement)", quantity: area, unit: "sq ft", source: "customer_tape", measurement_ref: "footprint" });
  if (rail !== null) scope.push({ id: "rail", description: "Railing run", quantity: rail, unit: "lin ft", source: "customer_tape", measurement_ref: "railing_length" });
  if (steps !== null) scope.push({ id: "steps", description: "Stair steps", quantity: steps, unit: "steps", source: "customer_tape", measurement_ref: "stairs_count" });
  if (fence !== null) scope.push({ id: "fence", description: "Fence run", quantity: fence, unit: "lin ft", source: "customer_tape", measurement_ref: "fence_length" });
  if (gates !== null) scope.push({ id: "gates", description: "Gates", quantity: gates, unit: "each", source: "customer_tape", measurement_ref: "gates_count" });
  switch (service) {
    case "new_deck":
      add("materials", "Decking and framing materials", area, "sq ft"); add("labor", "Framing and decking labor", area, "sq ft");
      add("materials", "Railing materials", rail, "lin ft"); add("labor", "Railing installation", rail, "lin ft"); add("labor", "Stairs", steps, "steps");
      add("structural_allowance", "Footings / structural allowance", 1, "allowance"); add("permit_contingency", "Permit and drawings contingency", 1, "allowance"); break;
    case "fence":
      add("materials", "Fence materials", fence, "lin ft"); add("labor", "Fence installation or repair labor", fence, "lin ft"); add("materials", "Gates", gates, "each");
      add("disposal", "Removal and disposal", null, "lot"); add("permit_contingency", "Permit / survey contingency", 1, "allowance"); break;
    case "resurfacing_staining":
      add("labor", "Surface preparation", area, "sq ft"); add("materials", "Boards or finish materials", area, "sq ft"); add("labor", "Railings and stairs", rail, "lin ft"); break;
    case "railings_stairs":
      add("materials", "Railing materials", rail, "lin ft"); add("labor", "Railing labor", rail, "lin ft"); add("labor", "Stair work", steps, "steps"); add("structural_allowance", "Post / stringer allowance", 1, "allowance"); break;
    case "property_inspection":
      add("labor", "Inspection and condition report", m("structure_count")?.count ?? null, "structures"); break;
    default:
      add("labor", "Repair labor", null, "hours"); add("materials", "Repair materials", null, "lot"); add("structural_allowance", "Framing / ledger allowance (if found)", 1, "allowance"); add("disposal", "Disposal", null, "lot");
  }
  return { scope, lines };
}
