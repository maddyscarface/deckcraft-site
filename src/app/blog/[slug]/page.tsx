import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, POST_BY_SLUG } from "@/lib/blog";
import { meta } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = POST_BY_SLUG[(await params).slug];
  return p ? meta(`/blog/${p.slug}`, `${p.title} | DeckCraft Boston`, p.description) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = POST_BY_SLUG[(await params).slug];
  if (!p) notFound();
  const schema = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.description,
    datePublished: p.published, dateModified: p.published, author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/og.png` } },
    image: `${site.url}/og.png`, mainEntityOfPage: `${site.url}/blog/${p.slug}`,
  };
  return (
    <article>
      <JsonLd data={[schema, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: p.title, acceptedAnswer: { "@type": "Answer", text: p.answer } }] }]} />
      <header className="bg-hunter px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-linen">← Resources</Link>
          <h1 className="mt-4 font-display text-[34px] leading-tight font-bold md:text-[46px]">{p.title}</h1>
          <p className="mt-3 text-sm text-sage">DeckCraft Boston · {new Date(p.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </header>
      <div className="bg-cream px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border-l-4 border-linen bg-white p-5"><p className="text-xs font-semibold tracking-wider text-patina">SHORT ANSWER</p><p className="mt-1 text-lg">{p.answer}</p></div>
          <div className="prose-dc mt-8">
            {p.sections.map((s) => (<section key={s.h}><h2>{s.h}</h2>{s.p.map((x, i) => <p key={i}>{x}</p>)}</section>))}
          </div>
          <div className="mt-10 rounded-xl bg-hunter p-8 text-center text-white">
            <p className="font-display text-2xl">Want a straight answer for your deck?</p>
            <Link href={p.cta.href} className="btn btn-linen mt-5">{p.cta.label}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
