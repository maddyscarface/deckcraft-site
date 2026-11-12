/**
 * Town pages. Each entry carries genuinely distinct copy (housing stock, typical jobs, local considerations)
 * so pages aren't doorway pages. Owner: add a real local job story to each page as soon as one exists.
 * Coverage of every listed town must be confirmed against actual crew routing before launch.
 */
export type Town = {
  slug: string;
  name: string;
  region: "Boston" | "Inner suburbs" | "MetroWest" | "North" | "South";
  intro: string;
  neighborhoods: string[];
  housing: string;
  typicalJobs: string[];
  propertyAngle: string;
  nearby: string[];
};

export const TOWNS: Town[] = [
  {
    slug: "boston", name: "Boston", region: "Boston",
    intro: "Boston's decks are rarely simple: rear porches stacked three high, roof decks over row houses, and small yards boxed in by neighbors. DeckCraft repairs and refinishes decks, porches and fences across the city's neighborhoods, with scheduling that respects tight streets and shared walls.",
    neighborhoods: ["Dorchester", "Jamaica Plain", "West Roxbury", "Roslindale", "South Boston", "Charlestown", "Brighton", "Hyde Park"],
    housing: "Triple-deckers and two-families dominate Dorchester, JP and Roslindale, so a lot of the work is stacked rear porches and stairs. West Roxbury and Hyde Park lean single-family with ground-level decks and fenced yards.",
    typicalJobs: ["Rear porch stair and railing repair on triple-deckers", "Roof-deck board replacement and refinishing", "Privacy fence repair on tight urban lots"],
    propertyAngle: "Boston landlords and self-managed condo associations often own several stacked porch systems. We scope each level of the buildings you include before the first board comes off.",
    nearby: ["brookline", "cambridge", "quincy", "milton"],
  },
  {
    slug: "cambridge", name: "Cambridge", region: "Inner suburbs",
    intro: "Cambridge mixes 19th-century two-families, converted condos and institutional properties on small, closely spaced lots. DeckCraft handles deck, porch and fence work here for owners, condo associations and the managers who run them.",
    neighborhoods: ["North Cambridge", "Cambridgeport", "Mid-Cambridge", "Agassiz", "Riverside", "Inman Square", "West Cambridge", "East Cambridge"],
    housing: "Many Cambridge buildings were split into condos, so a single rear deck can belong to an association with three or four owners who all need to agree on the repair.",
    typicalJobs: ["Shared rear deck repair for small condo associations", "Porch railing and stair replacement", "Fence repair along shared property lines"],
    propertyAngle: "Small Cambridge associations get a board-ready scope and price per item, so owners can vote on the work without a second meeting.",
    nearby: ["somerville", "arlington", "belmont", "watertown"],
  },
  {
    slug: "somerville", name: "Somerville", region: "Inner suburbs",
    intro: "Somerville is one of the densest cities in New England, and its two- and three-family houses carry a lot of rear porches. DeckCraft repairs porches, decks and fences across Somerville for owner-occupants, landlords and condo associations.",
    neighborhoods: ["Davis Square", "Union Square", "Spring Hill", "Ten Hills", "Winter Hill", "Teele Square", "Magoun Square", "East Somerville"],
    housing: "Two-families with stacked rear porches are the norm, and many are rented. Porch stairs and railings take the most wear.",
    typicalJobs: ["Stacked porch stair stringer and tread replacement", "Railing repairs between tenants", "Staining and sealing small rear decks"],
    propertyAngle: "For Somerville landlords we line up porch work with unit turnovers so tenants aren't living through it.",
    nearby: ["cambridge", "medford", "arlington"],
  },
  {
    slug: "brookline", name: "Brookline", region: "Inner suburbs",
    intro: "Brookline runs from brick apartment blocks near Coolidge Corner to large single-family homes in Chestnut Hill and Fisher Hill. DeckCraft restores decks and fences for Brookline homeowners and the associations that manage its many condo buildings.",
    neighborhoods: ["Coolidge Corner", "Brookline Village", "Washington Square", "Chestnut Hill", "Fisher Hill", "Aspinwall Hill", "South Brookline"],
    housing: "Older single-family homes often have decks added decades ago that are now due for structural attention, while condo buildings carry shared decks and balconies.",
    typicalJobs: ["Refinishing and sealing older cedar decks", "Ledger and framing assessment on decks added in past decades", "Condo balcony railing repair"],
    propertyAngle: "Brookline condo boards get a condition report with photos for each deck and balcony in scope, ranked by priority.",
    nearby: ["newton", "boston", "needham"],
  },
  {
    slug: "newton", name: "Newton", region: "Inner suburbs",
    intro: "Newton's colonials and Victorians often carry decks that have seen 20 or more New England winters. DeckCraft repairs, restains and fences homes across Newton Centre, Newton Highlands, Waban, Chestnut Hill and every Newton village.",
    neighborhoods: ["Newton Centre", "Newton Highlands", "Waban", "Chestnut Hill", "West Newton", "Auburndale", "Newtonville", "Oak Hill"],
    housing: "Mostly single-family homes with mature yards, where decks back onto wooded or shaded lots that hold moisture.",
    typicalJobs: ["Mildew cleaning and restaining on shaded decks", "Repair-or-replace assessments before a sale", "Wood privacy fence replacement"],
    propertyAngle: "Selling in Newton? A deck and fence touch-up before listing can usually be scoped from photos in one round.",
    nearby: ["wellesley", "needham", "waltham", "watertown"],
  },
  {
    slug: "wellesley", name: "Wellesley", region: "MetroWest",
    intro: "Wellesley homeowners expect outdoor spaces finished to the same standard as the house. DeckCraft restores, repairs and rebuilds decks and fences across Wellesley with clear scopes and tidy job sites.",
    neighborhoods: ["Wellesley Hills", "Wellesley Farms", "Wellesley Square", "Cliff Estates", "Poets Corner", "Fells"],
    housing: "Larger single-family lots with big multi-level decks, pool areas and long fence runs.",
    typicalJobs: ["Multi-level deck refinishing", "Pool fencing and self-closing gates", "Composite board and railing repair"],
    propertyAngle: "For larger properties we stage the work so the yard stays usable while sections are finished.",
    nearby: ["newton", "needham", "waltham"],
  },
  {
    slug: "needham", name: "Needham", region: "MetroWest",
    intro: "Needham's family neighborhoods are full of backyard decks that see heavy summer use and long snowy winters. DeckCraft repairs, stains and fences homes across Needham, from Needham Heights to Birds Hill.",
    neighborhoods: ["Needham Heights", "Needham Center", "Birds Hill", "Broadmeadow", "Hillside", "Charles River Village"],
    housing: "Single-family homes, many expanded over the years, with decks and fences of mixed ages on the same lot.",
    typicalJobs: ["Staining and sealing family decks", "Stair and railing repair", "Fence section and gate repair"],
    propertyAngle: "We'll match a new fence section or deck board to what's already there wherever materials allow.",
    nearby: ["wellesley", "newton", "brookline"],
  },
  {
    slug: "arlington", name: "Arlington", region: "North",
    intro: "Arlington sits between dense two-family streets near the Cambridge line and hilly single-family neighborhoods to the west. DeckCraft handles deck, porch and fence repair across both.",
    neighborhoods: ["East Arlington", "Arlington Center", "Arlington Heights", "Morningside", "Turkey Hill", "Jason Heights"],
    housing: "East Arlington has many two-families with rear porches. The Heights have single-family homes on sloped lots, where tall deck posts and long stairs are common.",
    typicalJobs: ["Rear porch repair on two-families", "Tall post and stair assessments on sloped lots", "Fence repair after frost heave"],
    propertyAngle: "Two-family owners can bundle both units' porches into one scope and one visit.",
    nearby: ["belmont", "lexington", "medford", "somerville"],
  },
  {
    slug: "belmont", name: "Belmont", region: "Inner suburbs",
    intro: "Belmont's colonials, two-families and hillside homes give its decks a wide range of conditions. DeckCraft repairs, refinishes and fences homes across Belmont with written scopes and honest repair-or-replace advice.",
    neighborhoods: ["Belmont Center", "Belmont Hill", "Waverley Square", "Cushing Square", "Payson Park", "Winn Brook"],
    housing: "A mix of single-family and two-family homes; hillside lots on Belmont Hill bring raised decks and long stairs.",
    typicalJobs: ["Raised deck framing assessments", "Refinishing cedar and pressure-treated decks", "Picket and privacy fence repair"],
    propertyAngle: "Two-family owners in Waverley and Cushing Square often bundle porch and fence work in one visit.",
    nearby: ["arlington", "watertown", "cambridge", "waltham"],
  },
  {
    slug: "watertown", name: "Watertown", region: "Inner suburbs",
    intro: "Watertown pairs older two-family neighborhoods with newer townhouse and condo developments. DeckCraft repairs decks and fences for both homeowners and the associations that manage shared structures.",
    neighborhoods: ["Watertown Square", "East End", "West End", "Coolidge Square", "Bemis", "Oakley"],
    housing: "Two-families with rear porches plus newer condo complexes with balconies and shared fencing.",
    typicalJobs: ["Condo balcony railing repairs", "Two-family porch stair replacement", "Common-area fence repair"],
    propertyAngle: "Newer Watertown associations often need a first condition baseline. Our annual inspection gives the board one.",
    nearby: ["belmont", "newton", "waltham", "cambridge"],
  },
  {
    slug: "waltham", name: "Waltham", region: "MetroWest",
    intro: "Waltham's housing runs from worker cottages and two-families near Moody Street to garden-style apartment complexes and commercial parks along Route 128. DeckCraft serves homeowners, landlords and commercial properties across the city.",
    neighborhoods: ["Moody Street", "Warrendale", "Cedarwood", "The Highlands", "Piety Corner", "South Side"],
    housing: "A large rental market, garden-style complexes, and commercial properties that need perimeter and dumpster-enclosure fencing.",
    typicalJobs: ["Garden-complex deck and stair repair", "Dumpster enclosure and perimeter fencing", "Turnover staining for rental units"],
    propertyAngle: "Waltham property managers can put every building on one inspection round and one written schedule.",
    nearby: ["newton", "watertown", "lexington", "belmont"],
  },
  {
    slug: "medford", name: "Medford", region: "North",
    intro: "Medford has dense two- and three-family streets near the Mystic and quieter single-family neighborhoods near the Fells. DeckCraft repairs porches, decks and fences across the city for owners and landlords.",
    neighborhoods: ["West Medford", "Medford Square", "Wellington", "South Medford", "Lawrence Estates", "Fulton Heights"],
    housing: "Multi-family rentals with stacked porches near the squares; single-family homes with backyard decks near the Fells.",
    typicalJobs: ["Stacked porch repair on multi-family rentals", "Backyard deck restaining", "Fence replacement on narrow lots"],
    propertyAngle: "Landlords with a few Medford buildings get fixed-scope pricing per building and a photo report for each.",
    nearby: ["somerville", "arlington", "boston"],
  },
  {
    slug: "lexington", name: "Lexington", region: "North",
    intro: "Lexington's mid-century and newer single-family homes often have large decks that were built once and rarely maintained since. DeckCraft restores, repairs and rebuilds decks and fences across Lexington.",
    neighborhoods: ["Lexington Center", "East Lexington", "Countryside", "Meriam Hill", "Five Fields", "Follen Hill"],
    housing: "Larger single-family lots with wooded backyards, where shade and leaf litter keep decks damp.",
    typicalJobs: ["Rebuilds where original framing has reached end of life", "Mildew cleaning and solid-stain refinishes", "Long privacy fence runs"],
    propertyAngle: "For decks of uncertain age we price repair and rebuild side by side so you can compare.",
    nearby: ["arlington", "belmont", "waltham"],
  },
  {
    slug: "quincy", name: "Quincy", region: "South",
    intro: "Quincy runs from coastal neighborhoods exposed to salt air to dense multi-family streets near Quincy Center. DeckCraft repairs and protects decks and fences across Quincy for homeowners, landlords and condo associations.",
    neighborhoods: ["Wollaston", "North Quincy", "Squantum", "Marina Bay", "Houghs Neck", "Quincy Point", "West Quincy"],
    housing: "Waterfront and near-water homes where wind and salt accelerate wear on hardware and finishes, plus many condo buildings and multi-family rentals.",
    typicalJobs: ["Corrosion-resistant fastener and hardware replacement", "Sealing decks exposed to coastal weather", "Condo deck and balcony repair programs"],
    propertyAngle: "Quincy associations near the water benefit from annual inspections because hardware wears faster there.",
    nearby: ["milton", "boston"],
  },
  {
    slug: "milton", name: "Milton", region: "South",
    intro: "Milton's large lots, older homes and wooded hillsides make for decks and fences that face a lot of shade and moisture. DeckCraft repairs, refinishes and rebuilds outdoor structures across Milton.",
    neighborhoods: ["East Milton", "Milton Village", "Milton Hill", "Brush Hill", "Columbine", "Scotch Woods"],
    housing: "Predominantly single-family homes, many older, on generous and often wooded lots.",
    typicalJobs: ["Refinishing shaded decks prone to mildew", "Long-run wood fence repair and replacement", "Stair and railing repair on raised decks"],
    propertyAngle: "Long fence runs can be phased over two seasons if that suits your budget.",
    nearby: ["quincy", "boston", "needham"],
  },
];

export const TOWN_BY_SLUG = Object.fromEntries(TOWNS.map((t) => [t.slug, t]));

/** Candidate markets — add pages only after crew coverage is confirmed (master brief §4). */
export const CANDIDATE_TOWNS = ["Dedham", "Natick", "Framingham", "Winchester", "Worcester", "South Shore (Braintree, Weymouth, Hingham)"];

/** For autocomplete in forms. */
export const TOWN_NAMES = [
  ...TOWNS.map((t) => t.name),
  "Back Bay", "South End", "Jamaica Plain", "West Roxbury", "Dorchester", "Winchester", "Dedham", "Natick", "Framingham", "Weston", "Wayland", "Braintree", "Weymouth", "Hingham", "Worcester", "Other",
];

/** Sales geography for routing / owner assignment (GHL `dc_geography`). Unknown towns → "Other". */
export function geographyFor(town?: string | null): Town["region"] | "Other" {
  if (!town) return "Other";
  const t = town.trim().toLowerCase();
  const hit = TOWNS.find((x) => x.name.toLowerCase() === t || x.slug === t || x.neighborhoods.some((n) => n.toLowerCase() === t));
  return hit?.region ?? "Other";
}
