import { PricingViewBeacon } from "@/components/estimate/PricingViewBeacon";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { SERVICE_CARDS, PRICE_DISCLAIMER, type PriceRow } from "@/lib/services";
import { TOWNS } from "@/lib/towns";
import { site } from "@/config/site";

export function PageHero({ eyebrow, h1, sub, children, compact = false }: { eyebrow?: string; h1: string; sub?: string; children?: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`bg-hunter px-5 text-white ${compact ? "py-16" : "py-20 md:py-28"}`}>
      <div className="mx-auto max-w-5xl">
        {eyebrow && <p className="eyebrow text-linen">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-[38px] leading-[1.05] font-bold md:text-[54px]">{h1}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg text-sage">{sub}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function ServicesGrid({ dark = true }: { dark?: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICE_CARDS.map((c) => (
        <Link key={c.href} href={c.href} className={dark ? "card-dark block p-7 text-white" : "block rounded-lg border border-cream-dark bg-white p-7 shadow-card transition hover:-translate-y-0.5 hover:border-linen"}>
          <Icon name={c.icon} className="text-linen" size={26} />
          <h3 className="mt-4 font-display text-xl">{c.title}</h3>
          <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-sage" : "text-hunter/75"}`}>{c.body}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-linen-dark">Learn more <Icon name="ArrowRight" size={14} /></span>
        </Link>
      ))}
    </div>
  );
}

export function PriceGuide({ rows, title = "What Greater Boston owners typically spend" }: { rows: PriceRow[]; title?: string }) {
  return (
    <div id="price-guide" className="scroll-mt-24 rounded-lg border-2 border-hunter bg-cream p-6 md:p-8">
      <PricingViewBeacon where="price-guide" />
      <h3 className="font-display text-2xl">{title}</h3>
      <table className="mt-5 w-full text-left text-[15px]">
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-b border-cream-dark last:border-0">
              <th className="py-3 pr-4 font-medium">{r.item}</th>
              <td className="py-3 text-right font-semibold whitespace-nowrap">{r.range}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-hunter/70">{PRICE_DISCLAIMER}</p>
    </div>
  );
}

export const PROCESS = [
  { icon: "Camera", title: "Send us photos", body: "Upload 3 photos: the whole deck or fence, the worst spots, and the stairs or gates. It takes about 2 minutes." },
  { icon: "MessageCircle", title: "We assess and send a range", body: "We review your photos and tell you honestly whether it looks like a repair, a refinish or a rebuild, with a price range." },
  { icon: "Calendar", title: "We confirm on site", body: "A short visit to confirm scope and lock your price in writing before any work starts." },
  { icon: "Sparkles", title: "We do the work and send photos", body: "We finish, clean up and walk it with you. Property clients get a photo report." },
];

export function Process({ cta = true }: { cta?: boolean }) {
  return (
    <section className="bg-cream px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-patina">HOW IT WORKS</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl">Simple. Fast. No pressure.</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-4">
          {PROCESS.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hunter text-linen"><Icon name={s.icon} /></div>
              <p className="mt-4 text-xs font-semibold tracking-wider text-patina">STEP {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-hunter/75">{s.body}</p>
            </li>
          ))}
        </ol>
        {cta && <Link href="/free-assessment" className="btn btn-hunter mt-10">Start With a Free Photo Assessment</Link>}
      </div>
    </section>
  );
}

export function Checklist({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3"><Icon name="CircleCheck" className="mt-0.5 shrink-0 text-linen-dark" /><span className={dark ? "text-white" : ""}>{t}</span></li>
      ))}
    </ul>
  );
}

export function TownPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {TOWNS.map((t) => (
        <Link key={t.slug} href={`/${t.slug}`} className="rounded-full border border-hunter px-4 py-1.5 text-sm font-medium transition hover:bg-hunter hover:text-white">{t.name}</Link>
      ))}
    </div>
  );
}

export function TrustBar() {
  const items: [string, string][] = [];
  if (site.reviews.live && site.reviews.rating && site.reviews.count) items.push(["Star", `${site.reviews.rating} on Google: ${site.reviews.count} reviews`]);
  if (site.credentials.licensedAndInsuredVerified) items.push(["ShieldCheck", "Licensed and Insured in Massachusetts"]);
  items.push(["Camera", site.responseHours ? `Photo Assessment Within ${site.responseHours} Business Hours` : "Free Photo Assessment"]);
  items.push(["MapPin", `Serving ${TOWNS.length}+ Greater Boston Communities`]);
  items.push(["Building2", "HOA, Landlord and Commercial Programs"]);
  items.push(["FileText", "Written Scope and Price Before Work Starts"]);
  return (
    <div className="bg-linen px-5 py-5">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-hunter">
        {items.map(([i, t]) => <li key={t} className="flex items-center gap-2"><Icon name={i} size={16} />{t}</li>)}
      </ul>
    </div>
  );
}

export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <section className="bg-cream px-5 pb-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl">Related</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map((l) => <Link key={l.href} href={l.href} className="rounded-md border border-hunter px-4 py-2 text-sm font-semibold hover:bg-hunter hover:text-white">{l.label} →</Link>)}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title, sub, href = "/free-assessment", label = "Send 3 Photos — Get a Free Assessment", secondary }: { title: string; sub?: string; href?: string; label?: string; secondary?: { href: string; label: string } }) {
  return (
    <section className="bg-hunter px-5 py-20 text-center text-white">
      <h2 className="mx-auto max-w-3xl font-display text-3xl md:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-sage">{sub}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={href} className="btn btn-linen">{label}</Link>
        {secondary && <Link href={secondary.href} className="btn btn-ghost">{secondary.label}</Link>}
      </div>
    </section>
  );
}
