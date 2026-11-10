// End-to-end: real browser → Next.js server → lead store → mock GHL webhook.
// Run: start the app with GHL_WEBHOOK_URL=http://127.0.0.1:4555/hook, then `node tests/e2e.mjs`.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import http from "node:http";
import assert from "node:assert/strict";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";
const received = [];
const ghl = http.createServer((req, res) => {
  let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { try { received.push(JSON.parse(b)); } catch {} res.end("ok"); });
}).listen(4555);

const browser = await chromium.launch();
const results = [];
const ok = (name) => { results.push(`PASS ${name}`); console.log("PASS", name); };

async function dlEvents(page, name) {
  return page.evaluate((n) => (window.__dlLog || []).filter((e) => e.event === n), name);
}
async function newPage(ctx) {
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__dlLog = JSON.parse(sessionStorage.getItem("__dlLog") || "[]");
    const orig = Array.prototype.push;
    const hook = () => {
      if (!window.dataLayer || window.dataLayer.__hooked) return;
      window.dataLayer.__hooked = true;
      window.dataLayer.push = function (...a) { for (const e of a) if (e && e.event) { window.__dlLog.push(e); sessionStorage.setItem("__dlLog", JSON.stringify(window.__dlLog)); } return orig.apply(this, a); };
    };
    window.dataLayer = window.dataLayer || []; hook();
    setInterval(hook, 50);
  });
  return page;
}

