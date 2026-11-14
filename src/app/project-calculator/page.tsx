import Link from "next/link";
import { meta, faqSchema, webPageSchema, breadcrumbSchema, pageGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/Blocks";
import { ProjectCalculator } from "@/components/tools/ProjectCalculator";
import { FaqSection } from "@/components/ui/Faq";

export const metadata = meta("/project-calculator", "Deck Scope Planner for Greater Boston | DeckCraft",
  "Plan a new deck by size: square footage, railing length and the extras you want. No prices online. Your price comes in a written estimate after a site visit.");

const FAQ = [
  { q: "Why doesn't the planner show a price?", a: "Every deck depends on height, footings, materials, stairs, railings and site access, which a size can't tell us. We scope the project from your plan, photos or walkthrough and set the price only in a written estimate after we confirm the site." },
  { q: "What should I measure?", a: "Width and length of the deck you want, and roughly how high it sits above the ground. A tape measure is fine. Never go under a deck or onto anything that feels unsafe to measure." },
  { q: "What happens after I plan it?", a: "Start a guided walkthrough on your phone or send the estimate form. We review it, ask any questions, and agree a site visit with you before a written estimate." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={pageGraph([webPageSchema("/project-calculator", "Deck scope planner"), breadcrumbSchema([["Home", "/"], ["Scope Planner", "/project-calculator"]]), faqSchema(FAQ, "/project-calculator")])} />
      <PageHero photo="gardenDeck" position="50% 60%" eyebrow="Scope planner" h1="Plan your deck by size, not by guesswork." sub="Enter a width and length to see the area and railing length, then pick the extras you want. No contact details needed, and no prices online." />
      <section className="bg-bone px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ProjectCalculator />
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {[["1. Plan the size", "Width, length and the extras you want."], ["2. Show us the site", "A guided walkthrough on your phone: photos, a short video and tape measurements."], ["3. Written estimate", "We confirm the site in person, then send a written estimate. No price is set before that."]].map(([t, b]) => (
              <div key={t} className="border-t-2 border-copper pt-5">
                <p className="font-display text-[26px] text-char">{t}</p>
                <p className="mt-2 text-stone">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-stone">Have an existing deck? <Link href="/free-assessment" className="font-semibold text-char underline decoration-copper underline-offset-4">Send 3 photos for an assessment</Link>.</p>
        </div>
      </section>
      <FaqSection faqs={FAQ} />
    </>
  );
}
