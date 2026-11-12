import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { site, phoneHref, responsePhrase } from "@/config/site";

export const metadata = meta("/contact", "Contact DeckCraft Boston: Greater Boston Deck and Fence Specialists", "Send photos or email info@deckcraftbuild.com. Serving Greater Boston.");

export default function Page() {
  const tel = phoneHref();
  return (
    <>
      <PageHero compact eyebrow="CONTACT" h1="Talk to DeckCraft Boston." sub="Photos are the fastest way to a real answer. You can also email us directly." />
      <section className="bg-cream px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 text-[15px] lg:sticky lg:top-28 lg:self-start">
            {tel && site.phone && <a href={tel} className="block font-display text-3xl">{site.phone}</a>}
            <p className="eyebrow text-cedar-deep">Email</p>
            <a href={`mailto:${site.email}`} className="block font-display text-xl underline decoration-copper underline-offset-4">{site.email}</a>
            <div className="border-l-2 border-cedar bg-white p-5 text-[14.5px] leading-relaxed text-stone">
              <p className="font-semibold text-char">Helpful to include</p>
              <p className="mt-2">Your town, what needs attention, and 3 photos: the whole deck or fence, the worst spots, and the stairs or gates.</p>
            </div>
            {site.responseHours && <p>We reply {responsePhrase()}.</p>}
            {site.hours && <p>{site.hours.label}</p>}
            {Object.values(site.social).some(Boolean) && <p>Follow along: {Object.entries(site.social).filter(([, u]) => u).map(([k, u]) => <a key={k} href={u!} className="mr-3 underline" rel="noopener" target="_blank">{k[0].toUpperCase() + k.slice(1)}</a>)}</p>}
            <p className="text-sm text-hunter/70">Serving Greater Boston. See the <a className="underline" href="/service-areas">service area</a>.</p>
          </div>
          <PhotoAssessmentForm condensed />
        </div>
      </section>
    </>
  );
}
