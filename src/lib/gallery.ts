import type { PhotoKey } from "./photos";

/**
 * Gallery. Spec §1: categories + location tags; placeholders must be labelled illustrative.
 *
 * GALLERY: ONLY real DeckCraft jobs with the customer's written permission (photo-rights record in
 * docs/19-creative-briefs-approval-library.md). before/after: paths under /public/gallery (WebP, ≥1200×900).
 * Never pair unrelated stock photos. Real jobs carry a town (location tag).
 *
 * ILLUSTRATIVE: licensed stock used to show the category only. Always captioned "Illustrative", never given a town,
 * never described as DeckCraft work. Remove each one as real jobs in that category arrive.
 */
export const GALLERY_CATEGORIES = ["New Decks", "Rebuild and Resurface", "Structural Repairs", "Railings and Stairs", "Stain and Seal", "Fences", "HOA and Commercial"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryItem = { before: string; after: string; town: string; category: GalleryCategory; summary?: string; quote?: string; permission: true };
export const GALLERY: GalleryItem[] = [];

export type IllustrativeItem = { photo: PhotoKey; category: GalleryCategory; caption: string };
export const ILLUSTRATIVE: IllustrativeItem[] = [
  { photo: "compositeDeck", category: "New Decks", caption: "Low-maintenance composite with glass railing" },
  { photo: "gardenDeck", category: "New Decks", caption: "Hardwood deck off a garden room" },
  { photo: "deckShadows", category: "Rebuild and Resurface", caption: "Deck boards in afternoon light" },
  { photo: "crewFraming", category: "Structural Repairs", caption: "Framing work in progress" },
  { photo: "weatheredBoards", category: "Structural Repairs", caption: "Split, weathered boards: the kind of damage we assess" },
  { photo: "railingDetail", category: "Railings and Stairs", caption: "Solid post and rail detail" },
  { photo: "stainBrush", category: "Stain and Seal", caption: "Brushing stain into vertical boards" },
  { photo: "fenceGarden", category: "Fences", caption: "Picket fence in a planted yard" },
  { photo: "townhomeDeck", category: "HOA and Commercial", caption: "Townhome deck of the kind associations maintain" },
];
