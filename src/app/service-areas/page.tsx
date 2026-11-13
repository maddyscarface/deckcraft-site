import Link from "next/link";
import { meta } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections/Blocks";
import { TOWNS } from "@/lib/towns";

export const metadata = meta("/service-areas", "Deck and Fence Service Areas: Greater Boston | DeckCraft", "Town-by-town deck and fence coverage across Greater Boston. Send your address and we will confirm scheduling.");

const REGIONS = ["Boston", "Inner suburbs", "MetroWest", "North", "South"] as const;

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="SERVICE AREAS" h1="Serving Greater Boston." sub="Deck repair, staining, railings and fencing across the city and the inner suburbs." />
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => (
            <div key={r}>
              <h2 className="font-display text-2xl">{r}</h2>
              <ul className="mt-4 space-y-3">
                {TOWNS.filter((t) => t.region === r).map((t) => (
                  <li key={t.slug}><Link href={`/${t.slug}`} className="font-semibold underline-offset-4 hover:underline">{t.name}, MA</Link><p className="text-sm text-hunter/70">{t.neighborhoods.slice(0, 4).join(" · ")}</p></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-6xl text-hunter/75">Not listed? <Link href="/contact" className="font-semibold underline">Send us your address</Link> and we&apos;ll tell you if we can schedule you.</p>
      </section>
      <CtaBand title="Send 3 photos from anywhere in Greater Boston." />
    </>
  );
}
