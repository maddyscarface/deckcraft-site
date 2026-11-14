import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { estimateConfig } from "@/config/estimate";
import { findFinancialLeaks, MONEY_VALUE } from "@/lib/p4/leak";

/** Customer-visible source: everything rendered or served publicly. Admin, server-only internals and API code excluded. */
function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out); else if (/\.(tsx?|mdx?|txt|json)$/.test(f)) out.push(p);
  }
  return out;
}
const PUBLIC = [...walk("src/app"), ...walk("src/components"), ...(existsSync("src/content") ? walk("src/content") : []), "src/lib/services.ts", "src/lib/blog.ts", "src/lib/seo-inventory.ts", "src/config/estimate.ts", "src/config/site.ts"]
  .filter((f) => existsSync(f) && !/src\/app\/(admin|api)\//.test(f) && !/src\/components\/admin\//.test(f));
const PRICE = /\$\s?\d|\d\s?(usd|dollars)\b|\d[\d,.]*\s?k\s?[–-]\s?\$?\d|per (sq\.? ?ft|square foot|linear (ft|foot))\b[^"\n]{0,20}\d|\d[^"\n]{0,12}per (sq\.? ?ft|square foot|linear)/i;

describe("customers never see prices", () => {
  it("customer-visible source contains no price figures, rates or bands", () => {
    expect(PUBLIC.length).toBeGreaterThan(40);
    const hits = PUBLIC.flatMap((f) => readFileSync(f, "utf8").split("\n").map((l, i) => [f, i + 1, l] as const))
      .filter(([, , l]) => PRICE.test(l) && !/^\s*(\/\/|\*|\/\*)/.test(l) && !/replace\(|RegExp|\\d/.test(l));
    expect(hits.map(([f, n, l]) => `${f}:${n}: ${l.trim().slice(0, 120)}`)).toEqual([]);
  });
  it("public estimate config carries no ranges, bands or public pricing", () => {
    expect(estimateConfig.budgetBands).toEqual([]);
    expect(JSON.stringify(estimateConfig)).not.toMatch(/\$\s?\d|"typical"|publicPricing|perSqFt/);
  });
  it("no client component imports internal pricing modules", () => {
    const client = [...walk("src/app"), ...walk("src/components")].filter((f) => /^["']use client["']/.test(readFileSync(f, "utf8").trimStart()));
    for (const f of client) expect(readFileSync(f, "utf8"), f).not.toMatch(/estimate-internal|config\/pricing|lib\/estimator|lib\/p4\/db|server-only/);
  });
  it("leak detector catches money keys and values", () => {
    expect(findFinancialLeaks({ ok: true, steps: [{ title: "Photos" }] })).toEqual([]);
    expect(findFinancialLeaks({ estimate: { total: 5 } }).length).toBeGreaterThan(0);
    expect(findFinancialLeaks({ note: "about $4,000" }).length).toBe(1);
    expect(findFinancialLeaks({ priceRange: "x" }).length).toBe(1);
    expect(MONEY_VALUE.test("12' x 16'")).toBe(false);
  });
  it("built client bundles (if present) contain no internal price strings", () => {
    const dir = ".next/static/chunks";
    if (!existsSync(dir)) return;
    const js = walk(dir).filter((f) => f.endsWith(".js")).map((f) => readFileSync(f, "utf8")).join("\n");
    for (const s of ["$1,160 to $4,161", "$39.99", "8k–15k", "$15k–25k", "est_offer_guidance", "margin_pct", "INTERNAL_PRICE_GUIDE"]) expect(js.includes(s), s).toBe(false);
  });
});
