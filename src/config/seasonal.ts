/**
 * Seasonal modules (spec §1). Each module has a start/end window (MM-DD, America/New_York, recurring yearly;
 * windows may wrap the new year). Outside every window the EVERGREEN module shows, so the site never displays
 * stale seasonal copy. No module may claim capacity ("slots are open") or a deadline the owner hasn't confirmed.
 *
 * Admin controls (Vercel env, no code change, take effect on the next daily revalidate / redeploy):
 *   SEASONAL_MODULES_JSON  JSON array overriding the modules below (same shape). Use it to edit copy or dates.
 *   SEASONAL_FORCE         "<module id>" to pin one module, "evergreen" to pin the fallback, "off" to hide the bar.
 * /admin shows which module is active and the full schedule.
 */
export type SeasonalModule = {
  id: string;
  start: string; // MM-DD inclusive
  end: string; // MM-DD inclusive
  enabled: boolean;
  label: string; // short window label for the homepage schedule
  bar: string; // announcement-bar sentence
  headline: string;
  body: string;
  cta: { label: string; href: string };
};

export const SEASONAL_MODULES: SeasonalModule[] = [
  {
    id: "spring-check", start: "03-01", end: "05-31", enabled: true, label: "Mar–May",
    bar: "Winter was hard on New England decks. Send 3 photos for a spring safety assessment.",
    headline: "Winter was hard on your deck.",
    body: "Spring safety checks, board and railing repairs before the outdoor season starts.",
    cta: { label: "Send 3 Photos for an Assessment", href: "/free-assessment" },
  },
  {
    id: "summer-stain", start: "06-01", end: "08-31", enabled: true, label: "Jun–Aug",
    bar: "Dry weather is staining weather. Send photos and we'll tell you what your boards need.",
    headline: "Make your deck ready for summer.",
    body: "Prime staining and sealing season, when wood is dry and nights are warm.",
    cta: { label: "Send 3 Photos for an Assessment", href: "/free-assessment" },
  },
  {
    id: "fall-sealing", start: "09-15", end: "11-20", enabled: true, label: "Mid Sep–Nov",
    bar: "Seal before the freeze. Send 3 photos and we'll tell you whether your deck needs it this fall.",
    headline: "Seal before the freeze.",
    body: "Freeze-thaw cycles open unsealed wood. Fall is the last practical window to seal and fix soft boards.",
    cta: { label: "Send 3 Photos for an Assessment", href: "/free-assessment" },
  },
  {
    id: "winter-planning", start: "11-21", end: "02-28", enabled: true, label: "Late Nov–Feb",
    bar: "Planning a new deck for spring? Get a planning estimate now and design over the winter.",
    headline: "Plan your new deck over the winter.",
    body: "Design, materials and permit questions sorted before the spring build season.",
    cta: { label: "Get a New Deck Estimate", href: "/new-deck-estimate" },
  },
];

export const EVERGREEN_MODULE: SeasonalModule = {
  id: "evergreen", start: "01-01", end: "12-31", enabled: true, label: "Any time",
  bar: "Not sure what your deck needs? Send 3 photos for a free assessment.",
  headline: "Work you can see.",
  body: "Repairs, refinishing, new decks and fences, scoped from your photos before anyone quotes a number.",
  cta: { label: "Send 3 Photos for an Assessment", href: "/free-assessment" },
};

const md = (d: Date) => new Intl.DateTimeFormat("en-CA", { month: "2-digit", day: "2-digit", timeZone: "America/New_York" }).format(d); // "MM-DD"

export function inWindow(m: Pick<SeasonalModule, "start" | "end">, today: string) {
  return m.start <= m.end ? today >= m.start && today <= m.end : today >= m.start || today <= m.end;
}

function modulesFromEnv(e: NodeJS.ProcessEnv): SeasonalModule[] {
  if (!e.SEASONAL_MODULES_JSON) return SEASONAL_MODULES;
  try {
    const v = JSON.parse(e.SEASONAL_MODULES_JSON) as SeasonalModule[];
    return Array.isArray(v) && v.every((m) => m && m.id && /^\d\d-\d\d$/.test(m.start) && /^\d\d-\d\d$/.test(m.end) && m.bar) ? v : SEASONAL_MODULES;
  } catch { return SEASONAL_MODULES; }
}

export function seasonalSchedule(e: NodeJS.ProcessEnv = process.env) { return modulesFromEnv(e); }

/** Active module for a date, or null when the admin has switched the bar off. */
export function activeSeasonal(date = new Date(), e: NodeJS.ProcessEnv = process.env): SeasonalModule | null {
  const force = (e.SEASONAL_FORCE || "").trim();
  if (force === "off") return null;
  const mods = modulesFromEnv(e);
  if (force === "evergreen") return EVERGREEN_MODULE;
  if (force) return mods.find((m) => m.id === force) ?? EVERGREEN_MODULE;
  const today = md(date);
  return mods.find((m) => m.enabled && inWindow(m, today)) ?? EVERGREEN_MODULE;
}
