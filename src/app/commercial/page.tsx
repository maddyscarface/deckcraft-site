import { ProgramPage } from "@/components/sections/ProgramPage";
import { meta } from "@/lib/seo";

export const metadata = meta("/commercial", "Commercial Deck and Fence Contractor in Greater Boston | DeckCraft Boston",
  "Decks, patios, and fencing for restaurants, hotels, offices, schools, and retail across Greater Boston. Scheduled around your hours.");

export default function Page() {
  return (
    <ProgramPage
      path="/commercial" presetType="commercial" cta="Request a Site Walkthrough"
      eyebrow="COMMERCIAL PROPERTIES"
      h1="Decks, patios, and fencing for properties that stay open."
      sub="Outdoor dining decks, perimeter fencing, enclosures and inspections, scheduled around your business."
      pills={["Restaurants and patios", "Hotels and inns", "Retail centers", "Office parks", "Schools and campuses", "Clubs and pools", "Mixed-use buildings"]}
      body="Commercial outdoor structures take public traffic every day and can't close for long. We scope the work so it can be done in phases, early, late or off-season."
      listTitle="Services"
      list={["Outdoor dining decks: repair, staining and sealing", "Boardwalk and ramp repair", "Perimeter and decorative fencing", "Dumpster and utility enclosures", "Pool and amenity fencing with self-closing gates", "Access gates", "Annual deck and fence inspections"]}
      note="Early-morning, evening and off-season scheduling available so your business stays open."
      faqs={[
        { q: "Can you work outside business hours?", a: "Yes. We schedule early mornings, evenings or off-season where the work allows." },
        { q: "Do you handle access-controlled gates?", a: "We build and repair the gate structure and hardware; electronic access systems are coordinated with your access-control vendor." },
        { q: "Can you invoice per location?", a: "Yes, per location or consolidated monthly." },
        { q: "Do you provide a certificate of insurance?", a: "Yes, on request, with additional insureds as your lease or management agreement requires." },
      ]}
    />
  );
}
