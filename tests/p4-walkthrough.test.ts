import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { isolate, params, req, staff } from "./p4-helpers";

beforeAll(() => { isolate(); });

const customer = { first_name: "Test", last_name: "Synthetic", email: "synthetic@example.test", town: "Haddonfield", zip: "08033" };
const progress = { answers: { material: ["composite"], notes: "Want a deck off the kitchen" }, footprint: [{ label: "Main", width: "12'", length: "16 ft" }], measures: { height_above_grade: { raw: "3' 6\"" }, stairs_count: { raw: "4" } } };

async function setup(service: "new_deck" | "deck_repair" | "fence" = "new_deck") {
  const svc = await import("@/lib/walkthrough/service");
  const project = await svc.createProject("deckcraft", { service, customer, source: "staff", actor: staff("owner") });
  const { token, session } = await svc.createInvite("deckcraft", project.id, { actor: staff("owner") });
  return { svc, project, token, session };
}

describe("customer walkthrough: token lifecycle and allowlisted responses", () => {
  it("unknown, malformed, revoked and expired links all get the same generic 404", async () => {
    const { GET } = await import("@/app/api/w/[token]/state/route");
    const { svc, token, session } = await setup();
    const ok = await GET(req(`/api/w/${token}/state`), params({ token }));
    expect(ok.status).toBe(200);
    expect(ok.headers.get("x-robots-tag")).toMatch(/noindex/);
    expect(ok.headers.get("cache-control")).toMatch(/no-store/);
    const bad = await GET(req(`/api/w/x/state`), params({ token: "nope" }));
    const unknown = await GET(req(`/api/w/z/state`), params({ token: "A".repeat(43) }));
    expect(bad.status).toBe(404); expect(unknown.status).toBe(404);
    const t1 = await bad.json(); const t2 = await unknown.json();
    expect(t1).toEqual(t2);
    // GET does not consume the token
    expect((await GET(req(`/api/w/${token}/state`), params({ token }))).status).toBe(200);
    await svc.revokeSession("deckcraft", session.id, staff("owner"));
    const revoked = await GET(req(`/api/w/${token}/state`), params({ token }));
    expect(revoked.status).toBe(404); expect(await revoked.json()).toEqual(t1);
    const { db } = await import("@/lib/p4/db");
    const s2 = await setup();
    await db.update("capture_sessions", "deckcraft", s2.session.id, { expires_at: new Date(Date.now() - 1000).toISOString() });
    expect((await GET(req(`/api/w/${s2.token}/state`), params({ token: s2.token }))).status).toBe(404);
  });

  it("raw token is never stored; only its hash", async () => {
    const { token, session } = await setup();
    expect(JSON.stringify(session)).not.toContain(token);
    const { dataDir } = await import("@/lib/p4/db");
    const { readdirSync } = await import("node:fs");
    const all = readdirSync(dataDir()).filter((f) => f.endsWith(".json")).map((f) => readFileSync(`${dataDir()}/${f}`, "utf8")).join("");
    expect(all).not.toContain(token);
  });

  it("save → resume → submit → correction creates immutable revisions and marks estimates stale", async () => {
    const { svc, project, token } = await setup();
    const P = await import("@/app/api/w/[token]/progress/route");
    const S = await import("@/app/api/w/[token]/submit/route");
    const C = await import("@/app/api/w/[token]/correct/route");
    const St = await import("@/app/api/w/[token]/state/route");
    const put = await P.PUT(req(`/api/w/${token}/progress`, { method: "PUT", body: JSON.stringify(progress) }), params({ token }));
    expect(put.status).toBe(200);
    const st = await (await St.GET(req(`/api/w/${token}/state`), params({ token }))).json();
    expect(st.progress.footprint[0].width).toBe("12'");
    expect(st.status).toBe("in_progress");
    const sub = await S.POST(req(`/api/w/${token}/submit`, { method: "POST" }), params({ token }));
    expect(sub.status).toBe(200);
    const again = await (await S.POST(req(`/api/w/${token}/submit`, { method: "POST" }), params({ token }))).json();
    expect(again.duplicate).toBe(true);
    const { db } = await import("@/lib/p4/db");
    const est = await (await import("@/lib/estimator/service")).createDraft("deckcraft", project.id, staff("estimator"));
    const late = await P.PUT(req(`/api/w/${token}/progress`, { method: "PUT", body: JSON.stringify(progress) }), params({ token }));
    expect((await late.json()).ok).toBe(false);
    const cor = await C.POST(req(`/api/w/${token}/correct`, { method: "POST", body: JSON.stringify({ measures: { height_above_grade: { raw: "4'" } }, correction_note: "Re-measured" }) }), params({ token }));
    expect(cor.status).toBe(200);
    const revs = await db.list("measurement_revisions", "deckcraft", { project_id: project.id }, { asc: true });
    expect(revs.map((r) => r.revision)).toEqual([1, 2]);
    expect((revs[0].normalized as { measures: { field: string; inches?: number }[] }).measures.find((m) => m.field === "height_above_grade")?.inches).toBe(42);
    expect((revs[1].normalized as { measures: { field: string; inches?: number }[] }).measures.find((m) => m.field === "height_above_grade")?.inches).toBe(48);
    expect((await db.get("estimates", "deckcraft", est.id))?.stale).toBe(true);
    const outbox = await db.list("event_outbox", "deckcraft", {});
    expect(outbox.map((e) => e.type)).toEqual(expect.arrayContaining(["capture.started", "capture.submitted", "capture.corrected"]));
    void svc;
  });

  it("customer state is allowlisted and price-free even when a priced estimate exists", async () => {
    const { project, token } = await setup();
    const E = await import("@/lib/estimator/service");
    const est = await E.createDraft("deckcraft", project.id, staff("owner"));
    await E.updateEstimate("deckcraft", est.id, { expected_version: 0, lines: [{ id: "l1", category: "labor", description: "Build", quantity: 10, unit: "hr", rate: 95, rate_source: "manual" }], adjustments: { minimum: 2500, mobilization: 150, waste_pct: 10, tax_pct: 6.625, margin_pct: 30 } }, staff("owner"));
    const St = await import("@/app/api/w/[token]/state/route");
    const body = await (await St.GET(req(`/api/w/${token}/state`), params({ token }))).json();
    const { findFinancialLeaks } = await import("@/lib/p4/leak");
    const { progress: _own, ...rest } = body;
    expect(findFinancialLeaks(rest)).toEqual([]);
    expect(Object.keys(rest).sort()).toEqual(["can_correct", "editable", "expires_at", "first_name", "intro", "kind", "media", "note", "ok", "service", "service_label", "status", "status_label", "steps", "submitted_at", "upload_mode"].sort());
    const s = JSON.stringify(body);
    for (const bad of ["95", "2500", "margin", "est_", "lead_id", "email", "token_hash", "customer_email_hash", "siteCheck"]) expect(s).not.toContain(bad);
  });

  it("follow-up link exposes only the requested steps", async () => {
    const { svc, project } = await setup("deck_repair");
    const { token } = await svc.createInvite("deckcraft", project.id, { kind: "followup", requested_steps: ["problem", "bogus"], note: "Closer photo of the post please", actor: staff("estimator") });
    const St = await import("@/app/api/w/[token]/state/route");
    const body = await (await St.GET(req(`/api/w/${token}/state`), params({ token }))).json();
    expect(body.steps.map((s: { id: string }) => s.id)).toEqual(["problem"]);
    expect(body.kind).toBe("followup");
  });
});

