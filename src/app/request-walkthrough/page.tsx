import { meta } from "@/lib/seo";
import { WalkthroughForm } from "@/components/forms/WalkthroughForm";
import { ViewService } from "@/components/sections/ViewService";
import { Checklist } from "@/components/sections/Blocks";
import { SERVICE_PROMISE } from "@/lib/programs";
import { Photo } from "@/components/ui/Photo";

export const metadata = meta("/request-walkthrough", "Request a Property Walkthrough | DeckCraft Boston",
  "Free walkthrough for associations, landlords, and commercial properties across Greater Boston.");

export default function Page() {
  return (
    <>
      <ViewService name="Walkthrough Page" assessment="walkthrough" />
      <section className="relative isolate overflow-hidden bg-navy px-5 pt-20 pb-32 text-white">
        <div className="photo-shade absolute inset-0 -z-10"><Photo k="townhomeDeck" priority sizes="100vw" position="50% 55%" /></div>
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-white/85">Property walkthrough · HOA, landlord and commercial</p>
          <h1 className="mt-3 font-display text-[36px] leading-tight font-bold md:text-[48px]">Tell us about your properties. We&apos;ll scope the right next step.</h1>
          <p className="mt-4 text-lg text-white/85">For HOAs, condo associations, landlords and commercial sites. We review your portfolio, agree any walkthrough date with you, then send written findings and pricing per property.</p>
        </div>
      </section>
      <section className="-mt-16 px-5 pb-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_340px]">
          <WalkthroughForm />
          <aside className="rounded-[2px] bg-bone-2 p-6 lg:mt-16">
            <h2 className="font-display text-xl">What happens next</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px]">
              <li>A project lead contacts you the way you prefer to confirm the property list and scope.</li>
              <li>If you asked for a walkthrough, we agree a date with you and inspect and photograph the structures you list.</li>
              <li>You receive written findings, priorities and pricing for each property we review.</li>
            </ol>
            <h2 className="mt-6 font-display text-xl">Our promise</h2>
            <div className="mt-3 text-[15px]"><Checklist items={SERVICE_PROMISE} /></div>
          </aside>
        </div>
      </section>
    </>
  );
}
