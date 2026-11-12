import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

/**
 * next/image wrapper for the licensed photo set. `fill` mode by default (parent must be relative and sized).
 * Stock photos are illustrative only; never caption them as DeckCraft jobs.
 */
export function Photo({ k, sizes = "100vw", priority = false, className = "", fill = true, position }: { k: PhotoKey; sizes?: string; priority?: boolean; className?: string; fill?: boolean; position?: string }) {
  const p = PHOTOS[k];
  if (fill) {
    return <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} style={position ? { objectPosition: position } : undefined} />;
  }
  return <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} priority={priority} className={className} />;
}
