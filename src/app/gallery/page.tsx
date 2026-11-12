import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections/Blocks";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export const metadata = meta("/gallery", "Before and After Gallery: Decks and Fences | DeckCraft Boston", "Before and after deck and fence projects across Greater Boston.");

export default function Page() {
  return (
    <>
      <PageHero photo="deckShadows" position="50% 50%" eyebrow="Gallery" h1="Work you can see, labelled by service and town." sub="Real DeckCraft jobs appear here with the town and service, shared with each owner’s permission. Until then, illustrative photos are clearly marked as such." />
      <GalleryGrid />
      <CtaBand title="Start with three photos of your own deck." sub="We reply with what we see and the sensible next step." />
    </>
  );
}
