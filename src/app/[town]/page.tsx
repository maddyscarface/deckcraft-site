import Link from "next/link";
import { notFound } from "next/navigation";
import { TOWNS, TOWN_BY_SLUG } from "@/lib/towns";
import { meta, breadcrumbSchema, serviceSchema, webPageSchema, faqSchema, pageGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqSection } from "@/components/ui/Faq";
import { PageHero, ServicesGrid } from "@/components/sections/Blocks";
import { PermitNote } from "@/components/sections/Editorial";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { Icon } from "@/components/ui/Icon";
import { POSTS } from "@/lib/blog";

export const dynamicParams = false;
const TOWN_PHOTOS = ["newEnglandHome", "townhomeDeck", "gardenDeck", "cabinDeck", "lakeDeck", "heroModernDeck"] as const;
export function generateStaticParams() { return TOWNS.map((t) => ({ town: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }) {
  const t = TOWN_BY_SLUG[(await params).town];
  if (!t) return {};
  return meta(`/${t.slug}`, `Deck and Fence Repair in ${t.name}, MA | DeckCraft`,
    `Deck repair, staining, railings and fencing in ${t.name}, MA for homeowners, associations and landlords. Send photos for an assessment. Coverage is confirmed when you share your address.`);
}

export default async function Page({ params }: { params: Promise<{ town: string }> }) {
  const t = TOWN_BY_SLUG[(await params).town];
  if (!t) notFound();
  const path = `/${t.slug}`;
  const typical = t.typicalJobs.join("; ");
  const faqs = [
    { q: `Do you work in ${t.name}?`, a: `${t.name} is on our Greater Boston coverage list, including ${t.neighborhoods.slice(0, 4).join(", ")}. Send your address and we'll confirm we can schedule a visit. Listing a town is not a guarantee of next-day availability.` },
    { q: `Does ${t.name} require a permit for deck or fence work?`, a: `It depends on the scope and on ${t.name}'s building department. Structural deck work and some fences often need a permit in Massachusetts; cosmetic work sometimes does not. We check the local rules for every job and pull permits where required.` },
    { q: `What deck work is most common in ${t.name}?`, a: `Given the housing here, typical requests include: ${typical}. Those are patterns in the housing stock, not a claim about a completed local project we can show you yet.` },
    { q: "How does the photo assessment work?", a: "Send 3 photos. We review them and reply with what we see and how we would price it. A photo review is not a structural inspection. Any visit is booked with you first." },
  ];
  const guides = POSTS.filter((p) => ["deck-repair-vs-replace", "when-should-a-railing-be-inspected", "deck-maintenance-before-winter"].includes(p.slug));
  return (
    <>
      <JsonLd data={pageGraph([
        webPageSchema(path, `Deck and Fence Repair in ${t.name}, MA`, `Deck repair, staining, railings and fencing in ${t.name}, MA.`),
        serviceSchema(`Deck and fence repair in ${t.name}, MA`, path),
        breadcrumbSchema([["Home", "/"], ["Service Areas", "/service-areas"], [t.name, path]]),
        faqSchema(faqs, path),
      ])} />
      <nav aria-label="Breadcrumb" className="border-b border-line bg-ivory px-5 py-3 text-[13px] text-stone lg:px-8">
        <ol className="mx-auto flex max-w-[1320px] flex-wrap gap-2">
          <li><Link href="/" className="hover:text-char">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/service-areas" className="hover:text-char">Service Areas</Link></li>
          <li aria-hidden>/</li>
          <li className="text-char">{t.name}, MA</li>
        </ol>
      </nav>
      <PageHero photo={TOWN_PHOTOS[TOWNS.findIndex((x) => x.slug === t.slug) % TOWN_PHOTOS.length]} eyebrow={`${t.name.toUpperCase()}, MA`} h1={`Deck and Fence Repair in ${t.name}, MA`} sub={t.intro}>
        <Link href="#get-started" className="btn btn-cedar">Send Photos for a Deck Assessment</Link>
        <Link href="/request-walkthrough" className="btn btn-ghost">Managing {t.name} properties?</Link>
      </PageHero>
      <section className="bg-bone px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[32px] leading-tight md:text-[42px]">Decks and fences in <span className="accent text-cedar">{t.name}</span></h2>
            <p className="mt-4 text-lg leading-relaxed text-char/85">{t.housing}</p>
            <h3 className="mt-8 font-semibold">Typical work on decks and fences here</h3>
            <p className="mt-2 text-sm text-stone">These are patterns we see in the local housing, not a gallery of completed jobs in {t.name}. Real project stories will be added when we have permission to share them.</p>
            <ul className="mt-3 space-y-2">{t.typicalJobs.map((j) => <li key={j} className="flex gap-2"><Icon name="CircleCheck" className="mt-0.5 shrink-0 text-cedar" />{j}</li>)}</ul>
            <p className="mt-8 rounded-[2px] border-l-4 border-cedar bg-white p-4">{t.propertyAngle}</p>
            <div className="mt-8"><PermitNote compact /></div>
          </div>
          <div className="rounded-[2px] bg-white p-6 shadow-card">
            <h3 className="font-semibold">Neighborhoods in {t.name}</h3>
            <p className="mt-2 text-sm text-stone">We use these names to describe the housing and access, then confirm scheduling from your address.</p>
            <div className="mt-3 flex flex-wrap gap-2">{t.neighborhoods.map((n) => <span key={n} className="border border-line bg-bone px-3 py-1.5 text-sm">{n}</span>)}</div>
            <h3 className="mt-6 font-semibold">Nearby towns we also list</h3>
            <div className="mt-3 flex flex-wrap gap-2">{t.nearby.map((s) => <Link key={s} href={`/${s}`} className="inline-flex min-h-11 items-center border border-char/30 px-3 text-sm hover:bg-char hover:text-white">{TOWN_BY_SLUG[s]?.name}</Link>)}</div>
            <h3 className="mt-8 font-semibold">Useful guides</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {guides.map((g) => (
                <li key={g.slug}><Link href={`/blog/${g.slug}`} className="font-semibold text-cedar-deep hover:underline">{g.title} →</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-char px-5 py-24 text-white lg:px-8"><div className="mx-auto max-w-[1320px]"><h2 className="mb-12 font-display text-[32px] md:text-[42px]">Services in {t.name}</h2><ServicesGrid /></div></section>
      <FaqSection faqs={faqs} />
      <section id="get-started" className="scroll-mt-20 bg-cedar-soft px-5 py-24">
        <div className="mx-auto max-w-3xl"><h2 className="mb-8 font-display text-3xl">Free photo assessment in {t.name}</h2><PhotoAssessmentForm presetTown={t.name} /></div>
      </section>
    </>
  );
}
