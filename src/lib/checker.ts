/**
 * Repair-or-Replace Checker logic. Informational only — never a structural or safety certification.
 * Result labels are fixed by the master brief.
 */
export type YN = "yes" | "no" | "unsure";
export type CheckerAnswers = {
  age: "<10" | "10-20" | "20+" | "unknown";
  soft_boards: YN;          // deterioration
  rot_at_framing: YN;       // structural concern (joists / ledger)
  posts_move: YN;           // structural concern
  railings_loose: YN;
  stairs_issue: YN;
  surface_only: YN;         // gray / splintered / cracked surface
};

export type CheckerResultKey = "repair_candidate" | "inspection_recommended" | "replacement_worth_evaluating";

export const CHECKER_RESULTS: Record<CheckerResultKey, { label: string; tone: "linen" | "amber" | "patina"; body: string }> = {
  repair_candidate: {
    label: "Potential Repair Candidate",
    tone: "linen",
    body: "Your answers point to surface wear or isolated damage. Decks like this are often restored with board replacement, cleaning and a new finish. Photos will tell us more.",
  },
  inspection_recommended: {
    label: "Professional Inspection Recommended",
    tone: "amber",
    body: "You flagged signs that can involve the structure: rot at the framing or ledger, moving posts, or loose railings and stairs. Keep people off any area that feels unsafe and have it looked at in person before deciding anything.",
  },
  replacement_worth_evaluating: {
    label: "Replacement May Be Worth Evaluating",
    tone: "patina",
    body: "An older deck with several issues at once can cost more to keep patching than to rebuild. That's not a verdict. It's a reason to price both options side by side.",
  },
};

export function evaluateChecker(a: CheckerAnswers): CheckerResultKey {
  const structural = a.rot_at_framing === "yes" || a.posts_move === "yes";
  const safety = a.railings_loose === "yes" || a.stairs_issue === "yes";
  const issues = [a.soft_boards, a.rot_at_framing, a.posts_move, a.railings_loose, a.stairs_issue].filter((x) => x === "yes").length;
  const unsureStructure = a.rot_at_framing === "unsure" || a.posts_move === "unsure";

  // Any structural flag always routes to an in-person inspection first (safety before sales).
  if (structural) return "inspection_recommended";
  if (a.age === "20+" && issues >= 2) return "replacement_worth_evaluating";
  if (safety || unsureStructure) return "inspection_recommended";
  return "repair_candidate";
}

export const CHECKER_DISCLAIMER =
  "This is a quick, informational guide based only on your answers. It is not an inspection, a structural assessment, or a safety certification.";
