import Link from "next/link";
import { site } from "@/config/site";

/** Renders ONLY real, permissioned Google reviews from config. No sample reviews in production code. */
export function Reviews() {
  const { live, items, googleProfileUrl } = site.reviews;
  return (
    <section className="bg-hunter px-5 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-patina">WHAT OUR CLIENTS SAY</p>
        <h2 className="mt-2 font-display text-3xl md:text-[40px]">Real decks. Real neighbors.</h2>
        {live && items.length >= 3 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {items.map((r) => (
              <figure key={r.name + r.town} className="card-dark p-6">
                <p className="text-linen" aria-label="5 stars">★★★★★</p>
                <blockquote className="mt-3 text-[15px] leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-4 text-sm text-sage">{r.name} · {r.town} · {r.source}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-8 max-w-2xl space-y-4 text-sage">
            <p className="text-lg text-white">New to the web, not to the work.</p>
            <p>We publish only real reviews from verified customers, and only with their permission. As projects finish, you&apos;ll see them here alongside the job photos and town.</p>
            {googleProfileUrl ? (
              <Link href={googleProfileUrl} className="inline-block font-semibold text-linen underline">Read our Google reviews →</Link>
            ) : (
              <Link href="/gallery" className="inline-block font-semibold text-linen underline">See how we document every job →</Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
