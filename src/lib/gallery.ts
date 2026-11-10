/**
 * Gallery items. Add ONLY real DeckCraft jobs with the customer's written permission.
 * before/after: paths under /public/gallery (WebP, ≥1200×900). Never pair unrelated stock photos.
 */
export type GalleryItem = { before: string; after: string; town: string; service: "Deck Repair" | "Staining" | "Railings and Stairs" | "New Decks" | "Fencing" | "Commercial and Property"; quote?: string; permission: true };
export const GALLERY: GalleryItem[] = [];
