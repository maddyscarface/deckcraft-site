import { meta } from "@/lib/seo";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { ViewService } from "@/components/sections/ViewService";
import { SERVICE_KEYS, CUSTOMER_TYPES, type ServiceKey, type CustomerType } from "@/lib/lead-schema";
import { responsePhrase } from "@/config/site";

export const metadata = meta("/free-assessment", "Free Deck and Fence Photo Assessment | DeckCraft Boston",
  "Send 3 photos of your deck or fence. We'll tell you what it needs and how we'd price it.");

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const service = SERVICE_KEYS.includes(sp.service as ServiceKey) ? (sp.service as ServiceKey) : undefined;
  const seg = CUSTOMER_TYPES.includes(sp.seg as CustomerType) ? (sp.seg as CustomerType) : undefined;
  return (
    <>
      <ViewService name="Free Assessment Page" assessment="assessment" />
      <section className="relative isolate overflow-hidden bg-char px-5 pt-20 pb-36 text-white lg:px-8">
        <div className="photo-shade absolute inset-0 -z-10 opacity-60"><Photo k="heroModernDeck" priority sizes="100vw" position="60% 70%" /></div>
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-cedar-light">Free photo assessment</p>
          <h1 className="mt-5 font-display text-[36px] leading-[1.04] md:text-[56px]">See what your deck or fence needs <span className="accent text-cedar-light">before you commit to anything.</span></h1>
          <p className="mt-6 text-lg text-white/80">Send 3 photos. We&apos;ll reply {responsePhrase()}. No obligation, no sales pitch.</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2"><Icon name="Clock" size={15} className="text-cedar-light" />Fast, honest review</li>
            <li className="flex items-center gap-2"><Icon name="ShieldCheck" size={15} className="text-cedar-light" />Photos seen only by our team</li>
            <li className="flex items-center gap-2"><Icon name="Building2" size={15} className="text-cedar-light" />Property managers welcome</li>
          </ul>
        </div>
      </section>
      <section className="-mt-24 px-5 pb-24">
        <div className="mx-auto max-w-3xl"><PhotoAssessmentForm presetService={service} presetCustomerType={seg} presetTown={sp.town} /></div>
        <div className="mx-auto mt-14 grid max-w-3xl gap-px bg-line sm:grid-cols-3">
          {[["1", "Whole deck or fence", "Stand back far enough to get all of it in one shot."], ["2", "The worst spots", "Soft boards, rot, cracks, loose posts or rails."], ["3", "Stairs, railings or gates", "These are where the safety issues usually are."]].map(([n, t, b]) => (
            <div key={n} className="bg-bone p-6"><p className="num text-2xl text-cedar">0{n}</p><h2 className="mt-3 font-semibold">{t}</h2><p className="mt-1.5 text-[14.5px] text-stone">{b}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
