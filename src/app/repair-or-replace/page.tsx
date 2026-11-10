import { meta, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { RepairOrReplaceChecker } from "@/components/tools/RepairOrReplaceChecker";
import { PageHero } from "@/components/sections/Blocks";

export const metadata = meta("/repair-or-replace", "Repair or Replace Your Deck? Free Checker | DeckCraft Boston",
  "Answer 7 quick questions about your deck's age, boards, framing, railings and stairs for a preliminary repair-or-replace read. Then confirm with photos.");

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema([{ q: "Is it better to repair or replace a deck?", a: "If the framing, joists, posts and ledger are sound, repair is usually the better value. If rot has reached the structure, replacement is often safer. An in-person look confirms it." }])} />
      <PageHero compact eyebrow="REPAIR-OR-REPLACE CHECKER" h1="Repair or replace? Get a preliminary read in a minute." sub="Seven questions about age, boards, framing, railings and stairs. Then add photos and dimensions so we can confirm." />
      <section className="bg-cream px-5 py-16"><div className="mx-auto max-w-3xl"><RepairOrReplaceChecker /></div></section>
      <section className="bg-white px-5 py-16">
        <div className="prose-dc mx-auto max-w-3xl">
          <h2>How we actually decide</h2>
          <p>Surface wear, like gray, splintered or cupped boards, is almost always a restore: clean, replace the worst boards, and refinish. Soft boards are a closer look: sometimes it&apos;s only the decking, sometimes the joists below. The deciding factor is the structure. If the posts, beams, joists and the ledger board where the deck meets the house are sound, repair is usually the better value. If rot has reached them, a rebuild is often safer and cheaper over time.</p>
          <p>The checker is a quick, informational guide, not an inspection, structural assessment or safety certification. If anything feels unsafe, keep people off it until it&apos;s been looked at in person.</p>
        </div>
      </section>
    </>
  );
}
