import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections/Blocks";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export const metadata = meta("/gallery", "Before and After Gallery: Decks and Fences | DeckCraft Boston", "Before and after deck and fence projects across Greater Boston.");

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="GALLERY" h1="The work speaks for itself." sub="Greater Boston decks and fences, labelled by town and service." />
      <GalleryGrid />
      <CtaBand title="Want results like these?" />
    </>
  );
}
