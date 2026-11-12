import Link from "next/link";
import { meta, businessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { FaqSection } from "@/components/ui/Faq";
import { Checklist, Process, SectionHead, ServicesGrid, TownPills, TrustBar } from "@/components/sections/Blocks";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { PortfolioPlanner } from "@/components/tools/PortfolioPlanner";
import { Reviews } from "@/components/sections/Reviews";
import { SERVICE_PROMISE } from "@/lib/programs";
import { site, responsePhrase, phoneHref } from "@/config/site";
import { TOWNS } from "@/lib/towns";

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

      {/* Hero: full-bleed photography */}
      <section className="relative isolate overflow-hidden bg-char text-white">
        <div className="photo-shade-side absolute inset-0 -z-10"><Photo k="heroModernDeck" priority sizes="100vw" position="60% 60%" /></div>
        <div className="mx-auto grid min-h-[calc(100svh-110px)] max-w-[1320px] content-end px-5 pt-28 pb-14 md:min-h-[720px] lg:px-8 lg:pb-20">
          <p className="eyebrow rule rise text-cedar-light">Greater Boston deck &amp; fence specialists</p>
          <h1 className="rise-2 mt-6 max-w-[15ch] font-display text-[44px] leading-[0.98] md:text-[84px]">
            Decks done right. <span className="accent text-cedar-light">Built for Boston.</span>
          </h1>
          <p className="rise-3 mt-7 max-w-[540px] text-[17px] leading-relaxed text-white/85 md:text-lg">Repair, refinishing, railings and fencing for homeowners, associations, landlords and commercial properties. Start with three photos and get an honest read on what your deck actually needs.</p>
          <div className="rise-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/free-assessment" className="btn btn-cedar !min-h-[56px] !px-7 !text-base">Send 3 photos for a free assessment</Link>
            <Link href="/property-programs" className="btn btn-ghost !min-h-[56px]">Managing multiple properties?</Link>
          </div>
          <dl className="mt-14 grid max-w-3xl grid-cols-1 gap-6 border-t border-white/20 pt-6 text-sm sm:grid-cols-3">
            <div><dt className="eyebrow text-white/60">Step one</dt><dd className="mt-1.5 text-white">Free photo assessment</dd></div>
            <div><dt className="eyebrow text-white/60">Before any work</dt><dd className="mt-1.5 text-white">Written scope and price</dd></div>
            <div><dt className="eyebrow text-white/60">Who we serve</dt><dd className="mt-1.5 text-white">Homes, HOAs, landlords, businesses</dd></div>
          </dl>
        </div>
      </section>

      <TrustBar />

      {/* Why Boston decks fail early */}
      <section className="bg-bone px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto">
            <Photo k="autumnBoards" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <div>
            <SectionHead eyebrow="Why Boston decks fail early" title="It looked fine last summer." accent="Then winter happened." />
            <div className="mt-8 grid gap-6 text-[17px] leading-relaxed text-char/80 md:grid-cols-2">
              <p>New England decks take a beating most of the country never sees. Water soaks into unsealed boards in fall, freezes, expands and splits the wood from inside. Snow sits for weeks. By spring, gray boards, loose railings and soft spots show up all at once.</p>
              <p>Most of it is fixable. The trick is catching it before water reaches the framing. A few replaced boards and a fresh seal cost a fraction of a rebuild, and waiting is usually how one becomes the other.</p>
            </div>
            <ol className="mt-12 divide-y divide-line border-y border-line">
              {[["Freeze-thaw damage", "Water in the wood freezes and splits boards every winter."], ["Water at the framing", "Rot at the joists and ledger is what turns a repair into a rebuild."], ["UV graying", "Gray isn't old. It's unprotected wood breaking down at the surface."]].map(([t, b], i) => (
                <li key={t} className="grid grid-cols-[48px_1fr] gap-4 py-5 md:grid-cols-[64px_220px_1fr]">
                  <span className="num text-2xl text-cedar">0{i + 1}</span>
                  <span className="font-semibold">{t}</span>
                  <span className="col-span-2 text-stone md:col-span-1">{b}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col gap-6 bg-char p-7 text-white md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="eyebrow text-cedar-light">The cost of waiting, in Greater Boston terms</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">Clean and seal <b className="text-white">$300–$1,500</b> · Typical repair <b className="text-white">$1,160–$4,161</b> · Full resurfacing <b className="text-white">$15–$50 / sq ft</b>. Planning ranges only; your price is confirmed in writing.</p>
              </div>
              <Link href="/free-assessment" className="btn btn-cedar shrink-0">Find out what you have</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-char px-5 py-24 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead dark eyebrow="What we do" title="Decks and fences," accent="repaired, restored and built to last." />
            <Link href="/repair-or-replace" className="link-arrow shrink-0 text-cedar-light">Repair or replace? Check in a minute →</Link>
          </div>
          <div className="mt-14"><ServicesGrid /></div>
        </div>
      </section>

      {/* Craft band */}
      <section className="relative isolate overflow-hidden bg-char text-white">
        <div className="photo-shade absolute inset-0 -z-10"><Photo k="crewFraming" sizes="100vw" position="50% 40%" /></div>
        <div className="mx-auto flex min-h-[520px] max-w-[1320px] flex-col justify-end px-5 py-16 lg:px-8">
          <p className="eyebrow rule text-cedar-light">How we work</p>
          <p className="mt-5 max-w-4xl font-display text-[30px] leading-[1.1] md:text-[50px]">We replace what failed, keep what&apos;s sound, and <span className="accent text-cedar-light">tell you which is which</span> before you spend a dollar.</p>
        </div>
      </section>

      {/* Fencing */}
      <section className="bg-bone px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <SectionHead eyebrow="Residential and commercial fencing" title="Fences built for" accent="New England winters." />
            <p className="mt-6 text-[17px] leading-relaxed text-char/80">Frost heave lifts posts, rot starts at the ground line, and storms do the rest. We repair, replace and install fencing for homes, associations and commercial properties. Every dig starts with a Dig Safe request, as Massachusetts law requires.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/fencing/residential" className="btn btn-char">Residential fencing</Link>
              <Link href="/fencing/commercial" className="btn btn-outline">Commercial and property fencing</Link>
            </div>
          </div>
          <div className="relative order-1 aspect-[4/5] overflow-hidden lg:order-2"><Photo k="fenceGarden" sizes="(min-width:1024px) 50vw, 100vw" /></div>
        </div>
      </section>

      {/* Repair-or-Replace Checker teaser */}
      <section className="border-y border-line bg-ivory px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead eyebrow="Repair-or-replace checker" title="Repair or rebuild?" accent="Get a read in a minute." sub="Answer seven quick questions about age, boards, framing, railings and stairs. You'll get a preliminary read, then send photos so we can confirm." />
            <p className="mt-4 text-sm text-stone">An informational guide, not an inspection or safety certification.</p>
          </div>
          <div className="bg-char p-8 text-white shadow-premium md:p-10">
            <p className="eyebrow text-cedar-light">Three possible results</p>
            <ul className="mt-6 space-y-4 text-[16px]">
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 bg-cedar-light" />Potential repair candidate</li>
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 bg-cedar" />Professional inspection recommended</li>
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 bg-fog" />Replacement may be worth evaluating</li>
            </ul>
            <Link href="/repair-or-replace" className="btn btn-cedar mt-8 w-full">Start the checker</Link>
          </div>
        </div>
      </section>

      {/* Property programs */}
      <section className="bg-bone px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead eyebrow="For associations, landlords and managers" title="Twenty decks. One schedule." accent="One contact." />
              <p className="mt-6 text-[17px] leading-relaxed text-char/80">Associations and landlords don&apos;t need another contractor who takes one unit at a time and disappears. DeckCraft scopes every property up front, gives you one written schedule and sends photo reports so you don&apos;t have to be on site.</p>
              <div className="mt-8"><Checklist items={SERVICE_PROMISE} /></div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/request-walkthrough" className="btn btn-char">Request a property walkthrough</Link>
                <Link href="/property-programs" className="btn btn-outline">See the programs</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                {[["HOA and Condo", "/hoa-condo"], ["Landlords and PMs", "/landlords"], ["Commercial", "/commercial"]].map(([l, h]) => (
                  <Link key={h} href={h} className="link-arrow text-cedar">{l} →</Link>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative aspect-[16/10] overflow-hidden"><Photo k="townhomeDeck" sizes="(min-width:1024px) 50vw, 100vw" /></div>
              <PortfolioPlanner compact />
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal */}
      <section className="bg-char px-5 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <SectionHead dark eyebrow="Seasonal protection" title="The right work at" accent="the right time of year." />
          <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-4">
            {[
              ["Mar–May", "Winter was hard on your deck.", "Spring safety checks, board and railing repairs before the season starts."],
              ["Jun–Sep", "Make your deck ready for summer.", "Prime staining and sealing season, when wood is dry and nights are warm."],
              ["Oct–Nov", "Seal before the freeze.", "Last dry windows to keep water out of the wood through winter."],
              ["Dec–Feb", "Reserve your spring project.", "Design, permit and book rebuilds and fences before calendars fill."],
            ].map(([m, h, b]) => (
              <div key={m} className="bg-char p-7"><p className="num text-xl text-cedar-light">{m}</p><h3 className="mt-4 text-lg font-semibold">{h}</h3><p className="mt-2 text-[15px] leading-relaxed text-white/65">{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <Process />

      <Reviews />

      {/* Service areas */}
      <section className="bg-bone px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative aspect-[3/2] overflow-hidden"><Photo k="newEnglandHome" sizes="(min-width:1024px) 45vw, 100vw" /></div>
          <div>
            <SectionHead eyebrow="Service area" title={`${TOWNS.length}+ communities across`} accent="Greater Boston." />
            <div className="mt-8"><TownPills /></div>
            <p className="mt-6 text-stone">Don&apos;t see your town? <Link href="/contact" className="font-semibold text-char underline decoration-cedar underline-offset-4">Send us your address</Link> and we&apos;ll confirm coverage.</p>
            <Link href="/service-areas" className="btn btn-char mt-8">View the full service area</Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={HOME_FAQ} />

      {/* Final conversion */}
      <section className="relative isolate overflow-hidden bg-char px-5 py-24 text-white lg:px-8" id="get-started">
        <div className="absolute inset-0 -z-10 opacity-30"><Photo k="lakeDeck" sizes="100vw" /></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-char/80 to-char" />
        <div className="mx-auto max-w-[680px]">
          <p className="eyebrow text-center text-cedar-light">Free photo assessment</p>
          <h2 className="mt-4 text-center font-display text-[34px] leading-tight md:text-[48px]">Ready to see what your deck or fence <span className="accent text-cedar-light">really needs?</span></h2>
          <p className="mt-4 text-center text-white/75">No pressure. We&apos;ll reply {responsePhrase()}.</p>
          <div className="mt-10 text-char"><PhotoAssessmentForm condensed /></div>
          {tel && site.phone && (
            <div className="mt-8 text-center">
              <p className="text-white/60">or</p>
              <a href={tel} className="mt-2 block font-display text-3xl text-cedar-light">{site.phone}</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
