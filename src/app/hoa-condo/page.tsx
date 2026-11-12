import { site } from "@/config/site";
import { ProgramPage } from "@/components/sections/ProgramPage";
import { meta } from "@/lib/seo";

export const metadata = meta("/hoa-condo", "Deck, Balcony and Fence Contractor for Condo Associations | DeckCraft Boston",
  "Annual deck and balcony safety inspections, board-ready proposals, and phased repair programs for Greater Boston condo associations and HOAs.");

export default function Page() {
  return (
    <ProgramPage
      path="/hoa-condo" presetType="hoa_condo" planner
      eyebrow="HOA AND CONDO ASSOCIATIONS"
      h1="Board-ready proposals. Resident-friendly work."
      sub="Inspections, repairs, staining and fencing for shared decks, balconies, stairs and common areas."
      body="Condo boards and HOAs carry the responsibility for shared decks, balconies, stairs and fences, and they answer to every resident. DeckCraft inspects every structure, documents its condition and gives the board a clear, prioritized plan it can vote on."
      listTitle="The board package"
      list={[
        "Condition report with photos for every structure",
        "Priority ranking: safety now / repair this year / monitor",
        "Pricing per item and per building",
        "Phased schedule options matched to the budget or reserve plan",
        "Resident notice templates for work days",
        "Presentation at a board meeting on request",
      ]}
      note="What we cover: shared and limited-common-area decks and balconies, egress stairs, railings, pool and amenity fencing, perimeter fencing, courtyard and common-area structures."
      faqs={[
        { q: "Can you present to our board?", a: "Yes. We'll walk the board through the condition report and the phasing options, in person or by video." },
        { q: "Do you work with our management company?", a: "Yes. We can work through your manager for access, approvals and invoicing, and copy the board on reports." },
        { q: "How do you handle residents during work?", a: "We provide notice templates, schedule around access needs, keep work areas clear at day's end and post photo updates." },
        { q: "Can you phase the work over two seasons?", a: "Yes. Phasing by priority is common, with safety items first and cosmetic work later." },
        { q: "Do you provide a certificate of insurance naming the association?", a: site.credentials.licensedAndInsuredVerified ? "Yes, on request, naming the association and management company as required." : "Insurance documentation is confirmed with each client before work starts; ask during your walkthrough and we will share what applies to your property." },
        { q: "Can you work from our reserve study?", a: "Yes. Upload it with your walkthrough request and we'll align our scope and schedule to it." },
      ]}
    />
  );
}
