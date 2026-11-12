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
import { PRICING, pricingLabel } from "@/config/pricing";
import { activeSeasonal, seasonalSchedule } from "@/config/seasonal";

export const metadata = meta("/", "Decks Built for New England | Deck Building, Repair and Fencing in Greater Boston | DeckCraft",
  "New decks, rebuilds, structural repairs, railings, staining and fencing for Greater Boston homes, HOAs and commercial properties. Get a new deck estimate or send 3 photos for an assessment.");

const HOME_FAQ = [
  { q: "How much does deck repair cost in Boston?", a: "Repair is priced by what has failed (boards, framing, ledger, railings or stairs), so we quote it from your photos rather than publishing a list. It is priced separately from new decks, which we plan from a starting assumption of $39.99 per sq ft (to be confirmed). Your exact price is confirmed in writing after an on-site check." },
  { q: "Is it better to repair or replace a deck?", a: "If the framing, joists, posts and ledger are sound, repair is usually the better value. If rot has reached the structure, replacement is often safer. Try our Repair-or-Replace Checker, then send photos so we can confirm." },
  { q: "When should you seal a deck in Massachusetts?", a: "Late spring through early fall, when the wood is dry and overnight temperatures stay above roughly 50°F. Sealing before the first freeze helps keep water out of the wood through winter." },
  { q: "Does an older deck need a structural inspection?", a: "Not automatically, but soft boards, rot at the joists or ledger, or posts that move are reasons to have it looked at in person before using it heavily. Our photo review is a starting point, not an inspection." },
  { q: "Do you work with condo associations and landlords?", a: "Yes. We offer annual inspections, preferred vendor agreements and phased capital repair programs, with written scopes and photo reports for every property." },
  { q: "What's the free assessment?", a: "Send 3 photos. We review them and reply with what we see and the sensible next step. If it's not worth fixing, we'll say so. Any on-site visit is booked with you first, never assumed." },
];

export default function Home() {
  const tel = phoneHref();
  const season = activeSeasonal();
  return (
    <>
      <JsonLd data={businessSchema()} />

      {/* Hero: split editorial layout, navy text panel + photograph (no scrim over the photo) */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-[1440px] lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
          <div className="flex flex-col justify-center px-5 pt-14 pb-12 sm:px-8 lg:py-20 lg:pl-12 lg:pr-14 xl:pl-[max(2rem,calc((100vw-1320px)/2))]">
            <p className="eyebrow rule rise text-cedar-light">Greater Boston deck &amp; fence specialists</p>
            <h1 className="rise-2 mt-6 font-display text-[42px] leading-[1.0] md:text-[64px] xl:text-[72px]">
              Decks Built for New England. <span className="accent text-cedar-light">Work You Can See.</span>
            </h1>
            <p className="rise-3 mt-7 max-w-[520px] text-[17px] leading-relaxed text-white/80 md:text-lg">New decks, rebuilds, structural repairs, railings, staining and fences for homeowners, associations and commercial properties. Every job is scoped from photos and written down before work starts.</p>
            <div className="rise-3 mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/new-deck-estimate" className="btn btn-cedar !min-h-[56px] !px-7 !text-base">Get a New Deck Estimate</Link>
              <Link href="/free-assessment" className="btn btn-ghost !min-h-[56px] !px-7 !text-base">Send 3 Photos for an Assessment</Link>
            </div>
            <p className="rise-3 mt-6 text-[14px] text-white/65">Managing an HOA, rental portfolio or commercial site? <Link href="/request-walkthrough" className="font-semibold text-white underline decoration-cedar-light underline-offset-4">Request a property walkthrough</Link></p>
          </div>
          <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-0">
            <Photo k="heroModernDeck" priority sizes="(min-width:1024px) 55vw, 100vw" position="55% 60%" />
            <span className="absolute bottom-3 right-3 bg-navy/80 px-2.5 py-1 text-[11px] tracking-wide text-white/80">Illustrative photo</span>
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="border-b border-line bg-ivory px-5 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0">
          <Link href="/free-assessment" className="group flex flex-col gap-2 py-9 md:pr-10">
            <p className="eyebrow text-cedar">Have a deck that needs work?</p>
            <p className="font-display text-[26px] leading-tight text-char">Repair, refinish or replace. Start with three photos.</p>
            <p className="text-[15px] text-stone">We tell you what failed, what&apos;s sound and what it&apos;s worth fixing. Repairs and sealing are quoted from your photos.</p>
            <span className="mt-2 text-sm font-semibold text-cedar-deep">Send 3 Photos for an Assessment <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span></span>
          </Link>
          <Link href="/project-calculator" className="group flex flex-col gap-2 py-9 md:pl-10">
            <p className="eyebrow text-cedar">Planning a new deck?</p>
            <p className="font-display text-[26px] leading-tight text-char">See a planning figure before anyone visits.</p>
            <p className="text-[15px] text-stone">Enter a size and get a starting figure and budget band, clearly labelled as planning assumptions.</p>
            <span className="mt-2 text-sm font-semibold text-cedar-deep">Open the project calculator <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span></span>
          </Link>
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
            <div className="mt-10 flex flex-col gap-6 bg-navy p-7 text-white md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="eyebrow text-cedar-light">How we price · {pricingLabel()}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">Repairs, staining and sealing are <b className="text-white">quoted from your photos</b>. New decks are planned from <b className="text-white">${PRICING.newDeckStartPerSqFt} / sq ft</b> starting, in bands of {PRICING.planningBands.map((b) => b.label).join(" · ")}. Your price is confirmed in writing.</p>
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
            {seasonalSchedule().filter((m) => m.enabled).map((m) => (
              <div key={m.id} className={`bg-char p-7 ${m.id === season?.id ? "outline outline-1 -outline-offset-1 outline-cedar" : ""}`}>
                <p className="num text-xl text-cedar-light">{m.label}</p>
                <h3 className="mt-4 text-lg font-semibold">{m.headline}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{m.body}</p>
                {m.id === season?.id && <Link href={m.cta.href} className="mt-5 inline-block text-sm font-semibold text-cedar-light underline-offset-4 hover:underline">Now: {m.cta.label} →</Link>}
              </div>
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
        <div className="absolute inset-0 -z-10 bg-char/85" />
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
