import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections/Blocks";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export const metadata = meta("/gallery", "Before and After Gallery: Decks and Fences | DeckCraft Boston", "Before and after deck and fence projects across Greater Boston.");

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="GALLERY" h1="Real jobs only. Labelled by town and service." sub="Every project in this gallery will be a real DeckCraft job, shared with the owner’s permission. Nothing staged, nothing borrowed." />
      <GalleryGrid />
      <CtaBand title="Start with three photos of your own deck." sub="We reply with what we see and a realistic range." />
    </>
  );
}
