import Link from "next/link";
import { notFound } from "next/navigation";
import { TOWNS, TOWN_BY_SLUG } from "@/lib/towns";
import { meta, breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqSection } from "@/components/ui/Faq";
import { PageHero, ServicesGrid } from "@/components/sections/Blocks";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { Icon } from "@/components/ui/Icon";

export const dynamicParams = false;
export function generateStaticParams() { return TOWNS.map((t) => ({ town: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }) {
  const t = TOWN_BY_SLUG[(await params).town];
  if (!t) return {};
  return meta(`/${t.slug}`, `Deck and Fence Repair in ${t.name}, MA | DeckCraft Boston`,
    `Deck repair, staining, railings, and fencing in ${t.name}, MA for homeowners, associations, and landlords. Free photo assessment.`);
}

export default async function Page({ params }: { params: Promise<{ town: string }> }) {
  const t = TOWN_BY_SLUG[(await params).town];
  if (!t) notFound();
  const faqs = [
    { q: `Do you serve all of ${t.name}?`, a: `Yes, including ${t.neighborhoods.slice(0, 4).join(", ")} and the rest of ${t.name}. Send your address and we'll confirm scheduling.` },
    { q: `Does ${t.name} require a permit for deck or fence work?`, a: `It depends on the scope. Structural deck work and some fences need a permit. We check ${t.name}'s rules for every job and pull permits where required.` },
    { q: `What deck work is most common in ${t.name}?`, a: `${t.typicalJobs.join("; ")}.` },
    { q: "How does the free assessment work?", a: "Send 3 photos. We review them and reply with what we see and a price range before anyone visits." },
  ];
  return (
    <>
      <JsonLd data={[serviceSchema(`Deck and fence repair in ${t.name}, MA`, `/${t.slug}`), breadcrumbSchema([["Home", "/"], ["Service Areas", "/service-areas"], [t.name, `/${t.slug}`]])]} />
      <PageHero eyebrow={`${t.name.toUpperCase()}, MA`} h1={`Deck and Fence Repair in ${t.name}, MA`} sub={t.intro}>
        <Link href="#get-started" className="btn btn-linen">Send 3 Photos — Get a Free Assessment</Link>
        <Link href="/request-walkthrough" className="btn btn-ghost">Managing {t.name} properties?</Link>
      </PageHero>
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Decks and fences in {t.name}</h2>
            <p className="mt-4 text-lg leading-relaxed text-hunter/85">{t.housing}</p>
            <h3 className="mt-8 font-semibold">What we&apos;re most often asked to do here</h3>
            <ul className="mt-3 space-y-2">{t.typicalJobs.map((j) => <li key={j} className="flex gap-2"><Icon name="CircleCheck" className="mt-0.5 shrink-0 text-linen-dark" />{j}</li>)}</ul>
            <p className="mt-8 rounded-md border-l-4 border-patina bg-white p-4">{t.propertyAngle}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h3 className="font-semibold">Neighborhoods we serve in {t.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2">{t.neighborhoods.map((n) => <span key={n} className="rounded-full bg-cream px-3 py-1 text-sm">{n}</span>)}</div>
            <h3 className="mt-6 font-semibold">Nearby</h3>
            <div className="mt-3 flex flex-wrap gap-2">{t.nearby.map((s) => <Link key={s} href={`/${s}`} className="rounded-full border border-hunter px-3 py-1 text-sm hover:bg-hunter hover:text-white">{TOWN_BY_SLUG[s]?.name}</Link>)}</div>
          </div>
        </div>
      </section>
      <section className="bg-hunter px-5 py-20 text-white"><div className="mx-auto max-w-7xl"><h2 className="mb-8 font-display text-3xl">Services in {t.name}</h2><ServicesGrid /></div></section>
      <FaqSection faqs={faqs} />
      <section id="get-started" className="bg-linen-pale px-5 py-20">
        <div className="mx-auto max-w-3xl"><h2 className="mb-8 font-display text-3xl">Free photo assessment in {t.name}</h2><PhotoAssessmentForm presetTown={t.name} /></div>
      </section>
    </>
  );
}
