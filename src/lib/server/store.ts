import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "./env";

/**
 * Lead store. Supabase (service role, server-side only) when configured;
 * otherwise a local JSON file for development. The local fallback refuses to run in production.
 */
export type StoredLead = Record<string, unknown> & {
  id: string;
  created_at: string;
  event_id: string;
  form_type: string;
  email: string;
  ghl_sync_status: "pending" | "sent" | "failed" | "skipped";
  ghl_attempts?: number;
  status: string;
};

// Vercel/serverless filesystems are read-only except /tmp.
const DATA_DIR = process.env.VERCEL ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data");
const LOCAL = path.join(DATA_DIR, "leads.json");

async function readLocal(): Promise<StoredLead[]> {
  try { return JSON.parse(await fs.readFile(LOCAL, "utf8")); } catch { return []; }
}
async function writeLocal(rows: StoredLead[]) {
  await fs.mkdir(path.dirname(LOCAL), { recursive: true });
  await fs.writeFile(LOCAL, JSON.stringify(rows, null, 2));
}

function sb(pathname: string, init: RequestInit = {}) {
  return fetch(`${env.supabaseUrl}/rest/v1/${pathname}`, {
    ...init,
    headers: {
      apikey: env.supabaseServiceKey!,
      Authorization: `Bearer ${env.supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

const useSupabase = () => Boolean(env.supabaseUrl && env.supabaseServiceKey);

function assertDevFallback() {
  if (env.isProd && !process.env.ALLOW_LOCAL_STORE) {
    throw new Error("Lead store not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
}

export async function findByEventId(eventId: string): Promise<StoredLead | null> {
  if (useSupabase()) {
    const r = await sb(`leads?event_id=eq.${encodeURIComponent(eventId)}&select=*&limit=1`);
    if (!r.ok) throw new Error(`Supabase read failed ${r.status}`);
    const rows = (await r.json()) as StoredLead[];
    return rows[0] ?? null;
  }
  assertDevFallback();
  return (await readLocal()).find((l) => l.event_id === eventId) ?? null;
}

export async function insertLead(row: Omit<StoredLead, "id" | "created_at">): Promise<StoredLead> {
  if (useSupabase()) {
    const r = await sb("leads", { method: "POST", body: JSON.stringify(row) });
    if (!r.ok) throw new Error(`Supabase insert failed ${r.status}: ${await r.text()}`);
    return ((await r.json()) as StoredLead[])[0];
  }
  assertDevFallback();
  const rows = await readLocal();
  const full: StoredLead = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() } as StoredLead;
  rows.push(full);
  await writeLocal(rows);
  return full;
}

export async function updateLead(id: string, patch: Partial<StoredLead>) {
  if (useSupabase()) {
    const r = await sb(`leads?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    if (!r.ok) throw new Error(`Supabase update failed ${r.status}`);
    return;
  }
  const rows = await readLocal();
  const i = rows.findIndex((l) => l.id === id);
  if (i >= 0) { rows[i] = { ...rows[i], ...patch }; await writeLocal(rows); }
}

export async function listLeads(limit = 500): Promise<StoredLead[]> {
  if (useSupabase()) {
    const r = await sb(`leads?select=*&order=created_at.desc&limit=${limit}`);
    if (!r.ok) throw new Error(`Supabase list failed ${r.status}`);
    return r.json();
  }
  assertDevFallback();
  return (await readLocal()).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit);
}

export async function listFailedSync(): Promise<StoredLead[]> {
  if (useSupabase()) {
    const r = await sb(`leads?ghl_sync_status=eq.failed&ghl_attempts=lt.3&select=*&limit=50`);
    return r.ok ? r.json() : [];
  }
  return (await readLocal()).filter((l) => l.ghl_sync_status === "failed" && (l.ghl_attempts ?? 0) < 3);
}

/** Supabase Storage upload (private bucket). Returns the storage path, not a public URL. */
export async function uploadFile(bucket: string, key: string, body: ArrayBuffer, contentType: string): Promise<string> {
  if (useSupabase()) {
    const r = await fetch(`${env.supabaseUrl}/storage/v1/object/${bucket}/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.supabaseServiceKey}`, "Content-Type": contentType, "x-upsert": "false" },
      body,
    });
    if (!r.ok) throw new Error(`Storage upload failed ${r.status}`);
    return `${bucket}/${key}`;
  }
  assertDevFallback();
  const dir = path.join(DATA_DIR, "uploads", bucket);
  await fs.mkdir(path.dirname(path.join(dir, key)), { recursive: true });
  await fs.writeFile(path.join(dir, key), Buffer.from(body));
  return `${bucket}/${key}`;
}

/** Time-limited signed URL so GHL users can view photos without the bucket being public. */
export async function signedUrl(storagePath: string, expiresIn = 60 * 60 * 24 * 14): Promise<string> {
  if (!useSupabase()) return `local://${storagePath}`;
  const r = await fetch(`${env.supabaseUrl}/storage/v1/object/sign/${storagePath}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.supabaseServiceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn }),
  });
  if (!r.ok) return storagePath;
  const j = (await r.json()) as { signedURL?: string };
  return j.signedURL ? `${env.supabaseUrl}/storage/v1${j.signedURL}` : storagePath;
}
