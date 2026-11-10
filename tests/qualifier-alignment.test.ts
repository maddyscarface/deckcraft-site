import { describe, expect, it } from "vitest";
import { START_TO_TIMELINE, estimateConfig } from "@/config/estimate";
import { TIMELINES } from "@/lib/lead-schema";

describe("qualifier ids align with the lead schema", () => {
  it("every start option maps onto an existing timeline value (routing + GHL keep working)", () => {
    for (const o of estimateConfig.startOptions) {
      expect(START_TO_TIMELINE[o.id], o.id).toBeDefined();
      expect(TIMELINES as readonly string[]).toContain(START_TO_TIMELINE[o.id]);
    }
  });
});
