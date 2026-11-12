export const NAV = [
  {
    label: "Decks",
    items: [
      { label: "New Decks", href: "/services/new-decks" },
      { label: "Rebuild and Resurface", href: "/services/deck-rebuild-resurfacing" },
      { label: "Structural Deck Repair", href: "/services/deck-repair" },
      { label: "Railing and Stair Safety", href: "/services/board-railing-stairs" },
      { label: "Staining and Sealing", href: "/services/deck-staining-sealing" },
      { label: "Project Calculator", href: "/project-calculator" },
      { label: "Repair-or-Replace Checker", href: "/repair-or-replace" },
      { label: "For Homeowners", href: "/homeowners" },
    ],
  },
  {
    label: "Fencing",
    items: [
      { label: "Residential Fencing", href: "/fencing/residential" },
      { label: "Commercial Fencing", href: "/fencing/commercial" },
      { label: "All Fencing", href: "/fencing" },
    ],
  },
  {
    label: "Property Programs",
    items: [
      { label: "Program Overview", href: "/property-programs" },
      { label: "HOA and Condo Associations", href: "/hoa-condo" },
      { label: "Landlords and Property Managers", href: "/landlords" },
      { label: "Commercial Properties", href: "/commercial" },
      { label: "Portfolio Inspection Planner", href: "/portfolio-inspection-planner" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Resources", href: "/blog" },
] as const;
