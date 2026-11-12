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
  answer: string; // 40–60 word direct answer for AEO / featured snippets
  sections: { h: string; p: string[] }[];
  cta: { href: string; label: string };
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
        "Repairs are scoped item by item: boards, joists, ledger, flashing, railings and stairs. New decks are planned per square foot: our current planning assumption starts at $39.99 per square foot for a straightforward pressure-treated deck (to be confirmed, before permits, demolition and upgrades). Most new-deck projects fall into planning bands of $8k–15k, $15k–25k or $25k+. None of these figures is a quote; your price is set in a written estimate.",
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
    title: "Repair or Replace? How to Tell What Your Deck Actually Needs",
    description: "The signs that point to a repair, a refinish or a rebuild, and why the framing and ledger decide it, not the boards.",
    category: "Decks",
    published: "2026-11-02",
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
];

export const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]));
