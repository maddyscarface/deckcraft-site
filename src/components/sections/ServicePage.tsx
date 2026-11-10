import Link from "next/link";
import { SERVICES, LINK_LABELS } from "@/lib/services";
import { JsonLd } from "../ui/JsonLd";
import { Icon } from "../ui/Icon";
import { BeforeAfter } from "../ui/BeforeAfter";
import { FaqSection } from "../ui/Faq";
import { PageHero, PriceGuide, Process, RelatedLinks } from "./Blocks";
import { PhotoAssessmentForm } from "../forms/PhotoAssessmentForm";
import { WalkthroughForm } from "../forms/WalkthroughForm";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { ViewService } from "./ViewService";

export function ServicePage({ id }: { id: string }) {
  const s = SERVICES[id];
  const path = `/${s.slug}`;
  const variant = s.slug.startsWith("fencing") ? "fence" : s.slug.includes("railing") ? "rail" : "deck";
  return (
    <>
      <JsonLd data={[serviceSchema(s.schemaType, path), breadcrumbSchema([["Home", "/"], [s.name, path]])]} />
      <ViewService name={s.name} />
      <PageHero eyebrow={s.eyebrow} h1={s.h1} sub={s.subhead}>
        {s.formKind === "walkthrough" ? (
          <Link href="#get-started" className="btn btn-linen">Request a Property Walkthrough</Link>
        ) : (
          <Link href="#get-started" className="btn btn-linen">Send 3 Photos — Get a Free Assessment</Link>
        )}
        {s.formKind === "assessment" && <Link href="/property-programs" className="btn btn-ghost">Managing multiple properties?</Link>}
      </PageHero>

      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl">What&apos;s included</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.included.map((i) => (
              <div key={i.title} className="rounded-lg bg-white p-6 shadow-card">
                <Icon name="CircleCheck" className="text-linen-dark" />
                <h3 className="mt-3 font-semibold">{i.title}</h3>
                <p className="mt-1 text-[15px] text-hunter/75">{i.body}</p>
              </div>
            ))}
          </div>
          {s.extra?.map((e) => (
            <div key={e.title} className="mt-8 rounded-lg border-l-4 border-linen bg-white p-6">
              <p className="font-display text-xl">{e.title}</p><p className="mt-1 text-hunter/80">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-hunter px-5 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl">Before and after</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <BeforeAfter variant={variant} /><BeforeAfter variant={variant} /><BeforeAfter variant={variant} />
          </div>
          <p className="mt-4 text-sm text-sage">Illustrations shown until real {s.name.toLowerCase()} projects are photographed with owner permission.</p>
        </div>
      </section>

      {s.prices && (
        <section className="bg-white px-5 py-20">
          <div className="mx-auto max-w-3xl"><PriceGuide rows={s.prices} /></div>
        </section>
      )}

      <Process cta={false} />
      <FaqSection faqs={s.faqs} />

      <section id="get-started" className="bg-linen-pale px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl">{s.formKind === "walkthrough" ? "Tell us about your properties." : "Start with 3 photos."}</h2>
          <p className="mt-2 mb-8 text-hunter/75">{s.formKind === "walkthrough" ? "Free walkthrough for associations, landlords and commercial properties." : "Free, no obligation. We reply with what we see and a price range."}</p>
          {s.formKind === "walkthrough" ? <WalkthroughForm presetService={s.presetService} /> : <PhotoAssessmentForm presetService={s.presetService} />}
        </div>
      </section>

      <RelatedLinks links={s.related.map((r) => ({ href: `/${r}`, label: LINK_LABELS[r] ?? r }))} />
    </>
  );
}
