import type { PhotoKey } from "./photos";

/** Art direction: which licensed photo leads each template. Illustrative only, never "our project". */
export const ROUTE_PHOTO: Record<string, PhotoKey> = {
  "/services/deck-repair": "carpenterHammer",
  "/services/deck-staining-sealing": "stainBrush",
  "/services/board-railing-stairs": "railingDetail",
  "/services/new-decks": "compositeDeck",
  "/services/deck-rebuild-resurfacing": "deckShadows",
  "/project-calculator": "gardenDeck",
  "/new-deck-estimate": "compositeDeck",
  "/fencing": "fenceGarden",
  "/fencing/residential": "fenceGarden",
  "/fencing/commercial": "eveningLights",
  "/property-programs": "townhomeDeck",
  "/hoa-condo": "townhomeDeck",
  "/landlords": "townhomeDeck",
  "/commercial": "compositeDeck",
  "/homeowners": "gardenDeck",
  "/repair-or-replace": "weatheredBoards",
  "/portfolio-inspection-planner": "townhomeDeck",
  "/request-walkthrough": "townhomeDeck",
  "/about": "crewFraming",
  "/service-areas": "newEnglandHome",
  "/gallery": "deckShadows",
  "/blog": "autumnBoards",
  "/contact": "lakeDeck",
  "/free-assessment": "heroModernDeck",
};

export const SERVICE_CARD_PHOTO: Record<string, PhotoKey> = {
  "/services/deck-repair": "weatheredBoards",
  "/services/deck-staining-sealing": "stainBrush",
  "/services/board-railing-stairs": "railingDetail",
  "/services/new-decks": "compositeDeck",
  "/services/deck-rebuild-resurfacing": "deckShadows",
  "/fencing": "fenceGarden",
  "/fencing/residential": "fenceGarden",
  "/fencing/commercial": "eveningLights",
};
