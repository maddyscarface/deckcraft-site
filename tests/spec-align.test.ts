import { describe, expect, it } from "vitest";
import { RESIDENTIAL_STAGES, COMMERCIAL_STAGES, CRM_EVENTS, ghlConfig, ownerFor } from "@/config/ghl";
import { activeSeasonal, inWindow, SEASONAL_MODULES, EVERGREEN_MODULE } from "@/config/seasonal";
import { PRICING, bandFor, newDeckStartingAt } from "@/config/pricing";
import { measurementFor } from "@/config/measurement";
import { leadSchema } from "@/lib/lead-schema";
import { geographyFor } from "@/lib/towns";
import { START_TO_TIMELINE, estimateConfig } from "@/config/estimate";
import { estimateInternalConfig } from "@/config/estimate-internal";
import { sqftFromLabel } from "@/lib/estimate/qualifiers";
import { SERVICE_CARDS } from "@/lib/services";

const env = (o: Record<string, string>) => o as unknown as NodeJS.ProcessEnv;

describe("GHL pipelines (spec §3)", () => {
  it("uses the exact stage names", () => {
    expect(RESIDENTIAL_STAGES.map((s) => s.name)).toEqual(["New", "Contact attempted", "Photos received", "Qualified", "Inspection booked", "Estimate sent", "Follow-up", "Won/Lost"]);
    expect(COMMERCIAL_STAGES.map((s) => s.name)).toEqual(["Inquiry", "Property review", "Walkthrough", "Bid/RFP", "Negotiation", "Won/Lost"]);
  });
  it("maps won/lost to the closing stage with status, and keeps legacy names", () => {
    expect(CRM_EVENTS.won).toEqual({ stage: "won_lost", status: "won" });
    expect(CRM_EVENTS.lost).toEqual({ stage: "won_lost", status: "lost" });
    expect(CRM_EVENTS.estimate_booked.stage).toBe("inspection_booked");
    expect(CRM_EVENTS.walkthrough_booked.stage).toBe("walkthrough");
  });
  it("assigns sales owner by geography, then pipeline", () => {
    const c = ghlConfig(env({ GHL_OWNER_IDS: JSON.stringify({ residential: "uR", commercial: "uC", MetroWest: "uMW" }) }));
    expect(ownerFor(c, "residential", "MetroWest")).toBe("uMW");
    expect(ownerFor(c, "commercial", "Boston")).toBe("uC");
    expect(geographyFor("Dorchester")).toBe("Boston");
    expect(geographyFor("Nowhere")).toBe("Other");
  });
});

describe("measurement events (spec §4)", () => {
  it("maps CRM stages to the spec events, never counting uploads as sales", () => {
    expect(measurementFor("qualified")?.event).toBe("qualified_lead");
    expect(measurementFor("inspection_booked")?.event).toBe("appointment_booked");
    expect(measurementFor("walkthrough")?.event).toBe("appointment_booked");
    expect(measurementFor("estimate_sent")?.event).toBe("estimate_sent");
    expect(measurementFor("won")).toEqual({ event: "won_job", withValue: true });
    expect(measurementFor("paid")).toEqual({ event: "revenue", withValue: true });
    expect(measurementFor("photos_received")).toBeNull();
  });
});

