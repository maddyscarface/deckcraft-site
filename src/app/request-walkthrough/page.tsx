import { meta } from "@/lib/seo";
import { WalkthroughForm } from "@/components/forms/WalkthroughForm";
import { ViewService } from "@/components/sections/ViewService";
import { Checklist } from "@/components/sections/Blocks";
import { SERVICE_PROMISE } from "@/lib/programs";

export const metadata = meta("/request-walkthrough", "Request a Property Walkthrough | DeckCraft Boston",
  "Free walkthrough for associations, landlords, and commercial properties across Greater Boston.");

export default function Page() {
  return (
    <>
      <ViewService name="Walkthrough Page" />
      <section className="bg-hunter px-5 pt-16 pb-28 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-linen">PROPERTY WALKTHROUGH</p>
          <h1 className="mt-3 font-display text-[36px] leading-tight font-bold md:text-[48px]">Tell us about your properties. We&apos;ll come walk them.</h1>
          <p className="mt-4 text-lg text-sage">Free walkthrough for associations, landlords and commercial properties, followed by written findings and pricing.</p>
        </div>
      </section>
      <section className="-mt-16 px-5 pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_340px]">
          <WalkthroughForm />
          <aside className="rounded-[2px] bg-cream-dark/50 p-6 lg:mt-16">
            <h2 className="font-display text-xl">What happens next</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px]">
              <li>A project lead calls to confirm the property list and a walkthrough date.</li>
              <li>We walk every structure and photograph it.</li>
              <li>You receive written findings, priorities and pricing per property.</li>
            </ol>
            <h2 className="mt-6 font-display text-xl">Our promise</h2>
            <div className="mt-3 text-[15px]"><Checklist items={SERVICE_PROMISE} /></div>
          </aside>
        </div>
      </section>
    </>
  );
}
