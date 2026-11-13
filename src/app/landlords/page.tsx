import { ProgramPage } from "@/components/sections/ProgramPage";
import { meta } from "@/lib/seo";

export const metadata = meta("/landlords", "Deck and Fence Repair for Boston Landlords | DeckCraft",
  "Rental property deck, rear porch, and fence repair across Greater Boston. Portfolio pricing, turnover scheduling, and photo reports.");

export default function Page() {
  return (
    <ProgramPage
      path="/landlords" presetType="landlord_pm" planner
      eyebrow="LANDLORDS AND PROPERTY MANAGERS"
      h1="Rear porches, decks, and fences that keep tenants safe and units rented."
      sub="Fixed-scope repairs for owners of 2 to 200 units, scheduled around tenants, with photo proof for every property."
      body="From triple-decker rear porches to garden-style complexes, rental decks see more traffic and less care than any other structure on the property. We repair them on a fixed scope, around your tenants, with photo proof you don't have to drive out to see."
      cards={[
        { title: "Liability", body: "A loose railing or soft stair on a rental is a safety problem waiting to happen. Inspections document that you're on top of it." },
        { title: "Turnover timing", body: "Exterior repairs and staining scheduled between tenants, on a committed timeline." },
        { title: "Contractor chaos", body: "No rotating crews, no 'finish this one and we'll see.' One written schedule for every property in the job." },
      ]}
      listTitle="What we handle"
      list={["Triple-decker and multifamily rear porches and stairs", "Railing and baluster repairs", "Deck and porch staining between tenants", "Rental property fencing and gates", "Exterior repairs tied to unit turnovers", "Multi-property maintenance agreements"]}
      note="Fixing a few rotted boards and a railing costs far less than a full rebuild, and catching it at inspection costs less than fixing it after a tenant complaint."
      faqs={[
        { q: "Do you work on occupied buildings?", a: "Yes. We coordinate access with you or your tenants and keep stairs usable or provide notice when a section must be closed." },
        { q: "Can you bundle several properties?", a: "Yes. Walkthrough all of them once, get one written scope and schedule, and pricing per property." },
        { q: "Do you send photos so I don't have to visit?", a: "Yes. Every property gets start and completion photos, and property clients get a photo report." },
        { q: "Do you pull permits for porch repairs?", a: "Where the town requires them. Structural porch work often needs a permit in Massachusetts; we check for every job." },
        { q: "Can you provide a W-9 and COI for vendor setup?", a: "Yes, on request." },
      ]}
    />
  );
}