describe("seasonal modules (spec §1)", () => {
  it("picks the dated module, wraps the new year, falls back to evergreen", () => {
    expect(activeSeasonal(new Date("2026-11-12T15:00:00Z"), env({}))?.id).toBe("fall-sealing");
    expect(activeSeasonal(new Date("2027-01-10T15:00:00Z"), env({}))?.id).toBe("winter-planning");
    expect(activeSeasonal(new Date("2026-09-05T15:00:00Z"), env({}))?.id).toBe("evergreen");
    expect(inWindow({ start: "11-21", end: "02-28" }, "02-01")).toBe(true);
  });
  it("supports admin overrides", () => {
    expect(activeSeasonal(new Date(), env({ SEASONAL_FORCE: "off" }))).toBeNull();
    expect(activeSeasonal(new Date(), env({ SEASONAL_FORCE: "evergreen" }))).toBe(EVERGREEN_MODULE);
    const custom = JSON.stringify([{ ...SEASONAL_MODULES[0], id: "promo", start: "01-01", end: "12-31" }]);
    expect(activeSeasonal(new Date(), env({ SEASONAL_MODULES_JSON: custom }))?.id).toBe("promo");
  });
  it("never claims open slots", () => {
    for (const m of [...SEASONAL_MODULES, EVERGREEN_MODULE]) expect(m.bar).not.toMatch(/slots are open/i);
  });
});

describe("internal pricing reference (Phase 2 values kept INTERNAL in Phase 4)", () => {
  it("$39.99/sq ft starting and the three bands remain internal-only reference values", () => {
    expect(PRICING.newDeckStartPerSqFt).toBe(39.99);
    expect(PRICING.planningBands.map((b) => b.label)).toEqual(["$8k–15k", "$15k–25k", "$25k+"]);
    expect(newDeckStartingAt(320)).toBe(12797);
    expect(bandFor(12797)?.label).toBe("$8k–15k");
    expect(bandFor(30000)?.label).toBe("$25k+");
  });
  it("Phase 4: the public (client-bundled) config carries no prices, ranges or budget bands", () => {
    expect(estimateConfig.publicPricing).toBeUndefined();
    expect(sqftFromLabel("16×20 (320 sq ft)")).toBe(320);
    expect(estimateConfig.budgetBands).toEqual([]);
    expect(JSON.stringify(estimateConfig)).not.toMatch(/typical|\$\d/);
    expect(estimateInternalConfig.budgetBands.map((b) => b.id)).toEqual(expect.arrayContaining(["8_15k", "15_25k", "25kp"]));
  });
  it("keeps START_TO_TIMELINE", () => {
    expect(START_TO_TIMELINE.within_30).toBe("this_season");
    expect(START_TO_TIMELINE.researching).toBe("planning");
  });
});

describe("forms (spec §2)", () => {
  const base = { event_id: "evt_test_1", form_type: "assessment", first_name: "A", last_name: "B", email: "a@example.com", phone: "6175550123", customer_type: "homeowner", town: "Newton", services: ["new_deck"] };
  it("accepts the homeowner spec fields", () => {
    const r = leadSchema.safeParse({ ...base, zip: "02458", work_type: "new", current_structure: "Nothing yet (new build)", material_preference: "composite", access: "Easy: side yard or gate", hoa_permit: "Both HOA and permit", availability: "Weekday evenings" });
    expect(r.success).toBe(true);
  });
  it("rejects a bad ZIP but stays compatible without the new fields", () => {
    expect(leadSchema.safeParse({ ...base, zip: "24" }).success).toBe(false);
    expect(leadSchema.safeParse(base).success).toBe(true);
  });
  it("accepts the property/HOA/commercial fields with budget optional", () => {
    const r = leadSchema.safeParse({ event_id: "evt_test_2", form_type: "walkthrough", first_name: "A", last_name: "B", email: "a@example.com", phone: "6175550123", customer_type: "hoa_condo", company_name: "Maple HOA", role: "Board member", property_count: 3, structure_count: 24, towns: ["Quincy"], town: "Quincy", services: ["inspection"], urgency: "safety_now", procurement: ["Certificate of insurance (COI)"], preferred_contact: "email", walkthrough_requested: true });
    expect(r.success).toBe(true);
  });
});

describe("service grid (spec §1)", () => {
  it("has the six spec services in order", () => {
    expect(SERVICE_CARDS.map((c) => c.href)).toEqual(["/services/new-decks", "/services/deck-rebuild-resurfacing", "/services/deck-repair", "/services/board-railing-stairs", "/services/deck-staining-sealing", "/fencing"]);
  });
});
