// Phase 4 e2e: mobile guided walkthrough at 375/390/768 + admin smoke (local only).
// Start the app with ADMIN_PASSWORD=<pw> P4_DATA_DIR=<tmp> then: ADMIN_PASSWORD=<pw> node tests/e2e-walkthrough.mjs
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";
const SHOTS = process.env.SHOTS_DIR || "tests/screens/phase4";
const PW = process.env.ADMIN_PASSWORD;
fs.mkdirSync(SHOTS, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const results = [];
const ok = (n) => { results.push(`PASS ${n}`); console.log("PASS", n); };
const noOverflow = async (page, where) => { const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); assert.ok(o <= 1, `horizontal overflow ${o}px at ${where}`); };
const noPrices = async (page, where) => { const t = await page.evaluate(() => document.body.innerText); assert.ok(!/\$\s?\d/.test(t), `price visible at ${where}`); };
let firstProjectToken = null;

try {
  for (const [w, h] of [[375, 812], [390, 844], [768, 1024]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: w < 700, hasTouch: true });
    const page = await ctx.newPage();
    globalThis.__page = page;
    page.on("response", (r) => { if (r.url().includes("/api/") && r.status() >= 400) console.log("HTTP", r.status(), r.request().method(), r.url().replace(/\/w\/[^/]+/, "/w/<token>")); });
    await page.goto(`${BASE}/walkthrough/start?service=new_deck`);
    const f = page.getByTestId("walkthrough-start");
    await f.getByTestId("svc-new_deck").click();
    await f.locator("#first_name").fill("Synthetic");
    await f.locator("#email").fill(`synthetic.${w}@example.com`);
    await f.locator("#phone").fill("(617) 555-0199");
    await f.locator("#town").fill("Newton");
    for (const cb of await f.getByRole("checkbox").all()) await cb.check();
    await noOverflow(page, `start ${w}`); await noPrices(page, `start ${w}`);
    if (w === 390) await page.screenshot({ path: `${SHOTS}/walkthrough-start-${w}.png`, fullPage: true });
    await page.waitForTimeout(2600);
    await f.getByTestId("walkthrough-start-submit").click();
    await page.waitForURL(/\/w\/[A-Za-z0-9_-]{30,}/, { timeout: 20000 });
    const token = page.url().split("/w/")[1];
    firstProjectToken ??= token;
    await page.getByTestId("wt-begin").waitFor();
    if (w === 390) await page.screenshot({ path: `${SHOTS}/walkthrough-intro-${w}.png` });
    await page.getByTestId("wt-begin").click();

    // Required step gate
    await page.getByTestId("wt-next").click();
    await page.getByText("This step is needed").waitFor();
    for (const step of ["site_wide", "house_wall", "ground"]) {
      await page.getByTestId(`file-${step}`).setInputFiles("tests/fixtures/deck.jpg");
      await page.getByTestId(`wt-step-${step}`).getByTestId("media-item").first().waitFor({ timeout: 20000 });
      if (w === 390 && step === "site_wide") await page.screenshot({ path: `${SHOTS}/walkthrough-photo-${w}.png` });
      await page.getByTestId("wt-next").click();
    }
    await page.getByTestId("wt-step-access").waitFor(); await page.getByTestId("wt-next").click();
    await page.getByTestId("rect-0-w").fill("12'");
    await page.getByTestId("rect-0-l").fill("16 ft");
    await page.getByTestId("area").filter({ hasText: "192 sq ft" }).waitFor();
    if (w === 390) await page.screenshot({ path: `${SHOTS}/walkthrough-measure-${w}.png` });
    await page.getByTestId("save-status").filter({ hasText: "Saved" }).waitFor({ timeout: 10000 });
    // Resume: reload and land back on the same step with values intact
    await page.reload();
    await page.getByTestId("wt-step-footprint").waitFor({ timeout: 10000 }).catch(async () => { await page.getByTestId("wt-begin").click(); await page.getByTestId("wt-step-footprint").waitFor(); });
    assert.equal(await page.getByTestId("rect-0-w").inputValue(), "12'");
    await page.getByTestId("wt-next").click();
    await page.locator("#m-height_above_grade").fill(`3' 6"`);
    await page.locator("#m-stairs_count").fill("4");
    await page.getByTestId("wt-next").click();
    await page.getByTestId("choice-material-composite").click();
    await page.getByTestId("wt-next").click();
    while (!(await page.getByTestId("wt-review").count())) await page.getByTestId("wt-next").click();
    await noOverflow(page, `review ${w}`); await noPrices(page, `review ${w}`);
    if (w === 390) await page.screenshot({ path: `${SHOTS}/walkthrough-review-${w}.png`, fullPage: true });
    await page.getByTestId("wt-submit").click();
    await page.getByTestId("wt-done").waitFor({ timeout: 20000 });
    await noPrices(page, `done ${w}`);
    if (w === 390) await page.screenshot({ path: `${SHOTS}/walkthrough-done-${w}.png` });
    // Correction after submit
    await page.getByTestId("wt-correct-open").click();
    await page.getByTestId("correction-note").fill("Re-measured: threshold is 3' 8\".");
    await page.getByTestId("correction-send").click();
    await page.getByRole("status").filter({ hasText: "added that" }).waitFor();
    // Privacy headers on the customer page
    const res = await fetch(`${BASE}/w/${token}`);
    assert.match(res.headers.get("x-robots-tag") || "", /noindex/);
    assert.equal(res.headers.get("referrer-policy"), "no-referrer");
    assert.match(res.headers.get("cache-control") || "", /no-store/);
    const html = await res.text();
    assert.ok(!/googletagmanager|connect\.facebook\.net|bzrcdn/.test(html), "no tracking scripts on /w");
    ok(`walkthrough ${w}px: start → photos → footprint (192 sq ft) → resume after reload → heights → review → submit → correction; no overflow, no prices, private headers`);
    await ctx.close();
  }

  // Unknown token → generic gone page
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const r = await page.goto(`${BASE}/w/${"x".repeat(43)}`);
    assert.ok([200, 404].includes(r.status()));
    await page.getByTestId("link-gone").waitFor();
    const api = await fetch(`${BASE}/api/w/${"x".repeat(43)}/state`);
    assert.equal(api.status, 404);
    ok("unknown walkthrough link → generic 'no longer active' page, API 404");
    await ctx.close();
  }

  // Admin smoke
  {
    const anon = await fetch(`${BASE}/admin/projects`);
    assert.ok([401, 503].includes(anon.status), `anon admin ${anon.status}`);
    const anonApi = await fetch(`${BASE}/admin/api/p4/projects`);
    assert.ok([401, 503].includes(anonApi.status));
    if (!PW) { console.log("SKIP admin UI smoke (no ADMIN_PASSWORD)"); }
    else {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, httpCredentials: { username: "owner", password: PW } });
      const page = await ctx.newPage();
      page.on("dialog", (d) => d.accept());
      await page.goto(`${BASE}/admin/projects`);
      await page.getByRole("link", { name: /Synthetic/ }).first().click();
      await page.waitForURL(/\/admin\/projects\/prj_/);
      await page.getByText("192").first().waitFor();
      await page.screenshot({ path: `${SHOTS}/admin-project.png`, fullPage: true });
      await page.getByTestId("create-estimate").click();
      await page.getByRole("link", { name: /^R1$/ }).waitFor({ timeout: 10000 });
      await page.getByRole("link", { name: /^R1$/ }).click();
      await page.getByTestId("estimate-editor").waitFor();
      await page.getByTestId("estimate-incomplete").waitFor();
      const n = await page.locator('[data-testid^="line-"][data-testid$="-rate"]').count();
      assert.ok(n > 0, "draft has lines from the capture");
      for (let i = 0; i < n; i++) { await page.getByTestId(`line-${i}-qty`).fill("1"); await page.getByTestId(`line-${i}-rate`).fill("100"); }
      await page.getByTestId("estimate-save").click();
      await page.getByTestId("estimate-total").waitFor({ timeout: 10000 });
      await page.getByTestId("estimate-approve").click();
      await page.getByTestId("estimate-export").waitFor({ timeout: 10000 });
      await page.getByTestId("estimate-export").click();
      await page.getByTestId("download-pdf").waitFor({ timeout: 15000 });
      const pdfHref = await page.getByTestId("download-pdf").getAttribute("href");
      const pdf = await page.request.get(BASE + pdfHref);
      assert.equal(pdf.status(), 200);
      assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
      await page.screenshot({ path: `${SHOTS}/admin-estimate.png`, fullPage: true });
      // The customer still sees no price after export
      const st = await (await fetch(`${BASE}/api/w/${firstProjectToken}/state`)).text();
      assert.ok(!/\$\s?\d|"total"|"rate"|margin/.test(st), "customer state price-free after export");
      for (const p of ["/admin", "/admin/search?q=Synthetic", "/admin/leads", "/admin/pricebook", "/admin/crm", "/admin/suppressions", "/admin/reports", "/admin/audit", "/admin/integrations", "/admin/staff", "/admin/datamoon"]) {
        const r = await page.goto(BASE + p);
        assert.equal(r.status(), 200, p);
      }
      await page.goto(`${BASE}/admin/datamoon`);
      await page.getByTestId("dm-mock-run").click();
      await page.getByTestId("dm-mock").getByText(/committed/).first().waitFor({ timeout: 10000 });
      await page.screenshot({ path: `${SHOTS}/admin-datamoon.png`, fullPage: true });
      await page.goto(`${BASE}/admin/audit`);
      await page.getByText("Hash chain verified").waitFor();
      await page.goto(`${BASE}/admin/integrations`);
      await page.screenshot({ path: `${SHOTS}/admin-integrations.png`, fullPage: true });
      ok("admin smoke: project with walkthrough measurements → draft estimate (incomplete until rates) → manual rates → approve → private PDF export; customer still price-free; all admin pages 200; DataMoon synthetic mock run; audit chain verified");
      await ctx.close();
    }
  }
} catch (e) {
  console.error("FAIL", e);
  if (globalThis.__page) await globalThis.__page.screenshot({ path: `${SHOTS}/FAIL.png`, fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync("tests/e2e-walkthrough-results.txt", results.join("\n") + "\n");
}
