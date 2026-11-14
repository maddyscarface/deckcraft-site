/**
 * Launch posts (AEO priorities). Owner must review each for accuracy before publishing.
 * The full 20-topic plan and 90-day calendar live in docs/09-seo-aeo.md.
 */
export type Post = {
  slug: string;
  title: string;
  description: string;
  category: "Decks" | "Fencing" | "Property Managers" | "Seasonal";
  published: string;
  updated?: string;
  answer: string; // 40–60 word direct answer for AEO / featured snippets
  sections: { h: string; p: string[] }[];
  cta: { href: string; label: string };
  related?: { href: string; label: string }[];
};

export const POSTS: Post[] = [
  {
    slug: "deck-repair-cost-boston",
    title: "How Much Does Deck Repair Cost in Boston?",
    description: "What actually drives deck repair, staining and railing costs in Greater Boston, how repair pricing differs from new-deck pricing, and how to get a real number fast.",
    category: "Decks",
    published: "2026-11-02",
    answer: "Deck repair is priced by what has failed, not by deck size: a few split boards and a loose railing is a small job; water damage in the joists or ledger is a bigger one. Framing condition, height and access, material matching and permits move the number most. Send three photos for a scoped range.",
    sections: [
      { h: "The short version", p: [
        "Deck repair in Boston is priced by what has failed, not by the size of the deck alone. A sound deck with a handful of split boards and a wobbly railing is a small job. A deck where water has reached the joists or the ledger board, the board that ties the deck to the house, is a different conversation.",
        "We don't publish repair price lists, because two decks of the same size can need very different work. Repair, staining and sealing are quoted from your photos and confirmed in writing after an on-site check, separately from new-deck pricing.",
      ] },
      { h: "Repair pricing versus new-deck pricing", p: [
        "Repairs are scoped item by item: boards, joists, ledger, flashing, railings and stairs. New decks are scoped from size, height, materials, stairs, railings, footings and site access. We don’t publish prices or calculators: your price is set only in a written estimate after we confirm the site.",
      ] },
      { h: "What pushes the price up", p: [
        "Framing and ledger damage. Replacing deck boards is straightforward. Sistering joists, replacing a section of ledger or adding flashing takes more labor and sometimes a permit.",
        "Height and access. A second- or third-floor rear porch on a Somerville two-family or a Dorchester triple-decker needs more setup than a ground-level deck in Needham.",
        "Matching materials. Older cedar, discontinued composite colors and custom railings can cost more to match.",
        "Permits. Structural repairs often require one in Massachusetts. The permit fee itself is usually small; the drawings and inspection scheduling add time.",
      ] },
      { h: "What keeps it down", p: [
        "Catching problems early. Sealing gray boards before water gets into the framing is the single cheapest thing a Boston homeowner can do.",
        "Bundling. Staining the fence in the same visit as the deck, or fixing both units' porches on a two-family at once, saves setup and travel.",
        "Being honest about repair versus replace. If the structure is sound, resurfacing and new railings can look like a new deck for a fraction of a rebuild.",
      ] },
      { h: "How to get a real number quickly", p: [
        "Send three photos: the whole deck, the worst spots, and the stairs or railings. From photos we can usually tell you whether you're looking at a refinish, a repair or a bigger structural conversation, and give you a range. A short site visit then confirms scope and locks the price in writing.",
      ] },
    ],
    cta: { href: "/free-assessment", label: "Send 3 Photos — Get a Free Assessment" },
  },
  {
    slug: "deck-repair-vs-replace",
    title: "Deck Repair vs Replacement in Massachusetts",
    description: "How Greater Boston homeowners can tell whether a deck needs a repair, a refinish or a replacement, and why the framing and ledger decide it.",
    category: "Decks",
    published: "2026-11-02",
    updated: "2026-11-13",
    answer: "If the posts, beams, joists and ledger board are sound, repairing or resurfacing a deck is usually the better value. If rot has reached that structure, or several problems show up at once on an older deck, replacement is often safer. Soft spots and moving posts call for an in-person look.",
    sections: [
      { h: "Start underneath, not on top", p: [
        "Most people judge a deck by its surface: gray boards, splinters, peeling stain. Those are real problems, but they're rarely the deciding factor. What decides repair versus replace is the structure underneath: posts, beams, joists and the ledger board attached to the house.",
        "If the structure is solid, almost anything above it can be fixed. If the structure is rotting, new boards on top just hide the problem.",
      ] },
      { h: "Signs it's probably a repair or refinish", p: [
        "Boards are gray, cracked or splintered but feel firm underfoot. A few individual boards are split or cupped. Stain is peeling or worn through. Railings are loose at a fastener but the posts themselves are solid.",
      ] },
      { h: "Signs it needs a closer look in person", p: [
        "Boards that feel soft or spongy. Dark, crumbling wood on joists or around the ledger. Posts that lean, sink or move. Stair stringers that flex. Rust streaks or missing hardware where the deck meets the house. If any of these apply, keep people off the area until it's been inspected.",
      ] },
      { h: "When replacement starts to make sense", p: [
        "An older deck with several issues at once, such as soft boards plus loose railings plus worn stairs, can cost more to keep patching than to rebuild. Replacement also makes sense when you want to change the layout, size or material, for example moving to composite.",
        "A good contractor prices both options side by side so you can compare.",
      ] },
      { h: "Try the checker, then send photos", p: [
        "Our Repair-or-Replace Checker asks seven quick questions and gives you a preliminary read. It's informational, not an inspection. Follow it with photos and we'll confirm what we see.",
      ] },
    ],
    cta: { href: "/repair-or-replace", label: "Start the Repair-or-Replace Checker" },
  },
  {
    slug: "when-to-seal-deck-massachusetts",
    title: "When Should You Seal a Deck in Massachusetts?",
    description: "The best months to stain and seal a deck in Greater Boston, how to know the wood is ready, and why fall sealing matters.",
    category: "Seasonal",
    published: "2026-11-02",
    answer: "In Massachusetts, seal or stain a deck from late spring through early fall, on dry days when overnight temperatures stay above roughly 50°F and the wood has dried out. Sealing before the first hard freeze helps keep water out of the boards through winter. Follow the product's own temperature and dry-time guidance.",
    sections: [
      { h: "The best window", p: [
        "Late May through September is the reliable window around Boston: warm days, warm nights and enough dry weather for the wood to accept stain. Early fall often works well too, as long as you get a run of dry days and nights that aren't too cold.",
        "Every stain and sealer lists its own minimum temperature and dry time. Those instructions win over any rule of thumb.",
      ] },
      { h: "Is the wood ready?", p: [
        "Sprinkle a little water on the boards. If it beads up, the old finish is still repelling water and the deck may not need sealing yet, or it needs to be stripped first. If it soaks in within a few minutes, the wood is ready for cleaning and a new coat.",
        "After washing or a rainstorm, give the deck time to dry before applying finish. Shaded decks in Newton, Lexington or Milton can take noticeably longer.",
      ] },
      { h: "Why fall sealing matters here", p: [
        "Freeze-thaw is the main reason Boston decks fail early. Water soaks into unprotected boards in fall, freezes, expands and opens cracks that let more water in. Sealing before the first hard freeze is one of the cheapest ways to avoid spring repairs.",
      ] },
      { h: "How often to re-seal", p: [
        "It depends on sun exposure, foot traffic and the finish you use. Transparent finishes show the most grain but need refreshing sooner. Solid stains generally last longer on horizontal surfaces. Use the water test each spring to decide.",
      ] },
    ],
    cta: { href: "/services/deck-staining-sealing", label: "Book Staining and Sealing" },
  },

  {
    slug: "composite-vs-pressure-treated-deck-boards",
    title: "Composite vs Pressure-Treated Deck Boards",
    description: "A factual comparison of pressure-treated wood, cedar and composite decking for Greater Boston, covering maintenance, feel and cost patterns — not installed prices.",
    category: "Decks",
    published: "2026-11-13",
    updated: "2026-11-13",
    answer: "Pressure-treated wood usually costs less to install and needs periodic sealing in a New England climate. Cedar costs more than treated lumber and still benefits from a finish. Composite typically costs more upfront and needs washing rather than staining, but the frame underneath still has to be sound. The right choice depends on budget, look and how you want to maintain the deck.",
    sections: [
      { h: "Start with how you’ll use and maintain it", p: [
        "Board material changes how a deck looks, how it feels underfoot and how often you come back to it with a brush or a washer. It does not change the need for a sound frame, a properly flashed ledger or railings that stay tight. Those structural pieces are priced and inspected the same way regardless of the walking surface.",
        "The notes below are typical tradeoffs, not a recommendation for one product line and not a quote. Installed prices move with size, height, access, railings, stairs, demolition and permits.",
      ] },
      { h: "Pressure-treated wood", p: [
        "This is usually the most economical board option and the most familiar look. In Greater Boston the main ongoing cost is maintenance: unprotected boards take on water in the fall, then freeze and thaw all winter. A cleaning and a fresh sealer, on a dry stretch when nights stay warm enough for the product, is how most treated decks last.",
        "The surface will weather, sometimes unevenly in sun versus shade. Dents and fastener marks are normal. If you want a wood deck and are prepared to reseal it, treated lumber is often the starting point in a planning conversation.",
      ] },
      { h: "Cedar", p: [
        "Cedar is chosen for its appearance and for being naturally more rot-resistant than untreated wood. It typically sits above treated lumber in material cost and below many composite systems. It still benefits from a finish in this climate, especially on horizontal surfaces that hold water and snow.",
        "As a softer wood it can dent. Color will change if it is left unfinished. If the look of real wood is the point of the design, cedar is worth comparing side by side with treated boards on the same layout.",
      ] },
      { h: "Composite", p: [
        "Composite and similar manufactured boards usually cost more to buy and to fasten, and they are often chosen to reduce annual staining. Most still need washing, and some colors run hotter in full sun. The joists, posts and ledger remain wood in a typical build, so a low-maintenance surface is not a substitute for keeping water out of the frame.",
        "Colors, textures, hidden-fastener systems and warranties are specific to each manufacturer. Warranty terms have conditions; we include the current sheet in a written estimate rather than paraphrasing coverage we cannot stand behind.",
      ] },
      { h: "How we help you choose", p: [
        "On a new-deck estimate we discuss the layout first, then the board and railing options that fit how you use the space. The project calculator can show a planning band; it is not a quote. Your price is set in writing after we confirm the site.",
      ] },
    ],
    cta: { href: "/new-deck-estimate", label: "Request a New Deck Estimate" },
    related: [
      { href: "/services/new-decks", label: "New deck construction" },
      { href: "/project-calculator", label: "Project calculator" },
      { href: "/blog/how-a-written-deck-estimate-works", label: "How a written estimate works" },
    ],
  },
  {
    slug: "when-should-a-railing-be-inspected",
    title: "When Should a Deck Railing Be Inspected?",
    description: "Practical signs that a deck railing or stair needs a closer look, and why a photo review is not a substitute for an in-person inspection.",
    category: "Decks",
    published: "2026-11-13",
    updated: "2026-11-13",
    answer: "Have a railing inspected in person if it moves when you lean on it, if posts are soft or rusted at the base, if balusters are missing, or if stairs feel uncertain underfoot. A photo can help a contractor prepare, but it cannot certify that a railing is safe. Guard height and opening rules come from the building code and your local official, and they vary with the work being done.",
    sections: [
      { h: "Signs it should be looked at in person", p: [
        "Lean gently on the top rail. If the post or rail moves, the connections or the post itself may have loosened or decayed. Other reasons to pause and call for an inspection include rusted or missing hardware, soft wood at the post base, balusters you can flex out of place, a stair that flexes, or a rail that sits noticeably lower than the rest of the run.",
        "If a railing feels unsafe, keep people away from that edge until it has been inspected. Do not rely on a temporary prop or a tighter screw as a lasting fix.",
      ] },
      { h: "What photos can and cannot do", p: [
        "Clear photos of the rail, the post bases and the stairs help us see obvious damage and plan a visit. They do not let us certify hardware buried in the post, the condition of a ledger, or whether a railing meets current code. Structural and safety conclusions need someone on site who can probe the wood and check the connections.",
      ] },
      { h: "Code is local, and it depends on the work", p: [
        "Guard and stair rules in Massachusetts come from the building code as adopted and enforced in your city or town. Typical residential conversations mention a 36-inch guard height and openings that should not pass a 4-inch sphere, but those figures are not a substitute for the current requirement on your property.",
        "When we replace railings or stairs we confirm the applicable rules with the local building department and pull a permit when the work requires one. We do not promise that an existing railing is ‘up to code’ from a photograph.",
      ] },
      { h: "What a repair usually includes", p: [
        "A railing or stair repair is scoped item by item: posts, rails, balusters, treads, stringers and hardware. Sometimes a small section is enough. Sometimes the honest recommendation is to replace the run so the height, openings and connections are consistent. That choice is explained in the written estimate.",
      ] },
    ],
    cta: { href: "/free-assessment", label: "Send Photos for a Deck Assessment" },
    related: [
      { href: "/services/board-railing-stairs", label: "Railing and stair repair" },
      { href: "/services/deck-repair", label: "Deck repair" },
      { href: "/repair-or-replace", label: "Repair-or-replace checker" },
    ],
  },
  {
    slug: "deck-maintenance-before-winter",
    title: "Deck Maintenance Before Winter in Massachusetts",
    description: "A practical late-season checklist for Greater Boston decks: clearing debris, watching drainage, knowing when to seal, and shoveling snow without damaging the boards.",
    category: "Seasonal",
    published: "2026-11-13",
    updated: "2026-11-13",
    answer: "Before a Massachusetts winter, clear leaves and soil off the boards and from between them, check that water can leave the surface, and look at railings and stairs for movement. Seal or stain only when the wood is dry and the product’s temperature window still holds. Once snow arrives, use a plastic shovel and skip salt on wood unless the finish maker says otherwise.",
    sections: [
      { h: "A short late-season checklist", p: [
        "Sweep or blow off leaves, acorns and soil. Organic matter trapped between boards holds moisture against the wood and the joists. Look under pots and mats, and clear the gaps at the house so water is not sitting against the ledger.",
        "Walk the railings and stairs. Movement, soft spots or a loose post is a reason to keep people off that area and request an assessment, not something to defer until spring if the deck will be used.",
      ] },
      { h: "Should you still seal in the fall?", p: [
        "Sealing before the first hard freeze helps keep water out of unprotected wood, but only if the boards are dry and overnight temperatures stay in the range the product allows — often around 50°F, depending on the can. If that window has closed, wait until late spring rather than trapping moisture under a film that cannot cure.",
        "Our longer guide on timing is here: When should you seal a deck in Massachusetts? The product instructions always win over a rule of thumb.",
      ] },
      { h: "Snow, ice and winter use", p: [
        "A plastic shovel is kinder to boards than a metal edge. Avoid rock salt on most wood finishes unless the manufacturer explicitly allows it; some de-icers damage coatings and fasteners. Composite still needs the snow taken off so water is not sitting in freeze-thaw cycles at the frame.",
        "If a heavy storm leaves drift against a rail or stair, clear it when you can do so safely. After the thaw, look again for popped fasteners, split boards or a rail that has loosened.",
      ] },
      { h: "What can wait until spring", p: [
        "A full refinish, a non-urgent board swap and most new-deck builds can be planned in winter and scheduled when the site is workable. Planning during the quieter months is often how a spring project actually starts on time. Use the project calculator or a new-deck estimate if you are in that camp, and send photos if something already looks wrong.",
      ] },
    ],
    cta: { href: "/free-assessment", label: "Send Photos for a Deck Assessment" },
    related: [
      { href: "/blog/when-to-seal-deck-massachusetts", label: "When to seal a deck in Massachusetts" },
      { href: "/services/deck-staining-sealing", label: "Staining and sealing" },
      { href: "/services/deck-repair", label: "Deck repair" },
    ],
  },
  {
    slug: "how-a-written-deck-estimate-works",
    title: "How a Written Deck Estimate Works",
    description: "What DeckCraft includes in a written estimate, how it differs from a planning figure or a calculator result, and what happens after you send photos.",
    category: "Decks",
    published: "2026-11-13",
    updated: "2026-11-13",
    answer: "A written deck estimate is a scoped price for a defined set of work, prepared after we have reviewed your photos and, when needed, visited the site. We don’t publish price lists, starting rates or calculator results, because two decks of the same size can need very different work.",
    sections: [
      { h: "Why there is no price list", p: [
        "Our scope planner helps you describe size, railings and extras; it does not produce a price. A guided walkthrough on your phone adds photos, a short video and your own tape measurements so we can scope the work before a site visit.",
        "Two decks of the same size can need very different work. That is why repair, staining and railing jobs are quoted from photos and a site check, not from a public price list.",
      ] },
      { h: "From photos to a written scope", p: [
        "You send photos — typically the whole deck, the worst spots, and the stairs or railings — or you request a new-deck estimate with a size and material preference. We reply with what we see and the kind of scope we would write. If the structure, the ledger or a safety item needs a closer look, we agree a visit with you first. We do not treat a photo review as a structural inspection.",
        "The written estimate then names the work, the materials we intend to use, the inclusions and exclusions, and the price. Permit responsibility and any allowances are called out rather than hidden in a round number.",
      ] },
      { h: "What you should expect to see on the page", p: [
        "A clear description of the surfaces and structure included. Notes on access, height or demolition where they affect the work. The board, railing or fence products discussed, or an allowance if a final choice is still open. What is not included — often finishing of adjacent landscaping, painting of the house, or utilities we have not been asked to move.",
        "No work starts until you have that document and have agreed it. A verbal range after a photo review is still a range, not the estimate.",
      ] },
      { h: "After you approve it", p: [
        "Scheduling depends on season, permits and the rest of the calendar. We do not publish a guaranteed start date or response time unless the owner has set one. Property managers and associations can use the same written-scope process across several units; start with a walkthrough request if you are managing more than one structure.",
      ] },
    ],
    cta: { href: "/new-deck-estimate", label: "Request a New Deck Estimate" },
    related: [
      { href: "/project-calculator", label: "Project calculator" },
      { href: "/free-assessment", label: "Photo assessment" },
      { href: "/blog/deck-repair-cost-boston", label: "How deck repair is priced" },
    ],
  },
];

export const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]));
