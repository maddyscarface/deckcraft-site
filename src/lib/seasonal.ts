/** Seasonal messaging driven by month (America/New_York). Spec Part 5 + master brief §8. */
export type Season = "fall" | "winter" | "spring" | "summer";

export function seasonFor(date = new Date()): Season {
  const m = Number(new Intl.DateTimeFormat("en-US", { month: "numeric", timeZone: "America/New_York" }).format(date));
  if (m === 10 || m === 11) return "fall";
  if (m === 12 || m <= 2) return "winter";
  if (m <= 5) return "spring";
  return "summer";
}

export const SEASONAL: Record<Season, { bar: string; campaign: string; cta: string }> = {
  fall: { bar: "Seal before the freeze. Fall sealing slots are open. Send 3 photos for a free assessment.", campaign: "Seal Before the Freeze.", cta: "Send 3 Photos" },
  winter: { bar: "Spring calendars fill by March. Reserve your spring deck or fence date now.", campaign: "Reserve Your Spring Deck Project.", cta: "Reserve a Spring Date" },
  spring: { bar: "Winter was hard on your deck. Book a spring safety check.", campaign: "Winter Was Hard on Your Deck.", cta: "Book a Spring Check" },
  summer: { bar: "Staining season is here. Send photos for a free assessment.", campaign: "Make Your Deck Ready for Summer.", cta: "Send 3 Photos" },
};

/** Portfolio planner: next deadline season. */
export function nextDeadline(date = new Date()): string {
  const m = date.getMonth() + 1;
  return m >= 7 && m <= 10 ? "before winter" : "before spring";
}
