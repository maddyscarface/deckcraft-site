import Link from "next/link";
import { meta, webPageSchema, breadcrumbSchema, pageGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/Blocks";
import { POSTS } from "@/lib/blog";

export const metadata = meta("/blog", "Deck and Fence Care Resources | DeckCraft Boston", "Straight answers on repair versus replacement, materials, railings, winter care and how a written deck estimate works.");

export default function Page() {
  const [featured, ...rest] = POSTS;
  return (
    <>
      <JsonLd data={pageGraph([
        webPageSchema("/blog", "Deck and fence care for Greater Boston", "Straight answers on repair versus replacement, materials, railings, winter care and how a written deck estimate works."),
        breadcrumbSchema([["Home", "/"], ["Resources", "/blog"]]),
      ])} />
      <PageHero photo="autumnBoards" position="50% 55%" eyebrow="Resources" h1="Deck and fence care for Greater Boston." sub="Straight answers on cost, timing, materials, railings and how a written estimate works — without unverified promises." />
      <section className="bg-bone px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <Link href={`/blog/${featured.slug}`} className="block bg-navy p-8 text-white md:p-12">
            <p className="eyebrow text-cedar-light">{featured.category}</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">{featured.title}</h2>
            <p className="mt-3 max-w-2xl text-white/75">{featured.description}</p>
            <span className="mt-6 inline-flex min-h-11 items-center font-semibold text-cedar-light">Read the guide →</span>
          </Link>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="flex min-h-[11rem] flex-col bg-white p-6 shadow-card hover:-translate-y-0.5">
                <p className="eyebrow text-cedar">{p.category}</p>
                <h2 className="mt-2 font-display text-2xl leading-tight">{p.title}</h2>
                <p className="mt-2 text-char/75">{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
