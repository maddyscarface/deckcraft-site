import Link from "next/link";

/** Plank mark: three courses of deck boards with staggered butt joints. */
export function PlankMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true" className={className}>
      <rect x="1" y="3" width="14" height="5" fill="#b4542b" />
      <rect x="16" y="3" width="9" height="5" fill="#b4542b" />
      <rect x="1" y="10.5" width="7" height="5" fill="#e08a5c" />
      <rect x="9" y="10.5" width="16" height="5" fill="#e08a5c" />
      <rect x="1" y="18" width="11" height="5" fill="#b4542b" />
      <rect x="13" y="18" width="12" height="5" fill="#b4542b" />
    </svg>
  );
}

export function Wordmark({ dark = true, sub = true }: { dark?: boolean; sub?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="DeckCraft Boston home">
      <PlankMark />
      <span className="flex flex-col leading-none">
        <span className={`text-[19px] font-extrabold tracking-[0.06em] ${dark ? "text-white" : "text-char"}`} style={{ fontStretch: "125%" }}>
          DECKCRAFT
        </span>
        {sub && (
          <span className={`mt-1 text-[9.5px] font-semibold tracking-[0.32em] ${dark ? "text-fog" : "text-stone"}`} style={{ fontStretch: "112%" }}>
            DECKS · FENCES · BOSTON
          </span>
        )}
      </span>
    </Link>
  );
}
