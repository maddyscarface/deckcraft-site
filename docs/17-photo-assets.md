# Photo assets (Phase 2)

All photography in `public/images/` is licensed stock used to illustrate services and settings.
**None of it is DeckCraft project work.** Do not caption it as a job, a client, a town project or a
before/after. The machine-readable manifest (source URL, photographer, license, alt text) is
`src/lib/photos.ts`; the public credits page is `/photo-credits`.

- License: [Pexels License](https://www.pexels.com/license/) — free commercial use, no attribution
  required (we credit anyway), modification allowed.
- Images were resized to ≤2000px and encoded as WebP (q64–74). They are stored as `*.webp.b64`
  (the repo is pushed through a text-only API) and restored by `scripts/restore-binaries.cjs` at prebuild.
- Rendered through `next/image` (`src/components/ui/Photo.tsx`) with AVIF/WebP negotiation and
  responsive `sizes`.
- Photos with identifiable people (`people: true`) must never be presented as DeckCraft staff.

## Replacing with real job photos
1. Get the customer's written permission (see `src/lib/gallery.ts`).
2. Export WebP ≥1600px wide, add to `public/images/` (or `/public/gallery` for before/after pairs).
3. Point the same key in `src/lib/photos.ts` to the new file and update `photographer` to "DeckCraft".
