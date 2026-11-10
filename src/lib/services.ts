import type { ServiceKey } from "./lead-schema";

export type Faq = { q: string; a: string };
export type PriceRow = { item: string; range: string };

export type ServicePageConfig = {
  slug: string; // route path without leading slash
  name: string;
  schemaType: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  subhead: string;
  included: { title: string; body: string }[];
  prices?: PriceRow[];
  faqs: Faq[];
  presetService: ServiceKey;
  formKind: "assessment" | "walkthrough";
  related: string[];
  extra?: { title: string; body: string }[];
};

const P = "[OWNER TO CONFIRM]";

/** Owner-supplied 2025–26 Greater Boston benchmarks. Confirm before launch. */
export const PRICE_GUIDE: PriceRow[] = [
  { item: "Deck repair (average job)", range: "$1,160 to $4,161" },
  { item: "Stain a 12×12 deck", range: "$800 to $1,350" },
  { item: "Clean and seal", range: "$300 to $1,500" },
  { item: "Refinish", range: "$3 to $7 per sq ft" },
  { item: "Board replacement", range: "$25 to $125 per sq ft" },
  { item: "Railing repair", range: "$39 to $237 per linear ft" },
  { item: "Full resurfacing", range: "$15 to $50 per sq ft" },
  { item: "Fence repair", range: P },
  { item: "New wood privacy fence", range: `${P} per linear ft` },
];

export const PRICE_DISCLAIMER =
  "Typical Greater Boston ranges, shown for planning only. Your exact price is confirmed in writing before any work starts.";

