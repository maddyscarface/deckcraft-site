import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, POST_BY_SLUG } from "@/lib/blog";
import { meta, articleSchema, breadcrumbSchema, webPageSchema, pageGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = POST_BY_SLUG[(await params).slug];
  if (!p) return {};
  return meta(`/blog/${p.slug}`, `${p.title} | DeckCraft`, p.description, {
    type: "article",
    published: p.published,
    modified: p.updated || p.published,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = POST_BY_SLUG[(await params).slug];
  if (!p) notFound();
  const path = `/blog/${p.slug}`;
  const published = new Date(p.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const modified = p.updated && p.updated !== p.published
    ? new Date(p.updated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  return (
    <article>
      <JsonLd data={pageGraph([
        webPageSchema(path, p.title, p.description),
        articleSchema(p),
        breadcrumbSchema([["Home", "/"], ["Resources", "/blog"], [p.title, path]]),
      ])} />
      <nav aria-label="Breadcrumb" className="border-b border-line bg-ivory px-5 py-3 text-[13px] text-stone lg:px-8">
        <ol className="mx-auto flex max-w-3xl flex-wrap gap-2">
          <li><Link href="/" className="hover:text-char">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/blog" className="hover:text-char">Resources</Link></li>
          <li aria-hidden>/</li>
          <li className="text-char">{p.title}</li>
        </ol>
      </nav>
      <header className="bg-navy px-5 py-16 text-white lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-cedar-light">{p.category}</p>
          <h1 className="mt-4 font-display text-[34px] leading-tight md:text-[46px]">{p.title}</h1>
          <p className="mt-3 text-sm text-white/65">DeckCraft Boston · {published}{modified ? ` · Updated ${modified}` : ""}</p>
        </div>
      </header>
      <div className="bg-bone px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="border-l-4 border-cedar bg-white p-5">
            <p className="text-xs font-semibold tracking-wider text-cedar uppercase">Short answer</p>
            <p className="mt-1 text-lg leading-relaxed text-char">{p.answer}</p>
          </div>
          <div className="prose-dc mt-8">
            {p.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((x, i) => <p key={i}>{x}</p>)}
              </section>
            ))}
          </div>
          {p.related && p.related.length > 0 && (
            <aside className="mt-10 border-t border-line pt-8">
              <p className="eyebrow text-cedar">Related</p>
              <ul className="mt-4 space-y-2">
                {p.related.map((r) => (
                  <li key={r.href}><Link href={r.href} className="inline-flex min-h-11 items-center font-semibold text-cedar-deep hover:underline">{r.label} →</Link></li>
                ))}
              </ul>
            </aside>
          )}
          <div className="mt-10 bg-navy p-8 text-center text-white">
            <p className="font-display text-2xl">Want a straight answer for your deck?</p>
            <Link href={p.cta.href} className="btn btn-cedar mt-5 inline-flex min-h-11 items-center justify-center">{p.cta.label}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
