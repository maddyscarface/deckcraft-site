import { describe, expect, it, vi, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
import { tierFor } from "@/config/lead-scoring";
import { ghlConfig, ghlApiReady } from "@/config/ghl";
import { followUpPlan, followUpTags, STAGE_SEQUENCES } from "@/lib/crm/follow-up";
import { contactBody, opportunityBody } from "@/lib/crm/ghl-map";
import { toLeadForGhl } from "@/lib/crm/lead-record";
import { channelOf, summarize, googleAdsOfflineCsv } from "@/lib/crm/attribution";
import { intentConfig, intentTags, datamoon, audiencelab } from "@/lib/intent/adapter";
import { syncLeadToGhl } from "@/lib/server/ghl-api";

const cfg = ghlConfig({
  GHL_API_TOKEN: "t", GHL_LOCATION_ID: "loc1",
  GHL_PIPELINE_RESIDENTIAL_ID: "pipeR", GHL_PIPELINE_COMMERCIAL_ID: "pipeC",
  GHL_STAGE_IDS: JSON.stringify({ residential: { new: "sR1", photos_received: "sR2" }, commercial: { inquiry: "sC1" } }),
  GHL_CUSTOM_FIELD_IDS: JSON.stringify({ dc_lead_score: "cf_score", dc_lead_tier: "cf_tier" }),
  GHL_WORKFLOW_IDS: JSON.stringify({ speed_to_lead: "wf1" }),
} as unknown as NodeJS.ProcessEnv);

describe("lead tiers", () => {
  it("maps scores to hot / warm / nurture", () => {
    expect(tierFor(90)).toBe("hot");
    expect(tierFor(70)).toBe("hot");
    expect(tierFor(50)).toBe("warm");
    expect(tierFor(10)).toBe("nurture");
  });
});

describe("follow-up plan", () => {
  it("hot homeowner without photos gets alert + photo reminder, sms only with consent", () => {
    const p = followUpPlan({ form_type: "assessment", sms_consent: false, photo_urls: [] }, "hot");
    expect(p.map((s) => s.key)).toEqual(["speed_to_lead", "hot_lead_alert", "photo_reminder", "no_response_recovery"]);
    expect(p.some((s) => s.channel.includes("sms"))).toBe(false);
    const q = followUpPlan({ form_type: "assessment", sms_consent: true, photo_urls: [] }, "warm");
    expect(q[0].channel).toBe("email+sms");
  });
  it("property managers get the walkthrough sequence; planning leads get nurture", () => {
    const p = followUpPlan({ form_type: "walkthrough", customer_type: "hoa_condo", sms_consent: false }, "warm");
    expect(p.map((s) => s.key)).toContain("property_walkthrough");
    const n = followUpPlan({ form_type: "assessment", timeline: "next_spring", sms_consent: false, photo_urls: ["x"] }, "warm");
    expect(n.map((s) => s.key)).toContain("long_nurture");
    expect(n.map((s) => s.key)).not.toContain("photo_reminder");
  });
  it("newsletter only gets the welcome; tags are wf:*", () => {
    const p = followUpPlan({ form_type: "newsletter", sms_consent: false }, "nurture");
    expect(followUpTags(p)).toEqual(["wf:newsletter_welcome"]);
    expect(STAGE_SEQUENCES.paid?.key).toBe("review_request");
  });
});

describe("GHL mapping", () => {
  const rec = { lead_id: "L1", email: "pat@example.com", first_name: "Pat", phone: "+16175550100", pipeline: "residential", lead_score: 82, tags: "deck,assessment", photo_count: 2, services: ["deck_repair"], town: "Newton" };
  it("builds a duplicate-safe contact upsert with scoring tags and mapped custom fields", () => {
    const l = toLeadForGhl(rec, ["wf:speed_to_lead"]);
    expect(l.tier).toBe("hot");
    expect(l.stage).toBe("photos_received");
    const b = contactBody(l, cfg);
    expect(b.locationId).toBe("loc1");
    expect(b.tags).toEqual(expect.arrayContaining(["deck", "wf:speed_to_lead", "score:82", "tier:hot", "brand:deckcraft"]));
    expect(new Set(b.tags).size).toBe(b.tags.length);
    expect(b.customFields).toEqual(expect.arrayContaining([{ id: "cf_score", field_value: "82" }, { id: "cf_tier", field_value: "hot" }]));
  });
  it("opportunity goes to the DeckCraft pipeline + stage; null when ids are missing", () => {
    const l = toLeadForGhl(rec);
    const o = opportunityBody(l, cfg, "c1") as Record<string, unknown>;
    expect(o).toMatchObject({ pipelineId: "pipeR", pipelineStageId: "sR2", contactId: "c1", locationId: "loc1", status: "open" });
    expect(opportunityBody(l, ghlConfig({ GHL_API_TOKEN: "t", GHL_LOCATION_ID: "x" } as unknown as NodeJS.ProcessEnv), "c1")).toBeNull();
    expect(opportunityBody({ ...l, pipeline: "none" }, cfg, "c1")).toBeNull();
  });
  it("log mode without credentials: no network, ok", async () => {
    const f = vi.spyOn(globalThis, "fetch");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const empty = ghlConfig({} as unknown as NodeJS.ProcessEnv);
    expect(ghlApiReady(empty)).toBe(false);
    const r = await syncLeadToGhl(toLeadForGhl(rec), [], empty);
    expect(r).toMatchObject({ mode: "log", ok: true });
    expect(f).not.toHaveBeenCalled();
    expect(String(info.mock.calls[0]?.[1])).not.toContain("pat@example.com");
  });
  it("api mode: contact upsert → opportunity upsert → workflow enrollment", async () => {
    const urls: string[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (u) => {
      urls.push(String(u));
      const body = String(u).includes("/contacts/upsert") ? { contact: { id: "c9" } } : String(u).includes("/opportunities/upsert") ? { opportunity: { id: "o9" } } : {};
      return new Response(JSON.stringify(body), { status: 200 });
    });
    const r = await syncLeadToGhl(toLeadForGhl(rec), [{ key: "speed_to_lead", channel: "email", why: "" }], cfg);
    expect(r).toMatchObject({ mode: "api", ok: true, contactId: "c9", opportunityId: "o9" });
    expect(urls[0]).toContain("/contacts/upsert");
    expect(urls[1]).toContain("/opportunities/upsert");
    expect(urls[2]).toContain("/contacts/c9/workflow/wf1");
  });
});

afterEach(() => vi.restoreAllMocks());

describe("attribution", () => {
  it("classifies channels by click id, UTM and referrer", () => {
    expect(channelOf({ gclid: "abc" })).toBe("google_ads");
    expect(channelOf({ fbclid: "x" })).toBe("meta_ads");
    expect(channelOf({ openai_oppref: "x" })).toBe("chatgpt_ads");
    expect(channelOf({ msclkid: "x" })).toBe("microsoft_ads");
    expect(channelOf({ referrer: "https://www.google.com/" })).toBe("organic_search");
    expect(channelOf({})).toBe("direct");
  });
  it("sums revenue per channel/campaign and exports a Google Ads offline CSV", () => {
    const leads = [
      { gclid: "G1", utm_campaign: "spring", revenue_won: 12000, won_at: "2026-05-01T14:00:00Z", form_type: "assessment" },
      { gclid: "G2", utm_campaign: "spring", form_type: "assessment" },
      { form_type: "newsletter", gclid: "G3" },
    ];
    const s = summarize(leads);
    expect(s[0]).toMatchObject({ channel: "google_ads", campaign: "spring", leads: 2, won: 1, revenue_won: 12000 });
    const csv = googleAdsOfflineCsv(leads, "Won Job").trim().split("\n");
    expect(csv).toHaveLength(3);
    expect(csv[2]).toBe("G1,Won Job,2026-05-01 14:00:00+0000,12000.00,USD");
  });
});

describe("intent adapter", () => {
  it("is disabled by default and needs a known provider", () => {
    expect(intentConfig({} as unknown as NodeJS.ProcessEnv).enabled).toBe(false);
    expect(intentConfig({ INTENT_ENABLED: "true" } as unknown as NodeJS.ProcessEnv).enabled).toBe(false);
    expect(intentConfig({ INTENT_ENABLED: "true", INTENT_PROVIDER: "datamoon" } as unknown as NodeJS.ProcessEnv).enabled).toBe(true);
  });
  it("normalizes provider payloads and always tags no-sms", () => {
    const d = datamoon.normalize({ person: { email: "A@B.com" }, intent_score: 88, topics: ["deck repair"] })!;
    expect(d.email).toBe("a@b.com");
    expect(intentTags(d)).toEqual(expect.arrayContaining(["intent:datamoon", "intent:high", "intent:no-sms", "intent-topic:deck-repair"]));
    const a = audiencelab.normalize({ PERSONAL_EMAIL: "x@y.co", SEGMENT: "fence,deck" })!;
    expect(a.topics).toEqual(["fence", "deck"]);
  });
});

describe("contact config", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
  it("hides the phone unless both display and E.164 numbers are set; email defaults to info@deckcraftbuild.com", async () => {
    vi.stubEnv("NEXT_PUBLIC_PHONE", "");
    vi.stubEnv("NEXT_PUBLIC_PHONE_E164", "");
    vi.resetModules();
    const a = await import("@/config/site");
    expect(a.site.phone).toBeFalsy();
    expect(a.site.email).toBe("info@deckcraftbuild.com");
    vi.stubEnv("NEXT_PUBLIC_PHONE", "(617) 555-0100");
    vi.resetModules();
    expect((await import("@/config/site")).site.phone).toBeFalsy();
    vi.stubEnv("NEXT_PUBLIC_PHONE_E164", "+16175550100");
    vi.resetModules();
    expect((await import("@/config/site")).site.phone).toBe("(617) 555-0100");
  });
});
