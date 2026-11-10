import { meta } from "@/lib/seo";
import { PhotoAssessmentForm } from "@/components/forms/PhotoAssessmentForm";
import { Icon } from "@/components/ui/Icon";
import { ViewService } from "@/components/sections/ViewService";
import { SERVICE_KEYS, CUSTOMER_TYPES, type ServiceKey, type CustomerType } from "@/lib/lead-schema";
import { responsePhrase } from "@/config/site";

export const metadata = meta("/free-assessment", "Free Deck and Fence Photo Assessment | DeckCraft Boston",
  "Send 3 photos of your deck or fence. We'll tell you what it needs and what it's likely to cost.");

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const service = SERVICE_KEYS.includes(sp.service as ServiceKey) ? (sp.service as ServiceKey) : undefined;
  const seg = CUSTOMER_TYPES.includes(sp.seg as CustomerType) ? (sp.seg as CustomerType) : undefined;
  return (
    <>
      <ViewService name="Free Assessment Page" />
      <section className="bg-hunter px-5 pt-16 pb-28 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-linen">FREE PHOTO ASSESSMENT</p>
          <h1 className="mt-3 font-display text-[36px] leading-tight font-bold md:text-[48px]">See what your deck or fence needs before you commit to anything.</h1>
          <p className="mt-4 text-lg text-sage">Send 3 photos. We&apos;ll reply {responsePhrase()}. No obligation, no sales pitch.</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-linen">
            <li className="flex items-center gap-1.5"><Icon name="Clock" size={15} />Fast, honest review</li>
            <li className="flex items-center gap-1.5"><Icon name="ShieldCheck" size={15} />Photos seen only by our team</li>
            <li className="flex items-center gap-1.5"><Icon name="Building2" size={15} />Property managers welcome</li>
          </ul>
        </div>
      </section>
      <section className="-mt-16 px-5 pb-20">
        <div className="mx-auto max-w-3xl"><PhotoAssessmentForm presetService={service} presetCustomerType={seg} presetTown={sp.town} /></div>
      </section>
    </>
  );
}
