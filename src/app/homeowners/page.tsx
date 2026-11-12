import Link from "next/link";
import { meta } from "@/lib/seo";
import { PageHero, ServicesGrid, PriceGuide, Process } from "@/components/sections/Blocks";
import { FaqSection } from "@/components/ui/Faq";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { PRICE_GUIDE } from "@/lib/services";

export const metadata = meta("/homeowners", "Deck and Fence Repair for Greater Boston Homeowners | DeckCraft Boston",
  "Deck repair, staining, railings, and fencing for Greater Boston homes. Send 3 photos for a free assessment.");

const FAQ = [
  { q: "Do I need to be home?", a: "Only for the first walkthrough and the final walkthrough. We can work while you're out." },
  { q: "How long does a typical job take?", a: "Staining and sealing usually takes 1 to 2 days plus dry time. Most repairs take 1 to 3 days. New decks and fences depend on size and permits." },
  { q: "Repair or replace: how do you decide?", a: "If the framing, joists and ledger board are sound, we repair. If rot has reached the structure, we'll show you photos and explain why replacement is safer." },
  { q: "Do you pull permits?", a: "Yes, where your town requires one. Structural repairs, new decks and some fences need permits in Massachusetts. We check with the building department for every job." },
  { q: "When is the best time to stain?", a: "Late spring through early fall, when the wood is dry and nights stay above about 50°F. We'll tell you if your deck needs to dry out first." },
  { q: "Can you work on composite decks?", a: "Yes: board replacement, railing repair and cleaning. Composite can't be stained like wood." },
  { q: "Do you serve my town?", a: "See the service area page, or send your address and we'll confirm." },
  { q: "What's the free assessment?", a: "Send 3 photos. We review them and send an honest range. If it's not worth fixing, we'll tell you." },
];

export default function Page() {
  return (
    <>
      <PageHero photo="gardenDeck" eyebrow="FOR HOMEOWNERS" h1="Your deck should be the best room in the house." sub="Repair, restore and fence your Greater Boston home without guessing what it will cost.">
        <Link href="#get-started" className="btn btn-linen">Get My Free Photo Assessment</Link>
        <Link href="/repair-or-replace" className="btn btn-ghost">Repair or replace?</Link>
      </PageHero>
      <section className="bg-hunter px-5 pb-20 text-white"><div className="mx-auto max-w-7xl"><ServicesGrid /></div></section>
      <section className="bg-white px-5 py-20"><div className="mx-auto max-w-3xl"><PriceGuide rows={PRICE_GUIDE} title="What Greater Boston homeowners typically spend" /></div></section>
      <Process cta={false} />
      <FaqSection faqs={FAQ} />
      <section id="get-started" className="bg-linen-pale px-5 py-20">
        <div className="mx-auto max-w-3xl"><h2 className="mb-8 font-display text-3xl">Start with 3 photos.</h2><PhotoAssessmentForm presetCustomerType="homeowner" /></div>
      </section>
    </>
  );
}
