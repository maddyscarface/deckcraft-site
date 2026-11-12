/**
 * Photo asset manifest. Every image in /public/images is licensed stock photography used to
 * ILLUSTRATE the type of work and setting. None of it is DeckCraft project work, and it must never
 * be captioned or implied as such. Replace with real, permissioned job photos as they are documented
 * (keep the same keys so layouts don't change).
 *
 * License: Pexels License (https://www.pexels.com/license/) — free for commercial use, no attribution
 * required, modification allowed. Not allowed: selling unaltered copies, implying endorsement by people
 * shown, or using identifiable people in a misleading way.
 */
export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  photographer: string;
  sourceUrl: string;
  license: "Pexels License";
  /** Contains identifiable people: never imply they are DeckCraft staff or customers. */
  people?: boolean;
};

const px = (id: number, slug: string) => `https://www.pexels.com/photo/${slug}-${id}/`;

export const PHOTOS = {
  heroModernDeck: { src: "/images/hero-modern-deck.webp", alt: "Wide hardwood deck with dining set beside a modern charcoal-clad house", width: 2000, height: 1333, photographer: "Max Vakhtbovych", sourceUrl: px(7587854, "modern-house-outdoor-terrace"), license: "Pexels License" },
  lakeDeck: { src: "/images/lake-deck-adirondack.webp", alt: "Adirondack chair on a wood deck with a black railing overlooking a lake", width: 1400, height: 1867, photographer: "Quintin Alderman", sourceUrl: px(28352026, "serene-lakeside-view-with-adirondack-chair"), license: "Pexels License" },
  compositeDeck: { src: "/images/waterfront-composite-deck.webp", alt: "Large grey low-maintenance deck with glass railing and lounge seating", width: 1800, height: 1201, photographer: "Max Vakhtbovych", sourceUrl: px(7546601, "photo-of-the-terrace"), license: "Pexels License" },
  townhomeDeck: { src: "/images/townhome-deck.webp", alt: "Townhome deck with patio table, chairs and a covered grill", width: 1600, height: 1067, photographer: "Curtis Adams", sourceUrl: px(12700434, "wooden-deck-with-table-and-chairs"), license: "Pexels License" },
  gardenDeck: { src: "/images/garden-deck.webp", alt: "Sunlit hardwood deck and bench table outside a timber-framed room", width: 1600, height: 1068, photographer: "Stradbroke Island", sourceUrl: px(37588542, "modern-patio-with-open-wooden-deck-and-furniture"), license: "Pexels License" },
  crewFraming: { src: "/images/crew-framing.webp", alt: "Two carpenters cutting and assembling a timber frame outdoors", width: 1600, height: 1067, photographer: "Ron Lach", sourceUrl: px(8820187, "carpenters-building-a-wooden-structure"), license: "Pexels License", people: true },
  carpenterHammer: { src: "/images/carpenter-hammer.webp", alt: "Carpenter fastening a board with a hammer", width: 1400, height: 933, photographer: "Andrea Piacquadio", sourceUrl: px(3814513, "man-using-hammer"), license: "Pexels License", people: true },
  stainBrush: { src: "/images/stain-brush.webp", alt: "Brush applying stain to vertical wood boards", width: 1200, height: 1600, photographer: "Lisa Fotios", sourceUrl: px(31583249, "hand-painting-wooden-fence-with-brush-outdoors"), license: "Pexels License" },
  fenceGarden: { src: "/images/fence-garden.webp", alt: "Sunlit wooden picket fence in a garden", width: 1200, height: 1500, photographer: "Lucian Cornea", sourceUrl: px(18832449, "fence-in-a-yard"), license: "Pexels License" },
  weatheredBoards: { src: "/images/weathered-boards.webp", alt: "Close-up of grey, weathered and split wood boards", width: 1000, height: 1500, photographer: "Lorenzo Manera", sourceUrl: px(37699991, "close-up-of-weathered-wooden-planks-texture"), license: "Pexels License" },
  autumnBoards: { src: "/images/autumn-deck-boards.webp", alt: "Fallen autumn leaves on weathered deck boards", width: 1200, height: 1275, photographer: "Damir K", sourceUrl: px(18505074, "dried-autumn-leaves-on-the-deck-boards"), license: "Pexels License" },
  newEnglandHome: { src: "/images/new-england-home.webp", alt: "White colonial house with autumn trees in Concord, Massachusetts", width: 1800, height: 1200, photographer: "Phil Evenden", sourceUrl: px(40360320, "classic-new-england-house-in-autumn"), license: "Pexels License" },
  eveningLights: { src: "/images/evening-lights.webp", alt: "Backyard pergola and wood fence lit by string lights at dusk", width: 1600, height: 1067, photographer: "Sóc Năng Động", sourceUrl: px(32751744, "charming-outdoor-patio-with-string-lights-in-evening"), license: "Pexels License" },
  railingDetail: { src: "/images/railing-detail.webp", alt: "Close-up of a solid timber railing post and rail", width: 1400, height: 933, photographer: "佳瑋 劉", sourceUrl: px(19893402, "wooden-railing-in-forest"), license: "Pexels License" },
  deckShadows: { src: "/images/deck-shadows.webp", alt: "Afternoon sun casting railing shadows across deck boards", width: 1600, height: 1067, photographer: "Jan van der Wolf", sourceUrl: px(15975707, "sunlight-and-shadow-on-wooden-pier"), license: "Pexels License" },
  cabinDeck: { src: "/images/cabin-deck-autumn.webp", alt: "Dark-stained house with wood steps and deck among autumn trees", width: 1800, height: 1198, photographer: "Andrea Davis", sourceUrl: px(40102060, "modern-vermont-cabin-exterior-in-autumn-setting"), license: "Pexels License" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
export const photo = (k: PhotoKey): Photo => PHOTOS[k];
