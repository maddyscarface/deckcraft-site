import Link from "next/link";
import { meta } from "@/lib/seo";
import { SuccessState } from "@/components/forms/kit";
import { responsePhrase, site } from "@/config/site";

export const metadata = meta("/thank-you", "Thank You | DeckCraft Boston", "Your request was received.", { noindex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const walk = type === "walkthrough";
  return (
    <section className="bg-cream px-5 py-24">
      <div className="mx-auto max-w-2xl rounded-[2px] bg-white p-8 shadow-premium">
        {walk ? (
          <SuccessState title="Request received." body={`A DeckCraft project lead will contact you ${site.responseHours ? `within ${site.responseHours} business hours` : "shortly"} to confirm a walkthrough date. Check your email for confirmation.`}>
            <Link href="/property-programs" className="btn btn-hunter">See Property Programs</Link>
          </SuccessState>
        ) : (
          <SuccessState title="Photos received!" body={`We're reviewing your request now and will reply ${responsePhrase()}. Check your email for confirmation.`}>
            <Link href="/repair-or-replace" className="btn btn-hunter">Try the Repair-or-Replace Checker</Link>
            {site.social.instagram && <a href={site.social.instagram} className="btn border border-hunter" rel="noopener">Follow on Instagram</a>}
          </SuccessState>
        )}
      </div>
    </section>
  );
}
