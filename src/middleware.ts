import { NextResponse, type NextRequest } from "next/server";

/** Basic auth for the internal dashboard. Replace with Supabase Auth (roles: owner, bdr) before adding staff. */
export function middleware(req: NextRequest) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return new NextResponse("Admin disabled: set ADMIN_PASSWORD", { status: 503 });
  const h = req.headers.get("authorization") || "";
  const [scheme, enc] = h.split(" ");
  if (scheme === "Basic" && enc) {
    const [, pw] = atob(enc).split(":");
    if (pw === pass) return NextResponse.next();
  }
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="DeckCraft Admin"' } });
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
