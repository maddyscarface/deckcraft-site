import Link from "next/link";
import { meta } from "@/lib/seo";
import { SuccessState } from "@/components/forms/kit";
import { responsePhrase, site } from "@/config/site";

export const metadata = meta("/thank-you", "Thank You | DeckCraft Boston", "Your request was received.", { noindex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const walk = type === "walkthrough";
  return (
    <section className="bg-bone px-5 py-24">
      <div className="mx-auto max-w-2xl rounded-[2px] bg-white p-8 shadow-premium">
        {walk ? (
          <SuccessState title="Request received." body={`A DeckCraft project lead will contact you ${site.responseHours ? `within ${site.responseHours} business hours` : "shortly"} to review your properties and, if you asked for one, agree a walkthrough date with you. Nothing is scheduled until you confirm it.`}>
            <Link href="/property-programs" className="btn btn-char">See Property Programs</Link>
          </SuccessState>
        ) : (
          <SuccessState title="Request received." body={`We'll review what you sent and reply ${responsePhrase()} with what we see and the sensible next step. If a site visit is needed, we'll agree the date with you first.`}>
            <Link href="/repair-or-replace" className="btn btn-char">Try the Repair-or-Replace Checker</Link>
            {site.social.instagram && <a href={site.social.instagram} className="btn border border-navy" rel="noopener">Follow on Instagram</a>}
          </SuccessState>
        )}
      </div>
    </section>
  );
}
