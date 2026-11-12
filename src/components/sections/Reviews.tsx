import Link from "next/link";
import { site } from "@/config/site";

/** Renders ONLY real, permissioned Google reviews from config. No sample reviews in production code. */
export function Reviews() {
  const { live, items, googleProfileUrl } = site.reviews;
  return (
    <section className="bg-char px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <p className="eyebrow rule text-cedar-light">What clients say</p>
        {live && items.length >= 3 ? (
          <>
            <h2 className="mt-4 font-display text-[32px] md:text-[46px]">Real decks. <span className="accent text-cedar-light">Real neighbors.</span></h2>
            <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
              {items.map((r) => (
                <figure key={r.name + r.town} className="bg-char p-8">
                  <p className="text-cedar-light" aria-label="5 stars">★★★★★</p>
                  <blockquote className="mt-4 text-[16px] leading-relaxed">{r.text}</blockquote>
                  <figcaption className="mt-5 text-sm text-white/60">{r.name} · {r.town} · {r.source}</figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 grid gap-10 lg:grid-cols-2 lg:items-end">
            <h2 className="font-display text-[32px] leading-tight md:text-[46px]">New to the web. <span className="accent text-cedar-light">Not to the work.</span></h2>
            <div className="space-y-4 text-white/75">
              <p>We publish only real reviews from verified customers, and only with their permission. As projects finish, you&apos;ll see them here alongside the job photos and town.</p>
              {googleProfileUrl ? (
                <Link href={googleProfileUrl} className="link-arrow text-cedar-light">Read our Google reviews →</Link>
              ) : (
                <Link href="/gallery" className="link-arrow text-cedar-light">See how we document our work →</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
