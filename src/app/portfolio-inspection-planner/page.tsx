import { meta } from "@/lib/seo";
import { PortfolioPlanner } from "@/components/tools/PortfolioPlanner";
import { PageHero, Checklist } from "@/components/sections/Blocks";
import { PROGRAMS } from "@/lib/programs";

export const metadata = meta("/portfolio-inspection-planner", "Portfolio Deck and Fence Inspection Planner | DeckCraft Boston",
  "Plan an inspection round for your condo association, HOA, rental portfolio or commercial properties. Get a preliminary schedule and book a walkthrough.");

export default function Page() {
  return (
    <>
      <PageHero photo="townhomeDeck" position="50% 50%" eyebrow="Portfolio inspection planner" h1="Plan your inspection round in a minute." sub="Tell us how many properties and structures you manage. We'll estimate the inspection days and suggested timing, then confirm everything at a walkthrough." />
      <section className="bg-bone px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <PortfolioPlanner />
          <div>
            <h2 className="font-display text-2xl">What the inspection delivers</h2>
            <div className="mt-4"><Checklist items={["Each deck, balcony, porch, stair, railing and fence run in scope inspected", "Written condition report with photos", "Priority ratings: safety now / repair this year / monitor", "Pricing per item and per property", "A phased schedule matched to your budget approval process"]} /></div>
            <p className="mt-6 text-sm text-hunter/70">{PROGRAMS[0].bestFor}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
