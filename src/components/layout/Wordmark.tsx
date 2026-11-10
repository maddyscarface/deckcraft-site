import Link from "next/link";

export function Wordmark({ dark = true }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-baseline gap-2" aria-label="DeckCraft Boston home">
      <span className="font-display text-[22px] font-bold leading-none">
        <span className={dark ? "text-white" : "text-hunter"}>Deck</span>
        <span className="text-linen">Craft</span>
      </span>
      <span className="text-[11px] font-medium tracking-[0.25em] text-linen">BOSTON</span>
    </Link>
  );
}