export const SERVICES: Record<string, ServicePageConfig> = {
  "services/deck-repair": {
    slug: "services/deck-repair",
    name: "Deck Repair",
    schemaType: "Deck Repair",
    title: "Deck Repair in Greater Boston | DeckCraft Boston",
    description:
      "Rotted boards, soft spots, loose framing and ledger problems repaired across Greater Boston. Send 3 photos for a free assessment.",
    eyebrow: "DECK REPAIR",
    h1: "Deck repair that fixes the cause, not just the board.",
    subhead:
      "We find where water is getting in, replace what has failed, and keep what is still sound. Send 3 photos and we'll tell you whether it's a repair or a bigger conversation.",
    included: [
      { title: "Rotted and split boards", body: "Matched replacement boards, fastened properly so they don't cup or pop." },
      { title: "Soft spots and framing", body: "Joist checks, sistering where the framing is sound enough to save." },
      { title: "Ledger inspection", body: "Where the deck meets the house is where most serious failures start. We look first." },
      { title: "Fasteners and hardware", body: "Rusted nails and missing hangers replaced with exterior-rated hardware." },
      { title: "Flashing", body: "Water management at the house connection so the repair lasts." },
      { title: "Honest scope", body: "If repair isn't the right call, we show you photos and explain why." },
    ],
    prices: PRICE_GUIDE.slice(0, 1).concat(PRICE_GUIDE.slice(4, 6)),
    faqs: [
      { q: "Repair or replace: how do you decide?", a: "If the framing, joists and ledger board are sound, we repair. If rot has reached the structure, we'll show you photos and explain why replacement is the safer path." },
      { q: "Is my deck safe?", a: "We can't tell that from a web form. Soft boards, leaning posts, or rot where the deck meets the house are reasons to stop using the area and have it looked at in person. Our photo review is a starting point, not an inspection." },
      { q: "Do you pull permits?", a: "Yes, where your town requires one. Structural repairs and rebuilds often need a permit in Massachusetts. We check with your local building department for every job." },
      { q: "How long does a repair take?", a: `Most repairs take 1 to 3 days once materials are on site. ${P}` },
      { q: "Can you repair a composite deck?", a: "Yes: board replacement, railing repair and cleaning. Composite can't be stained like wood." },
      { q: "What does the free assessment include?", a: "Send 3 photos. We review them and reply with what we see and a price range. If it's not worth fixing, we'll say so." },
    ],
    presetService: "deck_repair",
    formKind: "assessment",
    related: ["services/deck-staining-sealing", "services/board-railing-stairs", "services/new-decks"],
  },
  "services/deck-staining-sealing": {
    slug: "services/deck-staining-sealing",
    name: "Deck Staining and Sealing",
    schemaType: "Deck Staining",
    title: "Deck Staining and Sealing in Greater Boston | DeckCraft Boston",
    description:
      "Deck cleaning, brightening, staining and sealing for Greater Boston homes and properties. Seal before the freeze. Free photo assessment.",
    eyebrow: "STAINING AND SEALING",
    h1: "Gray isn't old. It's unprotected.",
    subhead:
      "Clean, brighten, stain and seal so water stays out of the wood through a New England winter.",
    included: [
      { title: "Deep clean", body: "Remove mildew, dirt and failing finish so the new coat can bond." },
      { title: "Brightener", body: "Restores the wood's color after cleaning." },
      { title: "Sanding where needed", body: "Splinters and raised grain smoothed on boards and rails." },
      { title: "Your choice of finish", body: "Transparent, semi-transparent or solid, matched to the wood's condition." },
      { title: "Sealer", body: "Water protection before freeze-thaw season." },
      { title: "Minor board swaps", body: "A few bad boards replaced before staining so the job looks finished." },
    ],
    prices: PRICE_GUIDE.slice(1, 4),
    faqs: [
      { q: "When is the best time to stain in Massachusetts?", a: "Late spring through early fall, when the wood is dry and overnight temperatures stay above roughly 50°F. Always follow the stain manufacturer's temperature and dry-time guidance; we'll tell you if your deck needs to dry out first." },
      { q: "Can you seal in October or November?", a: "Often, on dry days with suitable temperatures. Late-season slots depend on weather, so we schedule them carefully." },
      { q: "How long does stain last?", a: "It depends on sun exposure, foot traffic and the type of finish. Solid stains generally last longer on horizontal surfaces than transparent ones. We'll give you a realistic expectation for your deck." },
      { q: "Which finish should I choose?", a: "Transparent shows the most grain but needs refreshing sooner. Solid hides more wear and lasts longer. Semi-transparent is in between." },
      { q: "How long does the job take?", a: `Most decks take 1 to 2 days plus dry time. ${P}` },
      { q: "Can you stain my fence to match?", a: "Yes. Deck and fence together in one visit is common." },
    ],
    presetService: "staining",
    formKind: "assessment",
    related: ["services/deck-repair", "fencing/residential", "repair-or-replace"],
  },
  "services/board-railing-stairs": {
    slug: "services/board-railing-stairs",
    name: "Boards, Railings and Stairs",
    schemaType: "Deck Railing and Stair Repair",
    title: "Deck Railing and Stair Repair in Greater Boston | DeckCraft Boston",
    description:
      "Wobbly railings, loose balusters, cracked treads and failing stringers repaired across Greater Boston. Free photo assessment.",
    eyebrow: "BOARDS, RAILINGS AND STAIRS",
    h1: "Railings and stairs are safety, not style.",
    subhead:
      "Loose posts, missing balusters and soft treads repaired properly, with permits pulled where your town requires them.",
    included: [
      { title: "Railing posts", body: "Re-secured or replaced so they don't move under load." },
      { title: "Balusters and infill", body: "Replaced and spaced consistently." },
      { title: "Handrails", body: "Graspable, continuous handrails on stairs." },
      { title: "Stair treads", body: "Cracked or soft treads replaced." },
      { title: "Stringers", body: "Rotted stringers replaced, not patched." },
      { title: "Height corrections", body: "Railings brought up to current requirements where the scope calls for it." },
    ],
    prices: [PRICE_GUIDE[5]],
    faqs: [
      { q: "Do railings need to meet code?", a: "Repairs and replacements should meet the building code your town enforces. Requirements for height, opening size and load vary by situation, so we confirm them with the local building department for the specific job." },
      { q: "My railing wobbles. Is that urgent?", a: "A railing that moves is a reason to keep people off that section until it's looked at. Send photos and we'll prioritize it." },
      { q: "Can you fix just the stairs?", a: "Yes. Stairs-only jobs are common, especially on rear porches." },
      { q: "Do you work in winter?", a: "Structural railing and stair repairs can often be done in cold weather. Staining can't." },
      { q: "Do you handle triple-decker rear porches?", a: "Yes, for owners and property managers. See our landlord program for multi-property work." },
      { q: "What does it cost?", a: "Railing repair commonly runs $39 to $237 per linear foot in Greater Boston depending on material and condition. Your price is confirmed in writing." },
    ],
    presetService: "railings_stairs",
    formKind: "assessment",
    related: ["services/deck-repair", "landlords", "hoa-condo"],
  },
  "services/new-decks": {
    slug: "services/new-decks",
    name: "New Decks and Rebuilds",
    schemaType: "Deck Construction",
    title: "New Decks and Deck Rebuilds in Greater Boston | DeckCraft Boston",
    description:
      "Deck rebuilds and new decks in pressure-treated, cedar or composite for Greater Boston homes. Permits handled. Free assessment.",
    eyebrow: "NEW DECKS AND REBUILDS",
    h1: "When repair won't do, rebuild it right.",
    subhead:
      "Design, permits and construction in pressure-treated, cedar or composite, with railings and stairs built in from the start.",
    included: [
      { title: "Design and layout", body: "Sized for how you actually use the space." },
      { title: "Permits", body: "Drawings and permit applications handled where required." },
      { title: "Pressure-treated", body: "The most economical option." },
      { title: "Cedar", body: "Natural look, naturally rot-resistant." },
      { title: "Composite", body: "Low maintenance, higher upfront cost." },
      { title: "Railings and stairs", body: "Built with the deck, not added later." },
    ],
    prices: [PRICE_GUIDE[6]],
    faqs: [
      { q: "Do I need a permit for a new deck?", a: "Almost always in Massachusetts. We prepare and file what your town requires." },
      { q: "How long does a new deck take?", a: `It depends on size, materials and permit timing. ${P}` },
      { q: "Wood or composite?", a: "Wood costs less upfront and can be refinished. Composite costs more but needs less maintenance. We'll price both if you're unsure." },
      { q: "Can you reuse my existing framing?", a: "Sometimes. If the framing and ledger are sound we may resurface instead of rebuilding, which costs less." },
      { q: "Do you build in winter?", a: "Framing can often proceed in cold weather; scheduling depends on ground conditions and permits." },
      { q: "Should I build now or wait for spring?", a: "Winter is a good time to design and permit so you're on the calendar early." },
    ],
    presetService: "new_deck",
    formKind: "assessment",
    related: ["repair-or-replace", "services/deck-repair", "fencing/residential"],
  },
  "fencing/residential": {
    slug: "fencing/residential",
    name: "Residential Fencing",
    schemaType: "Fence Installation and Repair",
    title: "Residential Fence Installation and Repair in Boston | DeckCraft Boston",
    description:
      "Wood, vinyl, aluminum, picket and pool fencing for Greater Boston homes: repair, new install, staining and gates. Free assessment.",
    eyebrow: "RESIDENTIAL FENCING",
    h1: "Privacy, safety, and curb appeal, built to last.",
    subhead: "Fence repair, new installation, staining and gates for Greater Boston homes.",
    included: [
      { title: "Fence repair", body: "Leaning sections, broken pickets, rotted posts." },
      { title: "Wood privacy fencing", body: "Cedar and pressure-treated." },
      { title: "Picket and decorative", body: "Classic New England fronts." },
      { title: "Vinyl and aluminum", body: "Low-maintenance options." },
      { title: "Pool fencing and gates", body: "Self-closing, self-latching gates; barrier requirements confirmed with your town." },
      { title: "Fence staining and sealing", body: "Match the deck in one visit." },
    ],
    prices: PRICE_GUIDE.slice(7),
    extra: [{ title: "Deck and fence together?", body: "We'll stain both to match in one visit." }],
    faqs: [
      { q: "Do I need a permit?", a: "It depends on your town and the fence height and type. We check your town's rules for every job." },
      { q: "Who decides where the property line is?", a: "We work to your survey or plot plan. We don't determine boundaries; if the line is unclear, a licensed surveyor should mark it first." },
      { q: "How long will a wood fence last?", a: "It depends on the wood, ground contact and maintenance. Keeping posts dry at the ground line and sealing the boards extends life considerably." },
      { q: "Can you repair just one section?", a: "Yes. Single-section and single-post repairs are common." },
      { q: "Do you install and repair gates?", a: "Yes, including sagging gates and self-closing hardware." },
      { q: "What about pool fence rules?", a: "We build pool fencing to Massachusetts barrier requirements and confirm details with your local building department before work starts." },
      { q: "Do you call Dig Safe?", a: "Yes. Massachusetts law requires a Dig Safe request before digging, and every post hole starts with one." },
    ],
    presetService: "new_fence",
    formKind: "assessment",
    related: ["fencing", "fencing/commercial", "services/deck-staining-sealing"],
  },
  "fencing/commercial": {
    slug: "fencing/commercial",
    name: "Commercial and Property Fencing",
    schemaType: "Commercial Fencing",
    title: "Commercial Fence Contractor in Greater Boston | DeckCraft Boston",
    description:
      "Commercial and property fencing for HOAs, condo associations, landlords and businesses across Greater Boston. Perimeter, pool, dumpster enclosures and repairs.",
    eyebrow: "COMMERCIAL AND PROPERTY FENCING",
    h1: "Fencing for properties that can't afford downtime.",
    subhead:
      "Perimeter, pool, dumpster enclosure and common-area fencing for associations, property managers and businesses.",
    included: [
      { title: "Perimeter fencing", body: "Wood, vinyl, ornamental aluminum or steel, chain link." },
      { title: "Pool and amenity fencing", body: "Self-closing, self-latching gates." },
      { title: "Dumpster and utility enclosures", body: "Screened, durable, easy to service." },
      { title: "Common-area and courtyard", body: "Fencing residents see every day." },
      { title: "Storm and vehicle damage", body: `Repair after storms or impacts. Response time ${P}.` },
      { title: "Annual condition inspections", body: "Documented fence condition across your properties." },
    ],
    extra: [
      { title: "Why property managers choose DeckCraft", body: "One point of contact · written scope per property · work scheduled around residents and business hours · photo reports · certificate of insurance on request · consolidated invoicing" },
    ],
    faqs: [
      { q: "Can you work around business hours?", a: "Yes. Early-morning, evening and off-season scheduling is available." },
      { q: "Can you provide a certificate of insurance?", a: "Yes, on request, naming your association or management company as required." },
      { q: "Do you handle multiple properties under one agreement?", a: "Yes. See Property Programs for preferred-vendor and capital repair options." },
      { q: "Do you call Dig Safe?", a: "Yes, before every dig, as Massachusetts law requires." },
      { q: "Can you match existing fencing?", a: "Usually. Send photos and we'll confirm material availability." },
      { q: "Do you invoice per property?", a: "We can invoice per property or consolidate monthly." },
    ],
    presetService: "new_fence",
    formKind: "walkthrough",
    related: ["property-programs", "hoa-condo", "commercial"],
  },
};

