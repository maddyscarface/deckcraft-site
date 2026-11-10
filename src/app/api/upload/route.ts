import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/server/store";
import { rateLimit } from "@/lib/server/ratelimit";

export const runtime = "nodejs";

const MAX_BYTES = 20 * 1024 * 1024;
const IMAGE = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const DOCS = ["application/pdf"];

/** Magic-byte sniff so a renamed executable can't ride in as ".jpg". */
function sniff(b: Uint8Array): string | null {
  const h = (n: number) => Array.from(b.slice(0, n)).map((x) => x.toString(16).padStart(2, "0")).join("");
  if (h(3) === "ffd8ff") return "image/jpeg";
  if (h(8) === "89504e470d0a1a0a") return "image/png";
  if (h(4) === "52494646" && new TextDecoder().decode(b.slice(8, 12)) === "WEBP") return "image/webp";
  if (new TextDecoder().decode(b.slice(4, 12)).match(/ftyp(heic|heix|hevc|mif1|msf1|heif)/)) return "image/heic";
  if (h(4) === "25504446") return "application/pdf";
  return null;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`upload:${ip}`, 40)) return NextResponse.json({ ok: false, error: "Too many uploads" }, { status: 429 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") === "property" ? "property" : "assessment";
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: "File is over 20MB" }, { status: 413 });

  const buf = new Uint8Array(await file.arrayBuffer());
  const type = sniff(buf);
  const allowed = kind === "property" ? [...IMAGE, ...DOCS] : IMAGE;
  if (!type || !allowed.includes(type)) return NextResponse.json({ ok: false, error: "Unsupported file type" }, { status: 415 });

  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "application/pdf": "pdf" }[type] ?? "bin";
  const day = new Date().toISOString().slice(0, 10);
  const key = `${day}/${crypto.randomUUID()}.${ext}`;
  try {
    const p = await uploadFile(kind === "property" ? "property-files" : "assessment-photos", key, buf.buffer as ArrayBuffer, type);
    return NextResponse.json({ ok: true, path: p });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
