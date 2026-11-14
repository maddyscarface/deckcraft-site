import { NextResponse, type NextRequest } from "next/server";

/**
 * Gate for the internal dashboard and admin APIs (deny by default).
 * Accepts ADMIN_PASSWORD (owner, unchanged from Phase 2/3) or a staff user from ADMIN_USERS_JSON (PBKDF2-SHA256).
 * Route handlers and admin pages re-verify the credential and check a specific role permission (src/lib/p4/auth.ts).
 */
const ROBOTS = { "X-Robots-Tag": "noindex, nofollow" };

function hexToBytes(h: string) { const a = new Uint8Array(h.length / 2); for (let i = 0; i < a.length; i++) a[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16); return a; }
function safeEqual(a: string, b: string) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

async function pbkdf2Ok(pw: string, stored: string) {
  const [salt, iter, hash] = stored.split(":");
  const n = Number(iter);
  if (!salt || !hash || !Number.isInteger(n) || n < 10000) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(salt), iterations: n }, key, (hash.length / 2) * 8);
  const got = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return safeEqual(got, hash);
}

export async function middleware(req: NextRequest) {
  const pass = process.env.ADMIN_PASSWORD;
  let users: { user: string; pbkdf2: string }[] = [];
  try { users = JSON.parse(process.env.ADMIN_USERS_JSON || "[]"); } catch { users = []; }
  if (!pass && !users.length) return new NextResponse("Admin disabled: set ADMIN_PASSWORD or ADMIN_USERS_JSON", { status: 503, headers: ROBOTS });

  const h = req.headers.get("authorization") || "";
  const [scheme, enc] = h.split(" ");
  if (scheme === "Basic" && enc) {
    let decoded = "";
    try { decoded = atob(enc); } catch { decoded = ""; }
    const i = decoded.indexOf(":");
    const user = i >= 0 ? decoded.slice(0, i) : "";
    const pw = i >= 0 ? decoded.slice(i + 1) : "";
    const rec = users.find((u) => u && u.user === user);
    const ok = rec ? await pbkdf2Ok(pw, String(rec.pbkdf2 || "")) : Boolean(pass) && safeEqual(pw, pass!);
    if (ok) {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
  }
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="DeckCraft Admin"', ...ROBOTS } });
}
export const config = { matcher: ["/admin/:path*", "/admin", "/api/admin/:path*"] };
