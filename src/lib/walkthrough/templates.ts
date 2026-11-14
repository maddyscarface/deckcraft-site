/**
 * DeckCraft guided walkthrough templates (revisioned). One short camera prompt per step. Photos and video are
 * evidence; quantities come from the customer's tape measurements. Camera overlays cannot measure real space.
 * No step ever asks the customer to go under a deck or onto an unsafe structure.
 */
export const WALKTHROUGH_SERVICES = ["new_deck", "deck_repair", "resurfacing_staining", "railings_stairs", "fence", "property_inspection"] as const;
export type WalkthroughService = (typeof WALKTHROUGH_SERVICES)[number];

export type MeasureField = { id: string; label: string; type: "length" | "count"; hint: string; required: boolean };
export type Choice = { id: string; label: string; siteCheck?: boolean };
export type Step =
  | { id: string; kind: "photo" | "video"; title: string; prompt: string; tip?: string; safety?: string; required: boolean; max: number }
  | { id: string; kind: "footprint"; title: string; prompt: string; tip?: string; required: boolean }
  | { id: string; kind: "measure"; title: string; prompt: string; tip?: string; fields: MeasureField[] }
  | { id: string; kind: "choice"; title: string; prompt: string; multi: boolean; choices: Choice[]; required: boolean }
  | { id: string; kind: "text"; title: string; prompt: string; required: boolean };

export type Template = { id: WalkthroughService; revision: number; label: string; short: string; intro: string; steps: Step[] };

const SAFETY = "Stay on the ground or on a solid surface. Please don't crawl under the deck, lean on loose railings or climb anything to get a photo.";
const OVERLAY = "Your camera can't measure distances by itself, so we ask for tape measurements separately. Rough is fine; mark anything you can't measure as unknown.";

const conditionStep: Step = {
  id: "condition", kind: "choice", title: "What have you noticed?", prompt: "Tick anything that applies. This helps us decide whether a site check is needed.", multi: true, required: true,
  choices: [
    { id: "soft_boards", label: "Soft or spongy boards", siteCheck: true },
    { id: "wobbly_rail", label: "Wobbly railing or posts", siteCheck: true },
    { id: "visible_rot", label: "Visible rot or crumbling wood", siteCheck: true },
    { id: "house_gap", label: "Gap or sagging where the deck meets the house", siteCheck: true },
    { id: "loose_stairs", label: "Loose or uneven stairs", siteCheck: true },
    { id: "cosmetic", label: "Mostly cosmetic: faded, splintering or stained" },
    { id: "none", label: "Nothing in particular" },
  ],
};
const permitStep: Step = {
  id: "permits", kind: "choice", title: "HOA or permit questions", prompt: "Do you know of an HOA, condo board or permit requirement?", multi: false, required: false,
  choices: [{ id: "hoa", label: "There's an HOA or condo board" }, { id: "permit_known", label: "I know a permit is needed" }, { id: "none", label: "Not that I know of" }, { id: "unsure", label: "Not sure" }],
};
const accessStep: Step = { id: "access", kind: "photo", title: "How we'd get there", prompt: "Take one photo of the route from the driveway or street to the work area (gate, side yard or path).", required: false, max: 2 };
const videoStep: Step = { id: "walkaround", kind: "video", title: "Optional: a short walk-around video", prompt: "Walk slowly around the area for 30–60 seconds and describe what you'd like done.", tip: "Narration helps. Keep it under 2 minutes.", safety: SAFETY, required: false, max: 1 };
const notesStep: Step = { id: "notes", kind: "text", title: "Anything else?", prompt: "Describe the work in your own words: what you want, materials you like, timing and anything we should know.", required: false };
const footprint = (prompt: string): Step => ({ id: "footprint", kind: "footprint", title: "Measure the footprint", prompt, tip: OVERLAY, required: true });

