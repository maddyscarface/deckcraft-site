import Link from "next/link";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { POSTS } from "@/lib/blog";

export const metadata = meta("/blog", "Deck and Fence Care Resources | DeckCraft Boston", "Seasonal deck and fence advice for Greater Boston homeowners, associations, and landlords.");

export default function Page() {
  const [featured, ...rest] = POSTS;
  return (
    <>
      <PageHero compact eyebrow="RESOURCES" h1="Deck and fence care for Greater Boston." sub="Straight answers on cost, timing and when to repair or replace." />
      <section className="bg-cream px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <Link href={`/blog/${featured.slug}`} className="block rounded-xl bg-hunter p-8 text-white md:p-12">
            <p className="eyebrow text-linen">{featured.category}</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">{featured.title}</h2>
            <p className="mt-3 max-w-2xl text-sage">{featured.description}</p>
          </Link>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-lg bg-white p-6 shadow-card hover:-translate-y-0.5">
                <p className="eyebrow text-patina">{p.category}</p><h2 className="mt-2 font-display text-2xl">{p.title}</h2><p className="mt-2 text-hunter/75">{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
