/**
 * Indexing and canonical-host rules.
 *
 * Staging/preview must never be indexed. Canonicals, schema, robots and the
 * sitemap always point at the intended production origin — never a *.vercel.app
 * host — so review deployments cannot leak into search results as the official URL.
 *
 * Production stays noindex until the owner sets NEXT_PUBLIC_INDEXABLE_SITE=true
 * after confirming the custom domain. See docs/20-phase3-seo-inventory.md.
 */
export const INTENDED_PRODUCTION_ORIGIN = "https://deckcraftbuild.com";

export function canonicalOrigin(env: NodeJS.ProcessEnv = process.env): string {
  const fallback = INTENDED_PRODUCTION_ORIGIN;
  const raw = (env.NEXT_PUBLIC_SITE_URL || fallback).trim().replace(/\/$/, "");
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = url.hostname.toLowerCase();
    if (!host || host.endsWith("vercel.app") || host === "localhost" || host === "127.0.0.1") {
      return fallback;
    }
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
}

/** True only when the owner has explicitly approved production indexing. */
export function isIndexableSite(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.NEXT_PUBLIC_INDEXABLE_SITE !== "true") return false;
  if (env.SITE_NOINDEX === "1") return false;
  if (env.VERCEL_ENV && env.VERCEL_ENV !== "production") return false;
  return !canonicalOrigin(env).includes("vercel.app");
}
