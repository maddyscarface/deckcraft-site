import Link from "next/link";
import { meta, faqSchema, webPageSchema, breadcrumbSchema, pageGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/Blocks";
import { ProjectCalculator } from "@/components/tools/ProjectCalculator";
import { PRICING, pricingLabel } from "@/config/pricing";
import { FaqSection } from "@/components/ui/Faq";

export const metadata = meta("/project-calculator", "New Deck Cost Calculator for Greater Boston | DeckCraft",
  `Estimate a planning figure for a new deck from its size. Starting assumption $${PRICING.newDeckStartPerSqFt}/sq ft, with planning bands. Repairs are quoted from photos.`);

const FAQ = [
  { q: "Is this a quote?", a: `No. It's a planning figure from a starting assumption of $${PRICING.newDeckStartPerSqFt} per sq ft for a straightforward pressure-treated deck. Your price is set only in a written estimate after we confirm the site.` },
  { q: "Why doesn't it price repairs or staining?", a: "Repairs depend on what has failed, which a size can't tell us. We quote repair, staining and sealing from your photos, separately from new-deck pricing." },
  { q: "What makes a deck cost more?", a: "Composite or cedar boards, height above grade, stairs, upgraded railings, lighting, demolition of an old deck, ledge or poor soil at the footings, and permit drawings." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={pageGraph([webPageSchema("/project-calculator", "New deck project calculator"), breadcrumbSchema([["Home", "/"], ["Project Calculator", "/project-calculator"]]), faqSchema(FAQ, "/project-calculator")])} />
      <PageHero photo="gardenDeck" position="50% 60%" eyebrow="Project calculator" h1="What might a new deck cost? Start with the size." sub="A planning figure in seconds from our starting rate per square foot. No contact details needed." />
      <section className="bg-bone px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ProjectCalculator />
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {PRICING.planningBands.map((b) => (
              <div key={b.id} className="border-t-2 border-copper pt-5">
                <p className="font-display text-[30px] text-char">{b.label}</p>
                <p className="mt-2 text-stone">{b.fits}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-stone">These bands are planning assumptions ({pricingLabel().toLowerCase()}), not quotes. Have an existing deck? <Link href="/free-assessment" className="font-semibold text-char underline decoration-copper underline-offset-4">Send 3 photos for an assessment</Link>.</p>
        </div>
      </section>
      <FaqSection faqs={FAQ} />
    </>
  );
}
