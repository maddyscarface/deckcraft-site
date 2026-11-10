import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/lead-schema";
import { funnelFor, pipelineFor, scoreLead, tagsFor } from "@/lib/routing";
import { evaluateChecker, type CheckerAnswers } from "@/lib/checker";
import { TOWNS } from "@/lib/towns";
import { SERVICES } from "@/lib/services";

const base = { form_type: "assessment", event_id: "lead_12345678", email: "Pat@Example.com", first_name: "Pat", phone: "(617) 555-0100", sms_consent: true } as const;

describe("lead schema", () => {
  it("accepts a valid assessment and normalizes email", () => {
    const r = leadSchema.parse({ ...base, services: ["deck_repair"], town: "Newton" });
    expect(r.email).toBe("pat@example.com");
  });
  it("requires phone and first name except for newsletter", () => {
    expect(leadSchema.safeParse({ ...base, phone: undefined, sms_consent: false }).success).toBe(false);
    expect(leadSchema.safeParse({ form_type: "newsletter", event_id: "nl_12345678", email: "a@b.co" }).success).toBe(true);
  });
  it("walkthrough requires company, property customer type and property count", () => {
    const r = leadSchema.safeParse({ ...base, form_type: "walkthrough", customer_type: "homeowner" });
    expect(r.success).toBe(false);
    const ok = leadSchema.safeParse({ ...base, form_type: "walkthrough", customer_type: "hoa_condo", company_name: "Elm St Condo Trust", property_count: 3 });
    expect(ok.success).toBe(true);
  });
  it("rejects a filled honeypot", () => {
    expect(leadSchema.safeParse({ ...base, website: "http://spam" }).success).toBe(false);
  });
  it("rejects unknown services", () => {
    expect(leadSchema.safeParse({ ...base, services: ["roofing"] }).success).toBe(false);
  });
});

describe("routing", () => {
  const L = (o: object) => leadSchema.parse({ ...base, ...o });
  it("maps services to the five funnels", () => {
    expect(funnelFor(L({ services: ["deck_repair"] }))).toBe("A_deck_repair");
    expect(funnelFor(L({ services: ["staining"] }))).toBe("B_staining");
    expect(funnelFor(L({ form_type: "checker", services: ["deck_repair"] }))).toBe("C_repair_or_replace");
    expect(funnelFor(L({ services: ["new_fence"] }))).toBe("D_fencing");
    expect(funnelFor(L({ customer_type: "landlord_pm", services: ["deck_repair"] }))).toBe("E_property_programs");
  });
  it("routes property customers to the commercial pipeline", () => {
    expect(pipelineFor(L({ customer_type: "hoa_condo" }))).toBe("commercial");
    expect(pipelineFor(L({ customer_type: "homeowner" }))).toBe("residential");
  });
  it("tags attribution and consent", () => {
    const t = tagsFor(L({ services: ["staining"], attribution: { gclid: "abc", utm_campaign: "Seal Before Freeze" } }));
    expect(t).toContain("paid:google");
    expect(t).toContain("sms:opt-in");
    expect(t).toContain("cmp:seal-before-freeze");
    expect(t).toContain("photos:requested");
  });
  it("scores property and urgent leads higher, bounded 0–100", () => {
    const a = scoreLead(L({}));
    const b = scoreLead(L({ form_type: "walkthrough", customer_type: "hoa_condo", company_name: "X", property_count: 25, timeline: "asap", photo_urls: ["p"] }));
    expect(b).toBeGreaterThan(a);
    expect(b).toBeLessThanOrEqual(100);
  });
});

describe("repair-or-replace checker", () => {
  const A = (o: Partial<CheckerAnswers>): CheckerAnswers => ({ age: "10-20", soft_boards: "no", rot_at_framing: "no", posts_move: "no", railings_loose: "no", stairs_issue: "no", surface_only: "yes", ...o });
  it("surface wear → repair candidate", () => expect(evaluateChecker(A({}))).toBe("repair_candidate"));
  it("any structural flag → inspection, even on old decks", () => {
    expect(evaluateChecker(A({ rot_at_framing: "yes" }))).toBe("inspection_recommended");
    expect(evaluateChecker(A({ age: "20+", posts_move: "yes", soft_boards: "yes", railings_loose: "yes" }))).toBe("inspection_recommended");
  });
  it("old deck with several non-structural issues → evaluate replacement", () => expect(evaluateChecker(A({ age: "20+", soft_boards: "yes", stairs_issue: "yes" }))).toBe("replacement_worth_evaluating"));
  it("unsure about structure → inspection", () => expect(evaluateChecker(A({ posts_move: "unsure" }))).toBe("inspection_recommended"));
});

describe("content integrity", () => {
  it("has 15 town pages with unique intros", () => {
    expect(TOWNS).toHaveLength(15);
    expect(new Set(TOWNS.map((t) => t.intro)).size).toBe(15);
    expect(new Set(TOWNS.map((t) => t.housing)).size).toBe(15);
  });
  it("never mentions sister brands", () => {
    const blob = JSON.stringify({ TOWNS, SERVICES }).toLowerCase();
    for (const banned of ["stonecraft", "sir grout", "franchise"]) expect(blob).not.toContain(banned);
  });
});
