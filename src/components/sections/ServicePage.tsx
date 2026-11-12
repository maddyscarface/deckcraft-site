import Link from "next/link";
import { SERVICES, LINK_LABELS } from "@/lib/services";
import { JsonLd } from "../ui/JsonLd";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";
import { FaqSection } from "../ui/Faq";
import { PageHero, PriceGuide, Process, RelatedLinks, SectionHead } from "./Blocks";
import { PhotoAssessmentForm } from "../forms/PhotoAssessmentForm";
import { WalkthroughForm } from "../forms/WalkthroughForm";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { ViewService } from "./ViewService";
import { ROUTE_PHOTO } from "@/lib/page-photos";
import type { PhotoKey } from "@/lib/photos";

/** Secondary editorial photo per service (illustrative; never presented as a DeckCraft job). */
const DETAIL_PHOTO: Record<string, PhotoKey> = {
  "services/deck-repair": "weatheredBoards",
  "services/deck-staining-sealing": "deckShadows",
  "services/board-railing-stairs": "lakeDeck",
  "services/new-decks": "heroModernDeck",
  "fencing/residential": "eveningLights",
  "fencing/commercial": "townhomeDeck",
};

export function ServicePage({ id }: { id: string }) {
  const s = SERVICES[id];
  const path = `/${s.slug}`;
  const walk = s.formKind === "walkthrough";
  const detail = DETAIL_PHOTO[s.slug] ?? "deckShadows";
  return (
    <>
      <JsonLd data={[serviceSchema(s.schemaType, path), breadcrumbSchema([["Home", "/"], [s.name, path]])]} />
      <ViewService name={s.name} />
      <PageHero eyebrow={s.eyebrow} h1={s.h1} sub={s.subhead} photo={ROUTE_PHOTO[path] ?? "heroModernDeck"}>
        <Link href="#get-started" className="btn btn-cedar">{walk ? "Request a property walkthrough" : "Send 3 photos for a free assessment"}</Link>
        {s.formKind === "assessment" && <Link href="/property-programs" className="btn btn-ghost">Managing multiple properties?</Link>}
      </PageHero>

      <nav aria-label="Breadcrumb" className="border-b border-line bg-ivory px-5 py-3 text-[13px] text-stone lg:px-8">
        <ol className="mx-auto flex max-w-[1320px] gap-2"><li><Link href="/" className="hover:text-char">Home</Link></li><li aria-hidden>/</li><li className="text-char">{s.name}</li></ol>
      </nav>

      <section className="bg-bone px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <SectionHead eyebrow="What's included" title={s.name} accent="done properly." />
          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {s.included.map((i, n) => (
              <div key={i.title} className="bg-bone p-7 md:p-8">
                <p className="num text-lg text-cedar">{String(n + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-[17px] font-semibold">{i.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone">{i.body}</p>
              </div>
            ))}
          </div>
          {s.extra?.map((e) => (
            <div key={e.title} className="mt-8 border-l-2 border-cedar bg-white p-7">
              <p className="font-display text-xl">{e.title}</p><p className="mt-2 text-char/80">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-char text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[560px]"><Photo k={detail} sizes="(min-width:1024px) 50vw, 100vw" /></div>
          <div className="flex flex-col justify-center px-5 py-16 lg:px-16">
            <p className="eyebrow rule text-cedar-light">Honest assessment</p>
            <h2 className="mt-4 font-display text-[30px] leading-tight md:text-[42px]">We tell you what it needs, <span className="accent text-cedar-light">and what it doesn&apos;t.</span></h2>
            <p className="mt-6 max-w-lg text-white/75">Your photos tell us most of the story. We reply with what we see, whether it looks like a repair, a refinish or a rebuild, and a realistic range. If it isn&apos;t worth fixing, we&apos;ll say so.</p>
            <ul className="mt-8 space-y-3 text-[15px] text-white/85">
              {["Written scope and price before work starts", "Permits pulled where the work requires them", "Photos of the finished work for your records"].map((t) => (
                <li key={t} className="flex gap-3"><Icon name="Check" size={18} className="mt-0.5 text-cedar-light" />{t}</li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-white/40">Photo: licensed stock, shown to illustrate the service.</p>
          </div>
        </div>
      </section>

      {s.prices && (
        <section className="bg-ivory px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl"><PriceGuide rows={s.prices} /></div>
        </section>
      )}

      <Process cta={false} />
      <FaqSection faqs={s.faqs} />

      <section id="get-started" className="scroll-mt-20 bg-cedar-soft px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead eyebrow={walk ? "Property walkthrough" : "Free photo assessment"} title={walk ? "Tell us about your properties." : "Start with"} accent={walk ? undefined : "three photos."} sub={walk ? "Free walkthrough for associations, landlords and commercial properties." : "Free, no obligation. We reply with what we see and a price range."} />
          </div>
          <div>{walk ? <WalkthroughForm presetService={s.presetService} /> : <PhotoAssessmentForm presetService={s.presetService} />}</div>
        </div>
      </section>

      <RelatedLinks links={s.related.map((r) => ({ href: `/${r}`, label: LINK_LABELS[r] ?? r }))} />
    </>
  );
}
