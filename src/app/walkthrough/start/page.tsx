import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { WalkthroughStartForm } from "@/components/walkthrough/WalkthroughStartForm";
import { WALKTHROUGH_SERVICES, type WalkthroughService } from "@/lib/walkthrough/templates";
import { serviceChoices } from "@/lib/walkthrough/choices";
import { durableStorage, walkthroughStorageAllowed } from "@/lib/p4/db";

export const dynamic = "force-dynamic";

export const metadata = { ...meta("/walkthrough/start", "Start a Guided Deck Walkthrough | DeckCraft", "Show us your deck, railing or fence project from your phone: guided photos, a short video and a few tape measurements. No prices online; we follow up with next steps."), robots: { index: false, follow: true } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const service = (WALKTHROUGH_SERVICES as readonly string[]).includes(sp.service ?? "") ? (sp.service as WalkthroughService) : undefined;
  const sqft = sp.sqft && /^\d{1,5}$/.test(sp.sqft) ? Number(sp.sqft) : undefined;
  return (
    <>
      <PageHero photo="compositeDeck" position="50% 55%" eyebrow="Guided walkthrough" h1="Show us the project from your phone." sub="About 10 minutes: a few guided photos, an optional short video and the measurements you can take with a tape. You can stop and come back any time." />
      <section className="bg-bone px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {!durableStorage() && walkthroughStorageAllowed() && (
              <p className="border border-copper bg-cedar-soft p-3 text-sm text-char" data-testid="storage-demo-note"><b>Preview environment.</b> Durable storage isn&rsquo;t connected here, so walkthrough links may not open reliably on this preview. Production requires Supabase.</p>
            )}
            {walkthroughStorageAllowed()
              ? <WalkthroughStartForm services={serviceChoices} presetService={service} sqft={sqft} />
              : <div className="bg-white p-6 shadow-card"><p className="text-[15px] text-char">The guided walkthrough is coming soon. In the meantime, <a className="font-semibold underline" href="/free-assessment">send us photos through the free assessment form</a>.</p></div>}
          </div>
          <aside className="space-y-5 text-[15px] text-char/85">
            <div className="border-t-2 border-copper pt-4"><h2 className="font-display text-xl text-char">How it works</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Tell us who you are and what the project is.</li>
                <li>Follow the steps on your phone. Your progress saves as you go.</li>
                <li>Our estimator reviews it and contacts you about next steps, usually a short site visit.</li>
                <li>Any price comes only in a written estimate. We don&rsquo;t show prices online.</li>
              </ol></div>
            <div className="border-t border-line pt-4"><h2 className="font-display text-lg text-char">Safety first</h2>
              <p className="mt-2">Stay on the ground or a solid surface. Never crawl under a deck or lean on a loose railing to get a photo.</p></div>
          </aside>
        </div>
      </section>
    </>
  );
}
