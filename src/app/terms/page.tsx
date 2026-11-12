import { site } from "@/config/site";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";

export const metadata = meta("/terms", "Terms, SMS Terms and Accessibility | DeckCraft Boston", "Website terms, SMS program terms and accessibility statement.");

/* DRAFT — must be reviewed by a qualified attorney before launch. */
export default function Page() {
  return (
    <>
      <PageHero compact h1="Terms of Use" sub="Draft for legal review. Last updated November 2, 2026." />
      <section className="bg-cream px-5 py-14">
        <div className="prose-dc mx-auto max-w-3xl">
          <h2>Estimates and tools</h2>
          <p>Price ranges on this site are general Greater Boston planning figures, not quotes. Photo assessments, the Repair-or-Replace Checker and the Portfolio Inspection Planner give preliminary, informational guidance only. They are not inspections, structural assessments, engineering opinions or safety certifications. A price is binding only when confirmed in a written proposal or contract.</p>
          <h2>Content</h2>
          <p>Information about permits, codes and pool barriers is general. Requirements vary by town; confirm with your local building department.</p>
          <h2>Limitation</h2>
          <p>This site is provided as-is. Work performed is governed by the written contract for that work.</p>
          <h2 id="sms">SMS Terms</h2>
          <p>Program: DeckCraft Boston project updates. By checking the consent box on our forms you agree to receive texts about your request, such as confirmations, scheduling and follow-ups. Message frequency varies. Message and data rates may apply. Reply STOP to cancel, HELP for help. Consent is not a condition of purchase. Carriers are not liable for delayed or undelivered messages. We do not share mobile numbers or SMS opt-in data with third parties for their marketing. See our Privacy Policy.</p>
          <h2 id="accessibility">Accessibility</h2>
          <p>We aim to meet WCAG 2.1 AA. If anything on this site is hard to use, email {site.email} and we&apos;ll help and fix it.</p>
        </div>
      </section>
    </>
  );
}
