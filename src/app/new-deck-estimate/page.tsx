import { meta } from "@/lib/seo";
import { PricingTag } from "@/components/ui/PricingTag";
import { PageHero } from "@/components/sections/Blocks";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { ViewService } from "@/components/sections/ViewService";
import { PRICING, bandFor, newDeckStartingAt, usd } from "@/config/pricing";
import { responsePhrase } from "@/config/site";

export const metadata = meta("/new-deck-estimate", "Get a New Deck Estimate | DeckCraft Greater Boston",
  "Tell us about the deck you want: size, materials, HOA or permit needs and budget band. We reply with a written next step.");

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const sqft = sp.sqft && /^\d{1,5}$/.test(sp.sqft) ? Number(sp.sqft) : undefined;
  const start = sqft ? newDeckStartingAt(sqft) : undefined;
  const band = start ? bandFor(start) : null;
  return (
    <>
      <ViewService name="New Deck Estimate Page" assessment="new_deck_estimate" />
      <PageHero photo="compositeDeck" position="50% 55%" eyebrow="New deck estimate" h1="Plan the deck you actually want." sub={`Size, materials, HOA or permit questions and a budget band. We reply with a written next step ${responsePhrase()}. Any site visit is booked with you, never assumed.`} />
      <section className="bg-bone px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_340px]">
          <PhotoAssessmentForm presetService="new_deck" presetWorkType="new" presetSize={sqft ? `${sqft} sq ft` : undefined} submitText="Request My New Deck Estimate" />
          <aside className="space-y-6 lg:pt-2">
            <div className="bg-navy p-6 text-white">
              <PricingTag dark />
              {start ? (
                <>
                  <p className="mt-4 text-sm text-white/70">{sqft} sq ft × ${PRICING.newDeckStartPerSqFt}/sq ft</p>
                  <p className="mt-1 font-display text-[34px] leading-none">from {usd(start)}</p>
                  {band && <p className="mt-3 text-sm">Planning band: <b>{band.label}</b></p>}
                </>
              ) : (
                <p className="mt-4 text-[15px] text-white/85">New decks start from <b className="text-white">${PRICING.newDeckStartPerSqFt} / sq ft</b>, in planning bands of {PRICING.planningBands.map((b) => b.label).join(", ")}.</p>
              )}
              <p className="mt-5 text-xs leading-relaxed text-white/60">{PRICING.noGuarantee}</p>
            </div>
            <div className="border-t border-line pt-6">
              <h2 className="font-display text-xl text-char">What happens next</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] text-char/85">
                <li>We review your answers and any photos.</li>
                <li>We reply with questions, a planning range and options.</li>
                <li>If a site visit makes sense, we agree a date with you.</li>
                <li>You get a written estimate before any work is booked.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
