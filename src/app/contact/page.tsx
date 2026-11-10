import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { site, phoneHref, responsePhrase } from "@/config/site";

export const metadata = meta("/contact", "Contact DeckCraft Boston: Greater Boston Deck and Fence Specialists", "Call, text, or send a message. Serving Greater Boston.");

export default function Page() {
  const tel = phoneHref();
  return (
    <>
      <PageHero compact eyebrow="CONTACT" h1="Talk to DeckCraft Boston." sub="Photos are the fastest way to a real answer, but you can reach us any way you like." />
      <section className="bg-cream px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 text-[15px]">
            {tel && site.phone && <a href={tel} className="block font-display text-3xl">{site.phone}</a>}
            <a href={`mailto:${site.email}`} className="block font-semibold underline">{site.email}</a>
            {site.responseHours && <p>We reply {responsePhrase()}.</p>}
            {site.hours && <p>{site.hours.label}</p>}
            <p>Instagram, TikTok and Facebook: @deckcraftboston</p>
            <p className="text-sm text-hunter/70">Serving Greater Boston. See the <a className="underline" href="/service-areas">service area</a>.</p>
          </div>
          <PhotoAssessmentForm condensed />
        </div>
      </section>
    </>
  );
}