describe("uploads: chunked, sniffed, metadata stripped", () => {
  const jpeg = readFileSync("tests/fixtures/deck.jpg");
  const withExif = Buffer.concat([jpeg.subarray(0, 2), Buffer.from([0xff, 0xe1, 0x00, 0x10]), Buffer.from("Exif\0\0GPS-LAT!"), jpeg.subarray(2)]);

  it("accepts a real JPEG in chunks and strips EXIF; rejects disguised files and wrong kinds", async () => {
    const { token, project } = await setup();
    const I = await import("@/app/api/w/[token]/upload/route");
    const U = await import("@/app/api/w/[token]/upload/[id]/route");
    const D = await import("@/app/api/w/[token]/upload/[id]/complete/route");
    const init = await (await I.POST(req(`/api/w/${token}/upload`, { method: "POST", body: JSON.stringify({ step_id: "site_wide", mime: "image/jpeg", size: withExif.length, name: "IMG_1.jpg" }) }), params({ token }))).json();
    expect(init.ok).toBe(true); expect(init.mode).toBe("chunked");
    const half = Math.ceil(withExif.length / 2);
    // only send chunk 0 when the file needs one chunk; this fixture is small
    expect(init.chunks).toBe(1);
    const put = await U.PUT(req(`/api/w/${token}/upload/${init.upload_id}?index=0`, { method: "PUT", body: withExif }), params({ token, id: init.upload_id }));
    expect(put.status).toBe(200);
    const status = await (await U.GET(req(`/api/w/${token}/upload/${init.upload_id}`), params({ token, id: init.upload_id }))).json();
    expect(status.received).toEqual([0]);
    const done = await (await D.POST(req(`/api/w/${token}/upload/${init.upload_id}/complete`, { method: "POST" }), params({ token, id: init.upload_id }))).json();
    expect(done.ok).toBe(true);
    const { db, getObject } = await import("@/lib/p4/db");
    const media = await db.get("media_assets", "deckcraft", done.media_id);
    expect(media?.metadata).toBe("stripped");
    expect(media?.project_id).toBe(project.id);
    const stored = await getObject(String(media?.storage_path));
    expect(stored!.includes(Buffer.from("GPS-LAT!"))).toBe(false);
    void half;

    // wrong kind for the step
    const vid = await I.POST(req(`/api/w/${token}/upload`, { method: "POST", body: JSON.stringify({ step_id: "site_wide", mime: "video/mp4", size: 1000 }) }), params({ token }));
    expect(vid.status).toBe(415);
    // too large
    const big = await I.POST(req(`/api/w/${token}/upload`, { method: "POST", body: JSON.stringify({ step_id: "site_wide", mime: "image/jpeg", size: 26 * 1024 * 1024 }) }), params({ token }));
    expect(big.status).toBe(413);
    // HTML disguised as JPEG
    const html = Buffer.from("<html><script>alert(1)</script></html>".padEnd(200, " "));
    const i2 = await (await I.POST(req(`/api/w/${token}/upload`, { method: "POST", body: JSON.stringify({ step_id: "ground", mime: "image/jpeg", size: html.length }) }), params({ token }))).json();
    await U.PUT(req(`/x?index=0`, { method: "PUT", body: html }), params({ token, id: i2.upload_id }));
    const rej = await D.POST(req(`/x`, { method: "POST" }), params({ token, id: i2.upload_id }));
    expect(rej.status).toBe(415);
  });

  it("another session cannot touch an upload id it does not own", async () => {
    const a = await setup(); const b = await setup();
    const I = await import("@/app/api/w/[token]/upload/route");
    const U = await import("@/app/api/w/[token]/upload/[id]/route");
    const init = await (await I.POST(req(`/x`, { method: "POST", body: JSON.stringify({ step_id: "site_wide", mime: "image/jpeg", size: 1000 }) }), params({ token: a.token }))).json();
    const res = await U.GET(req(`/x`), params({ token: b.token, id: init.upload_id }));
    expect(res.status).toBe(404);
  });

  it("media helpers: sniffing and PNG text chunk removal", async () => {
    const M = await import("@/lib/uploads/media");
    expect(M.sniffMedia(new Uint8Array(jpeg.subarray(0, 64)))).toBe("image/jpeg");
    expect(M.sniffMedia(new Uint8Array(Buffer.from("GIF89a..........")))).toBeNull();
    const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from("ftypmp42"), Buffer.alloc(16)]);
    expect(M.sniffMedia(new Uint8Array(mp4))).toMatch(/video\//);
    const { stripJpegMetadata } = M;
    expect(stripJpegMetadata(withExif).removed).toBeGreaterThan(0);
    expect(M.validateDeclared("image", 0)).toBeTruthy();
  });
});