export const TEMPLATES: Record<WalkthroughService, Template> = {
  new_deck: {
    id: "new_deck", revision: 1, label: "New deck", short: "Plan a new deck",
    intro: "Show us where the deck would go and roughly how big. About 10 minutes.",
    steps: [
      { id: "site_wide", kind: "photo", title: "The spot", prompt: "Stand back and photograph the whole area where the deck would go, including the back of the house.", safety: SAFETY, required: true, max: 3 },
      { id: "house_wall", kind: "photo", title: "The house wall", prompt: "Photograph the wall the deck would attach to, including doors, windows, vents and the outdoor faucet.", required: true, max: 3 },
      { id: "ground", kind: "photo", title: "The ground", prompt: "Photograph the ground from the house outward so we can see slope, steps down and anything in the way.", required: true, max: 3 },
      accessStep,
      footprint("Measure the length and width of the space you'd like. Add a second rectangle for an L-shape or landing."),
      { id: "heights", kind: "measure", title: "Heights and stairs", prompt: "Measure from the door threshold down to the ground. Count the steps you'd expect, if any.", tip: OVERLAY,
        fields: [
          { id: "height_above_grade", label: "Door threshold to ground", type: "length", hint: "e.g. 3' 6\"", required: true },
          { id: "stairs_count", label: "Number of steps (if known)", type: "count", hint: "e.g. 4", required: false },
          { id: "stairs_width", label: "Stair width you'd like", type: "length", hint: "e.g. 4'", required: false },
          { id: "railing_length", label: "Railing length (if known)", type: "length", hint: "Total of all sides that need a railing", required: false },
        ] },
      { id: "material", kind: "choice", title: "Materials you like", prompt: "Pick any that appeal. You don't have to decide now.", multi: true, required: false,
        choices: [{ id: "pt_wood", label: "Pressure-treated wood" }, { id: "cedar", label: "Cedar" }, { id: "composite", label: "Composite" }, { id: "undecided", label: "Undecided" }] },
      permitStep, videoStep, notesStep,
    ],
  },
  deck_repair: {
    id: "deck_repair", revision: 1, label: "Deck repair", short: "Repair an existing deck",
    intro: "Show us the deck and the problem spots. About 8 minutes.",
    steps: [
      { id: "overview", kind: "photo", title: "The whole deck", prompt: "Stand back in the yard and photograph the whole deck, including the stairs.", safety: SAFETY, required: true, max: 3 },
      { id: "problem", kind: "photo", title: "The problem spots", prompt: "Photograph each spot that worries you from above, close enough to see the wood.", safety: SAFETY, required: true, max: 6 },
      { id: "house_connection", kind: "photo", title: "Where it meets the house", prompt: "From the yard, photograph where the deck joins the house. Don't go underneath.", safety: SAFETY, required: true, max: 2 },
      { id: "stairs_rail", kind: "photo", title: "Stairs and railings", prompt: "Photograph the stairs and railings from the bottom of the steps.", required: false, max: 3 },
      conditionStep,
      footprint("Measure the deck's length and width. Add more rectangles for landings or levels."),
      { id: "heights", kind: "measure", title: "Height and stairs", prompt: "Measure the deck surface to the ground at the highest point. Count the steps.", tip: OVERLAY,
        fields: [
          { id: "height_above_grade", label: "Deck surface to ground (highest point)", type: "length", hint: "e.g. 6'", required: true },
          { id: "stairs_count", label: "Number of steps", type: "count", hint: "e.g. 5", required: false },
          { id: "railing_length", label: "Railing length that needs work", type: "length", hint: "e.g. 24'", required: false },
        ] },
      accessStep, permitStep, videoStep, notesStep,
    ],
  },
  resurfacing_staining: {
    id: "resurfacing_staining", revision: 1, label: "Resurfacing, staining or sealing", short: "Refresh the surface",
    intro: "Show us the surface and finish. About 6 minutes.",
    steps: [
      { id: "overview", kind: "photo", title: "The whole surface", prompt: "Photograph the whole deck surface from one corner, then from the opposite corner.", required: true, max: 3 },
      { id: "closeup", kind: "photo", title: "Close-up of the boards", prompt: "Take one close photo of typical boards and one of the worst area.", required: true, max: 4 },
      { id: "rails", kind: "photo", title: "Railings and stairs", prompt: "Photograph the railings and stairs that would be included.", required: false, max: 3 },
      conditionStep,
      footprint("Measure the deck's length and width. Add more rectangles for other levels or landings."),
      { id: "extras", kind: "measure", title: "Railings and stairs", prompt: "If railings or stairs are included, add their size.", tip: OVERLAY,
        fields: [
          { id: "railing_length", label: "Total railing length", type: "length", hint: "e.g. 40'", required: false },
          { id: "stairs_count", label: "Number of steps", type: "count", hint: "e.g. 4", required: false },
        ] },
      videoStep, notesStep,
    ],
  },
  railings_stairs: {
    id: "railings_stairs", revision: 1, label: "Railings and stairs", short: "Railings or stairs",
    intro: "Show us the railings and stairs. About 6 minutes.",
    steps: [
      { id: "rail_wide", kind: "photo", title: "The railings", prompt: "Photograph each run of railing from a few steps back.", safety: SAFETY, required: true, max: 4 },
      { id: "stairs", kind: "photo", title: "The stairs", prompt: "Photograph the stairs from the bottom, then one from the side.", safety: SAFETY, required: true, max: 3 },
      { id: "posts", kind: "photo", title: "Posts and connections", prompt: "Photograph a typical post where it meets the deck surface. Don't pull or lean on it.", safety: SAFETY, required: false, max: 3 },
      conditionStep,
      { id: "runs", kind: "measure", title: "Measure the runs", prompt: "Measure each side that has, or needs, a railing, and count the steps.", tip: OVERLAY,
        fields: [
          { id: "railing_length", label: "Total railing length", type: "length", hint: "e.g. 36'", required: true },
          { id: "railing_height", label: "Current railing height", type: "length", hint: "e.g. 36\"", required: false },
          { id: "stairs_count", label: "Number of steps", type: "count", hint: "e.g. 6", required: false },
          { id: "stairs_width", label: "Stair width", type: "length", hint: "e.g. 4'", required: false },
          { id: "height_above_grade", label: "Deck surface to ground (highest point)", type: "length", hint: "e.g. 5'", required: false },
        ] },
      permitStep, videoStep, notesStep,
    ],
  },
  fence: {
    id: "fence", revision: 1, label: "Fence", short: "New fence or fence repair",
    intro: "Show us the fence line. About 6 minutes.",
    steps: [
      { id: "line", kind: "photo", title: "The fence line", prompt: "Stand at one end and photograph along the fence line (or where it would go).", required: true, max: 4 },
      { id: "problem", kind: "photo", title: "Problem areas or gates", prompt: "Photograph any damaged sections, leaning posts or gates.", required: false, max: 4 },
      { id: "ground", kind: "photo", title: "Ground and obstacles", prompt: "Photograph slopes, trees, rocks or anything along the line.", required: false, max: 3 },
      { id: "fence_measure", kind: "measure", title: "Measure the run", prompt: "Pace or tape the total length. Add the height you have or want and count the gates.", tip: OVERLAY,
        fields: [
          { id: "fence_length", label: "Total fence length", type: "length", hint: "e.g. 120'", required: true },
          { id: "fence_height", label: "Fence height", type: "length", hint: "e.g. 6'", required: false },
          { id: "gates_count", label: "Number of gates", type: "count", hint: "e.g. 1", required: false },
        ] },
      { id: "fence_type", kind: "choice", title: "What do you need?", prompt: "Choose the closest.", multi: false, required: true,
        choices: [{ id: "new", label: "A new fence" }, { id: "replace", label: "Replace an existing fence" }, { id: "repair", label: "Repair sections or a gate" }, { id: "stain", label: "Stain or seal" }] },
      permitStep, videoStep, notesStep,
    ],
  },
  property_inspection: {
    id: "property_inspection", revision: 1, label: "Property / portfolio inspection", short: "HOA, condo or rental property",
    intro: "For property managers and boards: show us one structure to start. You can add more later.",
    steps: [
      { id: "overview", kind: "photo", title: "The structure", prompt: "Photograph the whole deck, balcony, porch or stair you want reviewed.", safety: SAFETY, required: true, max: 4 },
      { id: "concerns", kind: "photo", title: "Areas of concern", prompt: "Photograph the specific spots residents or staff have reported.", safety: SAFETY, required: false, max: 6 },
      conditionStep,
      footprint("If you can, measure the structure's length and width. Mark unknown if not."),
      { id: "count", kind: "measure", title: "Scope", prompt: "How many similar structures are on the property?", fields: [{ id: "structure_count", label: "Similar structures", type: "count", hint: "e.g. 12", required: false }] },
      accessStep, notesStep,
    ],
  },
};

export function templateFor(service: string): Template | null {
  return (TEMPLATES as Record<string, Template>)[service] ?? null;
}

/** Map existing lead-form service keys to a walkthrough template. */
export function serviceFromLeadService(s?: string): WalkthroughService {
  switch (s) {
    case "new_deck": return "new_deck";
    case "staining": case "fence_staining": return "resurfacing_staining";
    case "railings_stairs": return "railings_stairs";
    case "fence_repair": case "new_fence": case "gate": return "fence";
    case "inspection": case "capital_project": case "turnover": return "property_inspection";
    default: return "deck_repair";
  }
}
