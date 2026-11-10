import Link from "next/link";
import { meta, businessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { FaqSection } from "@/components/ui/Faq";
import { Checklist, Process, ServicesGrid, TownPills, TrustBar } from "@/components/sections/Blocks";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { PortfolioPlanner } from "@/components/tools/PortfolioPlanner";
import { Reviews } from "@/components/sections/Reviews";
import { SERVICE_PROMISE } from "@/lib/programs";
import { site, responsePhrase, phoneHref } from "@/config/site";

export const metadata = meta("/", "Deck Repair, Staining and Fencing in Greater Boston | DeckCraft Boston",
  "Deck repair, staining, railings, and fencing for Greater Boston homes, associations, landlords, and businesses. Send 3 photos for a free assessment.");

const HOME_FAQ = [
  { q: "How much does deck repair cost in Boston?", a: "Typical Greater Boston deck repair jobs run roughly $1,160 to $4,161, depending on how many boards, how much framing and whether railings or stairs are involved. Send 3 photos and we'll give you a range for your deck. Your exact price is confirmed in writing before work starts." },
  { q: "Is it better to repair or replace a deck?", a: "If the framing, joists, posts and ledger are sound, repair is usually the better value. If rot has reached the structure, replacement is often safer. Try our Repair-or-Replace Checker, then send photos so we can confirm." },
  { q: "When should you seal a deck in Massachusetts?", a: "Late spring through early fall, when the wood is dry and overnight temperatures stay above roughly 50°F. Sealing before the first freeze helps keep water out of the wood through winter." },
  { q: "Does an older deck need a structural inspection?", a: "Not automatically, but soft boards, rot at the joists or ledger, or posts that move are reasons to have it looked at in person before using it heavily. Our photo review is a starting point, not an inspection." },
  { q: "Do you work with condo associations and landlords?", a: "Yes. We offer annual inspections, preferred vendor agreements and phased capital repair programs, with written scopes and photo reports for every property." },
  { q: "What's the free assessment?", a: "Send 3 photos. We review them and reply with what we see and a price range. If it's not worth fixing, we'll say so." },
];

export default function Home() {
  const tel = phoneHref();
  return (
    <>
      <JsonLd data={businessSchema()} />

      {/* 2. Hero + photo-based lead capture */}
      <section className="bg-hunter px-5 pt-14 pb-20 text-white md:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-linen">GREATER BOSTON&apos;S DECK &amp; FENCE SPECIALISTS</p>
            <h1 className="mt-4 font-display text-[40px] leading-[1.04] font-bold md:text-[58px]">Deck Repair. Done Right. Built for Boston.</h1>
            <p className="mt-6 max-w-[520px] text-lg text-sage">Deck repair, staining, railings, and fencing for Greater Boston homeowners, HOAs, landlords, and commercial properties. Send us a few photos to start with a professional assessment.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/free-assessment" className="btn btn-linen !min-h-[54px] !text-base">Send 3 Photos — Get a Free Assessment</Link>
              <Link href="/property-programs" className="btn btn-ghost !min-h-[54px]">Managing Multiple Properties?</Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-linen">
              <li className="flex items-center gap-1.5"><Icon name="Check" size={14} />Free photo assessment</li>
              <li className="flex items-center gap-1.5"><Icon name="Check" size={14} />Written price before work starts</li>
              <li className="flex items-center gap-1.5"><Icon name="Check" size={14} />Homeowners, HOAs and landlords</li>
            </ul>
          </div>
          <div>
            <BeforeAfter alt="Weathered deck cleaned and stained" />
            <p className="mt-3 text-center text-xs text-sage">Drag to compare. Real Greater Boston job photos replace this illustration as projects are documented.</p>
          </div>
        </div>
      </section>

      {/* 3. Trust strip (verified items only) */}
      <TrustBar />

      {/* 4. Cost and risk of delay */}
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-patina">WHY BOSTON DECKS FAIL EARLY</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl md:text-[40px] md:leading-tight">It looked fine last summer. Then winter happened.</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <p className="text-lg leading-relaxed text-hunter/85">New England decks take a beating most of the country never sees. Water soaks into unsealed boards in fall, freezes, expands and splits the wood from inside. Snow sits on the surface for weeks. By spring, the gray boards, loose railings and soft spots show up all at once.</p>
            <p className="text-lg leading-relaxed text-hunter/85">Most of it is fixable. The trick is catching it before water reaches the framing. A few replaced boards and a fresh seal cost a fraction of a rebuild, and waiting is usually how one becomes the other.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[["Snowflake", "Freeze-thaw damage", "Water in the wood freezes and splits boards every winter."], ["Droplets", "Water at the framing", "Rot that starts at the joists and ledger is what turns a repair into a rebuild."], ["Sun", "UV graying", "Gray isn't old. It's unprotected wood breaking down at the surface."]].map(([i, t, b]) => (
              <div key={t} className="rounded-lg bg-white p-6 shadow-card"><Icon name={i} className="text-patina" size={26} /><h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-1 text-hunter/75">{b}</p></div>
            ))}
          </div>
          <div className="mt-10 grid items-center gap-6 rounded-lg border border-cream-dark bg-white p-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold">The cost of waiting, in Greater Boston terms</p>
              <p className="mt-1 text-[15px] text-hunter/75">Clean and seal: <b>$300 to $1,500</b>. Typical repair: <b>$1,160 to $4,161</b>. Full resurfacing: <b>$15 to $50 per sq ft</b>. Planning ranges only; your price is confirmed in writing.</p>
            </div>
            <Link href="/free-assessment" className="btn btn-hunter">Send 3 Photos: We&apos;ll Tell You What You Have</Link>
          </div>
        </div>
      </section>

      {/* 5. Deck services + 6. Fencing */}
      <section className="bg-hunter px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-patina">WHAT WE DO</p>
          <h2 className="mt-2 font-display text-3xl md:text-[40px]">Decks and fences, repaired, restored, and built to last.</h2>
          <div className="mt-10"><ServicesGrid /></div>
        </div>
      </section>
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-patina">RESIDENTIAL AND COMMERCIAL FENCING</p>
            <h2 className="mt-2 font-display text-3xl md:text-[40px] md:leading-tight">Fences built for New England winters.</h2>
            <p className="mt-4 text-lg text-hunter/80">Frost heave lifts posts, rot starts at the ground line, and storms do the rest. We repair, replace and install fencing for homes, associations and commercial properties. Every dig starts with a Dig Safe request, as Massachusetts law requires.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/fencing/residential" className="btn btn-hunter">Residential Fencing</Link>
              <Link href="/fencing/commercial" className="btn border border-hunter">Commercial and Property Fencing</Link>
            </div>
          </div>
          <BeforeAfter variant="fence" alt="Weathered fence restored" service="Fencing" />
        </div>
      </section>

      {/* 7. Before/after portfolio */}
      <section className="bg-hunter px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-patina">THE PROOF</p>
          <h2 className="mt-2 font-display text-3xl md:text-[40px]">Before. After. Greater Boston jobs.</h2>
          <p className="mt-3 max-w-2xl text-sage">Our gallery shows only real DeckCraft projects, labelled by town and service. Until enough jobs are photographed, the panels below are clearly marked illustrations of the type of work.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <BeforeAfter service="Staining" />
            <BeforeAfter variant="rail" service="Railings" />
            <BeforeAfter variant="fence" service="Fence Repair" />
          </div>
          <Link href="/gallery" className="btn btn-linen mt-10">View the Gallery</Link>
        </div>
      </section>

      {/* 8. Repair-or-Replace Checker teaser */}
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow text-patina">REPAIR-OR-REPLACE CHECKER</p>
            <h2 className="mt-2 font-display text-3xl md:text-[40px] md:leading-tight">Not sure if it&apos;s a repair or a rebuild?</h2>
            <p className="mt-4 text-lg text-hunter/80">Answer seven quick questions about age, boards, framing, railings and stairs. You&apos;ll get a preliminary read in about a minute, then send photos so we can confirm.</p>
            <p className="mt-3 text-sm text-hunter/60">An informational guide, not an inspection or safety certification.</p>
          </div>
          <div className="rounded-xl bg-hunter p-8 text-white shadow-premium">
            <p className="font-display text-2xl">Three possible results</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li className="flex gap-2"><span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-linen" />Potential Repair Candidate</li>
              <li className="flex gap-2"><span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber" />Professional Inspection Recommended</li>
              <li className="flex gap-2"><span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-patina" />Replacement May Be Worth Evaluating</li>
            </ul>
            <Link href="/repair-or-replace" className="btn btn-linen mt-6 w-full">Start the Checker</Link>
          </div>
        </div>
      </section>

      {/* 9. Property Programs */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-patina">FOR ASSOCIATIONS, LANDLORDS AND MANAGERS</p>
            <h2 className="mt-2 font-display text-3xl md:text-[38px] md:leading-tight">Twenty decks. One schedule. One contact.</h2>
            <p className="mt-4 text-lg text-hunter/80">Associations and landlords don&apos;t need another contractor who takes one unit at a time and disappears. DeckCraft scopes every property up front, gives you one written schedule and sends photo reports so you don&apos;t have to be on site.</p>
            <div className="mt-6"><Checklist items={SERVICE_PROMISE} /></div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/request-walkthrough" className="btn btn-hunter">Request a Property Walkthrough</Link>
              <Link href="/property-programs" className="btn border border-hunter">See the Programs</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
              {[["HOA and Condo", "/hoa-condo"], ["Landlords and PMs", "/landlords"], ["Commercial", "/commercial"]].map(([l, h]) => (
                <Link key={h} href={h} className="rounded-md border border-cream-dark bg-cream p-3 text-center font-semibold hover:border-hunter">{l} →</Link>
              ))}
            </div>
          </div>
          <PortfolioPlanner compact />
        </div>
      </section>

      {/* 10. Seasonal services */}
      <section className="bg-linen-pale px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-patina">SEASONAL PROTECTION</p>
          <h2 className="mt-2 font-display text-3xl md:text-[40px]">The right work at the right time of year.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              ["Mar to May", "Winter was hard on your deck.", "Spring safety checks, board and railing repairs before the season starts."],
              ["Jun to Sep", "Make your deck ready for summer.", "Prime staining and sealing season, when wood is dry and nights are warm."],
              ["Oct to Nov", "Seal before the freeze.", "Last dry windows to keep water out of the wood through winter."],
              ["Dec to Feb", "Reserve your spring project.", "Design, permit and book rebuilds and fences before calendars fill."],
            ].map(([m, h, b]) => (
              <div key={m} className="rounded-lg bg-white p-6 shadow-card"><p className="text-xs font-semibold tracking-wider text-patina">{m.toUpperCase()}</p><h3 className="mt-2 font-display text-xl">{h}</h3><p className="mt-2 text-[15px] text-hunter/75">{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Process */}
      <Process />

      {/* 12. Verified reviews / documentation */}
      <Reviews />

      {/* 13. Service areas */}
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl md:text-[40px]">Serving Greater Boston.</h2>
          <div className="mt-8"><TownPills /></div>
          <p className="mt-6 text-hunter/75">Don&apos;t see your town? <Link href="/contact" className="font-semibold underline">Send us your address</Link> and we&apos;ll confirm coverage.</p>
          <Link href="/service-areas" className="btn btn-hunter mt-6">View Full Service Area</Link>
        </div>
      </section>

      {/* 14. FAQ */}
      <FaqSection faqs={HOME_FAQ} />

      {/* 15. Final conversion */}
      <section className="bg-hunter px-5 py-20 text-white" id="get-started">
        <div className="mx-auto max-w-[620px]">
          <h2 className="text-center font-display text-3xl md:text-[40px]">Ready to see what your deck or fence needs?</h2>
          <p className="mt-3 text-center text-sage">Free photo assessment. No pressure. We&apos;ll reply {responsePhrase()}.</p>
          <div className="mt-8 text-hunter"><PhotoAssessmentForm condensed /></div>
          {tel && site.phone && (
            <div className="mt-8 text-center">
              <p className="text-sage">or</p>
              <a href={tel} className="mt-2 block font-display text-3xl text-linen">{site.phone}</a>
              <p className="text-sm text-sage">Call or text, we answer both.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