describe("units parsing", () => {
  it("parses common tape formats and refuses to guess", async () => {
    const { parseLength, parseCount, rectanglesAreaSqFt } = await import("@/lib/walkthrough/units");
    expect(parseLength("12'")?.inches).toBe(144);
    expect(parseLength("3' 6\"")?.inches).toBe(42);
    expect(parseLength("16 ft")?.inches).toBe(192);
    expect(parseLength("10 ft 3 in")?.inches).toBe(123);
    expect(parseLength("30 in")?.inches).toBe(30);
    expect(parseLength("2.5m")?.inches).toBeCloseTo(98.43, 1);
    expect(parseLength("banana")).toBeNull();
    expect(parseLength("-4")).toBeNull();
    expect(parseCount("4")).toBe(4);
    expect(parseCount("lots")).toBeNull();
    expect(rectanglesAreaSqFt([{ width_in: 144, length_in: 192 }])).toBe(192);
  });
});

describe("storage gating", () => {
  it("refuses the walkthrough in Vercel production without durable storage; previews stay in flagged demo mode", async () => {
    const { walkthroughStorageAllowed, durableStorage } = await import("@/lib/p4/db");
    const { POST } = await import("@/app/api/walkthrough/start/route");
    Object.assign(process.env, { VERCEL: "1", VERCEL_ENV: "production" });
    try {
      expect(durableStorage()).toBe(false);
      expect(walkthroughStorageAllowed()).toBe(false);
      const r = await POST(req("/api/walkthrough/start", { method: "POST", body: JSON.stringify({ service: "new_deck" }) }));
      expect(r.status).toBe(503);
      process.env.VERCEL_ENV = "preview";
      expect(walkthroughStorageAllowed()).toBe(true);
    } finally { delete process.env.VERCEL; delete process.env.VERCEL_ENV; }
  });
});