try {
  // 1. Homeowner photo assessment, 4 steps, with UTM + gclid attribution
  {
    const ctx = await browser.newContext();
    const page = await newPage(ctx);
    await page.goto(`${BASE}/services/deck-repair?utm_source=google&utm_medium=cpc&utm_campaign=deck-repair-newton&gclid=TEST-GCLID-1`);
    await page.goto(`${BASE}/free-assessment?service=deck_repair`);
    const f = page.getByTestId("assessment-form");
    await f.locator("#first_name").fill("Test");
    await f.locator("#last_name").fill("Homeowner");
    await f.locator("#email").fill("test.homeowner@example.com");
    await f.locator("#phone").fill("(617) 555-0142");
    await f.getByRole("checkbox").check();
    await page.waitForTimeout(2600); // human-speed (bot guard is 2.5s)
    await f.getByRole("button", { name: "Continue" }).click();
    await f.locator("#town").fill("Newton");
    await f.locator("#timeline").selectOption("this_season");
    await f.getByRole("button", { name: "Continue" }).click();
    await f.getByTestId("file-input").setInputFiles(["tests/fixtures/deck.jpg", "tests/fixtures/deck.jpg"]);
    await f.getByRole("button", { name: "Continue" }).click();
    await f.locator("#message").fill("Soft spot near the stairs.");
    await f.getByRole("button", { name: /Send My Photos/ }).click();
    await page.waitForURL(/thank-you\?type=assessment/, { timeout: 20000 });
    await page.getByTestId("lead-success").waitFor();
    const leads = await dlEvents(page, "generate_lead");
    assert.equal(leads.length, 1, "exactly one generate_lead");
    assert.match(leads[0].event_id, /^lead_/);
    assert.equal((await dlEvents(page, "photo_upload_success")).length, 1);
    assert.equal((await dlEvents(page, "form_start")).length, 1);
    await page.waitForTimeout(500);
    const p = received.find((r) => r.event_id === leads[0].event_id);
    assert.ok(p, "GHL received payload with same event_id");
    assert.equal(p.gclid, "TEST-GCLID-1");
    assert.equal(p.utm_campaign, "deck-repair-newton");
    assert.equal(p.landing_page, "/services/deck-repair");
    assert.equal(p.funnel, "A_deck_repair");
    assert.equal(p.pipeline, "residential");
    assert.equal(p.photo_count, 2);
    assert.equal(p.sms_consent, true);
    assert.ok(p.tags.includes("photos:received") && p.tags.includes("paid:google"));
    await page.reload();
    assert.equal((await dlEvents(page, "generate_lead")).length, 1, "no duplicate on reload");
    ok("homeowner assessment → thank-you, 1 generate_lead, GHL payload with attribution + photos, no dup on reload");
    globalThis.firstEventId = leads[0].event_id;
    await ctx.close();
  }

  // 2. Idempotency: replaying the same event_id returns the original lead
  {
    const before = received.length;
    const r = await fetch(`${BASE}/api/leads`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ form_type: "assessment", event_id: globalThis.firstEventId, email: "test.homeowner@example.com", first_name: "Test", phone: "6175550142", elapsed_ms: 9000 }) });
    const j = await r.json();
    assert.equal(j.duplicate, true);
    assert.equal(received.length, before, "no second GHL post");
    ok("idempotent replay: duplicate=true, no second GHL post");
  }

  // 3. Property walkthrough with URL prefill from the planner
  {
    const ctx = await browser.newContext();
    const page = await newPage(ctx);
    await page.goto(`${BASE}/portfolio-inspection-planner`);
    await page.getByTestId("planner").getByRole("button", { name: "More properties" }).click();
    const days = await page.getByTestId("planner-output").locator("p").nth(1).innerText();
    assert.equal(days.trim(), "2", "11 properties at 8/day = 2 days");
    await page.getByTestId("planner").getByRole("link", { name: "Book a Walkthrough" }).click();
    await page.waitForURL(/request-walkthrough\?properties=11&type=condo/);
    const f = page.getByTestId("walkthrough-form");
    await f.locator("#w_first").fill("Board");
    await f.locator("#w_last").fill("Member");
    await f.locator("#w_company").fill("Test Elm Street Condo Trust");
    await f.locator("#w_role").selectOption("Board member");
    await f.locator("#w_email").fill("board@example.com");
    await f.locator("#w_phone").fill("617-555-0199");
    await page.waitForTimeout(2600);
    await f.getByRole("button", { name: "Continue" }).click();
    assert.equal(await f.locator("#w_props").inputValue(), "11");
    await f.locator("#w_towns").fill("Brookline"); await f.getByRole("button", { name: "Add" }).click();
    await f.getByRole("button", { name: "Continue" }).click();
    await f.getByRole("checkbox", { name: "Annual inspection" }).click();
    await f.locator("#w_budget").selectOption("Board vote required");
    await f.getByRole("button", { name: "Continue" }).click();
    await f.getByRole("button", { name: "Skip files" }).click();
    await f.locator("#w_window").fill("Weekday mornings");
    await f.getByRole("button", { name: "Request My Walkthrough" }).click();
    await page.waitForURL(/thank-you\?type=walkthrough/, { timeout: 20000 });
    assert.equal((await dlEvents(page, "walkthrough_request")).length, 1);
    const ev = (await dlEvents(page, "generate_lead"))[0];
    await page.waitForTimeout(300);
    const p = received.find((r) => r.event_id === ev.event_id);
    assert.equal(p.pipeline, "commercial");
    assert.equal(p.funnel, "E_property_programs");
    assert.equal(p.customer_type, "hoa_condo");
    assert.equal(p.property_count, 11);
    assert.ok(p.lead_score >= 60, `property lead scored ${p.lead_score}`);
    ok("planner → walkthrough prefill → commercial pipeline, walkthrough_request fired");
    await ctx.close();
  }

  // 4. Repair-or-Replace Checker result + safety disclaimer
  {
    const ctx = await browser.newContext();
    const page = await newPage(ctx);
    await page.goto(`${BASE}/repair-or-replace`);
    const c = page.getByTestId("checker");
    const answers = ["Over 20 years", "No", "Yes", "Yes", "No", "No", "No"];
    for (const a of answers) await c.getByRole("button", { name: a, exact: true }).first().click();
    const res = await page.getByTestId("checker-result").innerText();
    assert.match(res, /Professional Inspection Recommended/);
    assert.match(res, /not an inspection/);
    assert.equal((await dlEvents(page, "tool_complete")).length, 1);
    ok("checker: structural flag → Professional Inspection Recommended + disclaimer");
    await ctx.close();
  }

  // 5. Validation + honeypot + SEO basics
  {
    const bad = await fetch(`${BASE}/api/leads`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ form_type: "assessment", event_id: "lead_badbadbad", email: "nope" }) });
    assert.equal(bad.status, 422);
    const hp = await fetch(`${BASE}/api/leads`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ form_type: "assessment", event_id: "lead_honeypot1", email: "a@b.co", first_name: "x", phone: "6175550100", website: "spam" }) });
    assert.equal((await hp.json()).id, "ignored");
    const up = new FormData(); up.append("file", new Blob(["MZ fake exe"], { type: "image/jpeg" }), "evil.jpg");
    assert.equal((await fetch(`${BASE}/api/upload`, { method: "POST", body: up })).status, 415);
    const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
    assert.ok(sm.includes("/newton") && sm.includes("/blog/deck-repair-cost-boston"));
    const home = await (await fetch(`${BASE}/`)).text();
    assert.ok(home.includes('"@type":"HomeAndConstructionBusiness"') && !home.includes("aggregateRating"));
    assert.ok(!/stonecraft|sir grout/i.test(home));
    const wh = await fetch(`${BASE}/api/crm-webhook`, { method: "POST", body: "{}" });
    assert.equal(wh.status, 401);
    ok("422 on bad input, honeypot silently ignored, spoofed upload rejected (415), sitemap/schema OK, CRM webhook requires secret");
  }

  // 6. Screenshots
  fs.mkdirSync("tests/screens", { recursive: true });
  for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const path of ["/", "/free-assessment", "/hoa-condo", "/newton"]) {
      await page.goto(BASE + path);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `tests/screens/${name}${path === "/" ? "-home" : path.replace(/\//g, "-")}.png`, fullPage: path === "/" });
    }
    await ctx.close();
  }
  ok("screenshots written");
} catch (e) {
  console.error("FAIL", e);
  process.exitCode = 1;
} finally {
  await browser.close();
  ghl.close();
  fs.writeFileSync("tests/e2e-results.txt", results.join("\n") + "\n");
}
