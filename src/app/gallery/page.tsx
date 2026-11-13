import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections/Blocks";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export const metadata = meta("/gallery", "Deck and Fence Photo Gallery | DeckCraft", "Illustrative licensed photos show each service category. Real DeckCraft jobs appear only with the owner's permission, town and work type.");

export default function Page() {
  return (
    <>
      <PageHero photo="deckShadows" position="50% 50%" eyebrow="Gallery" h1="Deck and fence photography, clearly labelled." sub="Real DeckCraft jobs appear here with the town, work type, date and the owner’s permission. Until then, illustrative licensed photos are clearly marked and are never framed as completed jobs." />
      <GalleryGrid />
      <CtaBand title="Start with three photos of your own deck." sub="We reply with what we see and the sensible next step." />
    </>
  );
}
