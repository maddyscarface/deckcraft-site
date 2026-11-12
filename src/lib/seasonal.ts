/** Seasonal helpers. Dated modules + evergreen fallback live in src/config/seasonal.ts. */
export { activeSeasonal, seasonalSchedule, EVERGREEN_MODULE } from "@/config/seasonal";

/** Portfolio planner: next deadline season. */
export function nextDeadline(date = new Date()): string {
  const m = date.getMonth() + 1;
  return m >= 7 && m <= 10 ? "before winter" : "before spring";
}
