import { beforeAll, describe, expect, it } from "vitest";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { isolate, staff } from "./p4-helpers";
import { can, ROLES, PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/p4/rbac";

const E = (o: Record<string, string> = {}) => o as unknown as NodeJS.ProcessEnv;
beforeAll(() => { isolate(); });

describe("RBAC: deny by default, brand scoped", () => {
  it("unknown role, missing brand or unlisted permission are all denied", () => {
    expect(can(null, "leads.read", "deckcraft")).toBe(false);
    expect(can({ user: "x", role: "superuser" as never, brands: ["deckcraft"] }, "leads.read", "deckcraft")).toBe(false);
    expect(can(staff("owner", ["dumpsterbuddy"]), "leads.read", "deckcraft")).toBe(false);
    expect(can(staff("owner"), "leads.read", "dumpsterbuddy")).toBe(false);
    expect(can(staff("owner"), "pricebook.write", "deckcraft")).toBe(true);
  });
  it("only the owner can approve, export, edit the price book or see margins by default", () => {
    for (const p of ["proposal.approve", "proposal.export", "pricebook.write", "estimate.margin.read", "reports.financial"] as const)
      expect(ROLES.filter((r) => ROLE_PERMISSIONS[r].has(p))).toEqual(["owner"]);
  });
  it("read_only and marketer cannot write estimates, see PII or export CSV", () => {
    for (const r of ["read_only", "marketer"] as const) for (const p of ["estimate.write", "pii.read", "leads.export_csv", "media.read"] as const) expect(can(staff(r), p, "deckcraft")).toBe(false);
  });
  it("every role's permissions are known permissions", () => {
    for (const r of ROLES) for (const p of ROLE_PERMISSIONS[r]) expect(PERMISSIONS).toContain(p);
  });
  it("ADMIN_USERS_JSON accounts authenticate with PBKDF2 and keep their role/brands", async () => {
    const { staffFromAuthorization } = await import("@/lib/p4/auth");
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync("correct horse", Buffer.from(salt, "hex"), 100000, 32, "sha256").toString("hex");
    const env = E({ ADMIN_USERS_JSON: JSON.stringify([{ user: "maria", role: "estimator", brands: ["deckcraft"], pbkdf2: `${salt}:100000:${hash}` }]) });
    const b = (u: string, p: string) => `Basic ${Buffer.from(`${u}:${p}`).toString("base64")}`;
    expect(staffFromAuthorization(b("maria", "correct horse"), env)).toEqual({ user: "maria", role: "estimator", brands: ["deckcraft"] });
    expect(staffFromAuthorization(b("maria", "wrong"), env)).toBeNull();
    expect(staffFromAuthorization(b("anyone", "x"), env)).toBeNull();
    expect(staffFromAuthorization(b("x", "pw"), E({ ADMIN_PASSWORD: "pw" }))?.role).toBe("owner");
    expect(staffFromAuthorization("Bearer abc", E({ ADMIN_PASSWORD: "pw" }))).toBeNull();
  });
  it("admin API routes return 401 without credentials and 403 for a role without the permission", async () => {
    process.env.ADMIN_PASSWORD = "owner-pw";
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync("ro-pw", Buffer.from(salt, "hex"), 100000, 32, "sha256").toString("hex");
    process.env.ADMIN_USERS_JSON = JSON.stringify([{ user: "ro", role: "read_only", brands: ["deckcraft"], pbkdf2: `${salt}:100000:${hash}` }, { user: "other", role: "owner", brands: ["dumpsterbuddy"], pbkdf2: `${salt}:100000:${hash}` }]);
    const { GET } = await import("@/app/admin/api/p4/pricebook/route");
    const call = (h?: string) => GET(new Request("http://localhost/admin/api/p4/pricebook", { headers: h ? { authorization: h } : {} }), {} as never);
    expect((await call()).status).toBe(401);
    expect((await call(`Basic ${Buffer.from("ro:ro-pw").toString("base64")}`)).status).toBe(403);
    expect((await call(`Basic ${Buffer.from("other:ro-pw").toString("base64")}`)).status).toBe(403); // owner of another brand
    expect((await call(`Basic ${Buffer.from("x:owner-pw").toString("base64")}`)).status).toBe(200);
    delete process.env.ADMIN_PASSWORD; delete process.env.ADMIN_USERS_JSON;
  });
  it("store reads are brand scoped", async () => {
    const { db } = await import("@/lib/p4/db");
    const p = await db.insert("projects", "deckcraft", { status: "new", service: "new_deck" });
    expect(await db.get("projects", "dumpsterbuddy", p.id)).toBeNull();
    expect(await db.list("projects", "dumpsterbuddy", {})).toEqual([]);
  });
});

describe("private estimator", () => {
  async function project() {
    const svc = await import("@/lib/walkthrough/service");
    const p = await svc.createProject("deckcraft", { service: "new_deck", customer: { first_name: "Syn", email: "syn@example.test", town: "Cherry Hill" }, source: "staff", actor: staff("owner") });
    return p;
  }
  const lines = [{ id: "l1", category: "materials", description: "Decking", quantity: 192, unit: "sq ft", rate: 10, rate_source: "manual" }, { id: "l2", category: "labor", description: "Build", quantity: 40, unit: "hr", rate: 80, rate_source: "manual" }];

  it("never produces a figure while any rate is blank; price book ships blank", async () => {
    const E = await import("@/lib/estimator/service");
    const { compute } = await import("@/lib/estimator/model");
    expect(compute([{ ...lines[0], rate: null } as never], { minimum: null, mobilization: null, waste_pct: null, tax_pct: null, margin_pct: null }).complete).toBe(false);
    expect(await E.listPricebook("deckcraft", staff("owner"))).toEqual([]);
    const p = await project();
    const est = await E.createDraft("deckcraft", p.id, staff("estimator"));
    expect((est.lines as { rate: number | null }[]).every((l) => l.rate === null)).toBe(true);
    await expect(E.approveInternal("deckcraft", est.id, staff("owner"))).rejects.toThrow(/Missing rates|need a manual/);
  });

  it("estimator can draft but not approve, export or see margin; owner approves then exports DOCX+PDF privately", async () => {
    const E = await import("@/lib/estimator/service");
    const p = await project();
    const est = await E.createDraft("deckcraft", p.id, staff("estimator"));
    const upd = await E.updateEstimate("deckcraft", est.id, { expected_version: 0, lines, adjustments: { minimum: null, mobilization: 200, waste_pct: 10, tax_pct: 6.625, margin_pct: 25 } }, staff("estimator"));
    expect((upd.adjustments as { margin_pct: number | null }).margin_pct).toBeNull(); // estimator cannot set margin
    const view = E.staffEstimateView(upd, staff("estimator"), "deckcraft");
    expect(view.can_see_margin).toBe(false);
    expect("margin_amount" in view.calc).toBe(false);
    expect("margin_pct" in view.adjustments).toBe(false);
    await expect(E.approveInternal("deckcraft", est.id, staff("estimator"))).rejects.toThrow(/Forbidden/);
    await expect(E.updateEstimate("deckcraft", est.id, { expected_version: 0, notes_internal: "stale write" }, staff("owner"))).rejects.toThrow(/Someone else saved/);
    await E.updateEstimate("deckcraft", est.id, { expected_version: 1, adjustments: { minimum: null, mobilization: 200, waste_pct: 10, tax_pct: 6.625, margin_pct: 25 } }, staff("owner"));
    await expect(E.exportProposal("deckcraft", est.id, staff("owner"))).rejects.toThrow(/Approve/);
    await E.approveInternal("deckcraft", est.id, staff("owner"));
    await expect(E.exportProposal("deckcraft", est.id, staff("manager"))).rejects.toThrow(/Forbidden/);
    const out = await E.exportProposal("deckcraft", est.id, staff("owner"));
    expect(out.map((o) => o.format).sort()).toEqual(["docx", "pdf"]);
    const { getObject, db } = await import("@/lib/p4/db");
    const docx = await getObject(String(out.find((o) => o.format === "docx")!.storage_path));
    const pdf = await getObject(String(out.find((o) => o.format === "pdf")!.storage_path));
    expect(docx!.subarray(0, 2).toString()).toBe("PK");
    expect(pdf!.subarray(0, 5).toString()).toBe("%PDF-");
    // nothing was sent: the outbox has an export event but no send/email event types
    const types = (await db.list("event_outbox", "deckcraft", {})).map((e) => String(e.type));
    expect(types).toContain("proposal.exported");
    expect(types.some((t) => /email|send|sms/.test(t) && t !== "proposal.marked_sent_externally")).toBe(false);
    // an edit after approval returns it to draft and blocks export until re-approved
    const cur = await db.get("estimates", "deckcraft", est.id);
    await E.updateEstimate("deckcraft", est.id, { expected_version: Number(cur!.version), exclusions: "Changed" }, staff("owner"));
    expect((await db.get("estimates", "deckcraft", est.id))?.status).toBe("draft");
    await expect(E.exportProposal("deckcraft", est.id, staff("owner"))).rejects.toThrow(/Approve/);
  });

  it("a customer correction makes the estimate stale and blocks approval until refreshed", async () => {
    const E = await import("@/lib/estimator/service");
    const svc = await import("@/lib/walkthrough/service");
    const p = await project();
    const est = await E.createDraft("deckcraft", p.id, staff("owner"));
    await E.updateEstimate("deckcraft", est.id, { expected_version: 0, lines }, staff("owner"));
    await svc.recordRevision("deckcraft", p.id, null, { answers: {}, footprint: [], measures: { height_above_grade: { raw: "5'" } } }, "correction", "customer");
    await expect(E.approveInternal("deckcraft", est.id, staff("owner"))).rejects.toThrow(/walkthrough changed/);
    await E.refreshFromCapture("deckcraft", est.id, staff("owner"));
    await expect(E.approveInternal("deckcraft", est.id, staff("owner"))).resolves.toHaveProperty("hash");
  });

  it("audit log is hash-chained and contains no prices", async () => {
    const { db } = await import("@/lib/p4/db");
    const { verifyAuditChain } = await import("@/lib/p4/audit");
    const rows = await db.list("audit_log", "deckcraft", {}, { limit: 1000 });
    expect(rows.length).toBeGreaterThan(5);
    expect(verifyAuditChain(rows)).toBe(true);
    expect(JSON.stringify(rows.map((r) => r.detail))).not.toMatch(/\$\d|"rate"|margin_pct/);
  });
});