export const SERVICE_CARDS = [
  { icon: "Hammer", title: "Deck Repair", body: "Rotted boards, soft spots, loose framing. We replace what failed and keep what's sound.", href: "/services/deck-repair" },
  { icon: "Paintbrush", title: "Staining and Sealing", body: "Clean, brighten, stain and seal so water stays out of the wood.", href: "/services/deck-staining-sealing" },
  { icon: "Ruler", title: "Railings and Stairs", body: "Wobbly railings and loose treads are safety issues. We fix them properly, with permits where required.", href: "/services/board-railing-stairs" },
  { icon: "LayoutGrid", title: "New Decks and Rebuilds", body: "When repair won't do, we rebuild in wood or composite.", href: "/services/new-decks" },
  { icon: "Fence", title: "Residential Fencing", body: "Privacy, picket and pool fencing: repair, new install, staining and gates.", href: "/fencing/residential" },
  { icon: "Building2", title: "Commercial Fencing", body: "Perimeter, pool, dumpster enclosure and common-area fencing for properties and businesses.", href: "/fencing/commercial" },
] as const;

export const LINK_LABELS: Record<string, string> = {
  "services/deck-repair": "Deck Repair",
  "services/deck-staining-sealing": "Staining and Sealing",
  "services/board-railing-stairs": "Railings and Stairs",
  "services/new-decks": "New Decks",
  fencing: "All Fencing",
  "fencing/residential": "Residential Fencing",
  "fencing/commercial": "Commercial Fencing",
  "property-programs": "Property Programs",
  "hoa-condo": "HOA and Condo",
  landlords: "Landlords and PMs",
  commercial: "Commercial Properties",
  "repair-or-replace": "Repair-or-Replace Checker",
};
