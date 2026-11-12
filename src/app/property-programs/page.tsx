import Link from "next/link";
import { meta } from "@/lib/seo";
import { PageHero, Checklist } from "@/components/sections/Blocks";
import { ProgramTable } from "@/components/sections/ProgramPage";
import { PortfolioPlanner } from "@/components/tools/PortfolioPlanner";
import { WalkthroughForm } from "@/components/forms/WalkthroughForm";
import { SERVICE_PROMISE } from "@/lib/programs";

export const metadata = meta("/property-programs", "Deck and Fence Programs for HOAs, Landlords and Property Managers | DeckCraft Boston",
  "Annual inspections, preferred vendor programs, and capital repair projects for Greater Boston associations, landlords, and commercial properties.");

const PATHS = [
  { href: "/hoa-condo", t: "HOA and Condo Associations", b: "Board-ready condition reports, priority rankings and phased plans." },
  { href: "/landlords", t: "Landlords and Property Managers", b: "Rear porches, decks and fences across 2 to 200 units, around your tenants." },
  { href: "/commercial", t: "Commercial Properties", b: "Patios, perimeter fencing and enclosures scheduled around business hours." },
];

export default function Page() {
  return (
    <>
      <PageHero photo="townhomeDeck" eyebrow="PROPERTY PROGRAMS" h1="Every deck and fence on your properties, handled by one team." sub="Inspections, repairs, staining and fencing for associations, landlords and commercial properties across Greater Boston.">
        <Link href="#get-started" className="btn btn-linen">Request a Property Walkthrough</Link>
      </PageHero>
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {PATHS.map((p) => (
            <Link key={p.href} href={p.href} className="rounded-[2px] border border-cream-dark bg-white p-8 shadow-card transition hover:-translate-y-0.5 hover:border-hunter">
              <h2 className="font-display text-2xl">{p.t}</h2><p className="mt-2 text-hunter/75">{p.b}</p><span className="mt-4 inline-block font-semibold text-linen-dark">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-white px-5 py-20"><div className="mx-auto max-w-6xl"><h2 className="font-display text-3xl">Four ways to work with us</h2><div className="mt-8"><ProgramTable /></div></div></section>
      <section className="bg-linen-pale px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div><h2 className="font-display text-3xl">Our service promise</h2><div className="mt-6"><Checklist items={SERVICE_PROMISE} /></div></div>
          <PortfolioPlanner />
        </div>
      </section>
      <section id="get-started" className="bg-hunter px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-white">Request a property walkthrough</h2>
          <p className="mt-2 mb-8 text-sage">Free for associations, landlords and commercial properties.</p>
          <WalkthroughForm />
        </div>
      </section>
    </>
  );
}
