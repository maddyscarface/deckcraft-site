import { PricingViewBeacon } from "@/components/estimate/PricingViewBeacon";
import { PricingTag } from "../ui/PricingTag";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";
import { SERVICE_CARDS, PRICE_DISCLAIMER, type PriceRow } from "@/lib/services";
import { PRICING } from "@/config/pricing";
import { TOWNS } from "@/lib/towns";
import { site } from "@/config/site";
import type { PhotoKey } from "@/lib/photos";
import { SERVICE_CARD_PHOTO } from "@/lib/page-photos";

/** Interior page hero. With `photo` it becomes a full-bleed, photography-led header. */
export function PageHero({ eyebrow, h1, sub, children, compact = false, photo, position }: { eyebrow?: string; h1: string; sub?: string; children?: React.ReactNode; compact?: boolean; photo?: PhotoKey; position?: string }) {
  if (photo && !compact) {
    return (
      <section className="relative isolate overflow-hidden bg-char text-white">
        <div className="photo-shade-side absolute inset-0 -z-10"><Photo k={photo} priority sizes="100vw" position={position} /></div>
        <div className="mx-auto flex min-h-[460px] max-w-[1320px] flex-col justify-end px-5 pt-24 pb-16 md:min-h-[540px] lg:px-8 lg:pb-20">
          {eyebrow && <p className="eyebrow rule rise text-white/85">{eyebrow}</p>}
          <h1 className="rise-2 mt-5 max-w-4xl font-display text-[38px] leading-[1.02] md:text-[60px]">{h1}</h1>
          {sub && <p className="rise-3 mt-6 max-w-2xl text-[17px] leading-relaxed text-white/85 md:text-lg">{sub}</p>}
          {children && <div className="rise-3 mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }
  return (
    <section className={`grain bg-char px-5 text-white lg:px-8 ${compact ? "py-16 md:py-20" : "py-20 md:py-28"}`}>
      <div className="relative mx-auto max-w-[1320px]">
        {eyebrow && <p className="eyebrow rule text-cedar-light">{eyebrow}</p>}
        <h1 className="mt-5 max-w-4xl font-display text-[36px] leading-[1.04] md:text-[54px]">{h1}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{sub}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, accent, sub, dark = false, center = false }: { eyebrow?: string; title: string; accent?: string; sub?: string; dark?: boolean; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className={`eyebrow ${center ? "" : "rule"} ${dark ? "text-cedar-light" : "text-cedar"}`}>{eyebrow}</p>}
      <h2 className={`mt-4 font-display text-[32px] leading-[1.06] md:text-[46px] ${dark ? "text-white" : "text-char"}`}>
        {title}{accent && <> <span className={`accent ${dark ? "text-cedar-light" : "text-cedar"}`}>{accent}</span></>}
      </h2>
      {sub && <p className={`mt-5 text-[17px] leading-relaxed ${dark ? "text-white/75" : "text-stone"}`}>{sub}</p>}
    </div>
  );
}

export function ServicesGrid({ dark = true }: { dark?: boolean }) {
  return (
    <div className="grid gap-px overflow-hidden border border-transparent sm:grid-cols-2 lg:grid-cols-3">
      {SERVICE_CARDS.map((c, i) => {
        const k = SERVICE_CARD_PHOTO[c.href];
        return (
          <Link key={c.href} href={c.href} className={`group block ${dark ? "bg-char-2 text-white" : "bg-white text-char"} transition`}>
            <div className="relative aspect-[16/10] overflow-hidden">
              {k ? <Photo k={k} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="transition duration-700 group-hover:scale-[1.04]" /> : null}
            </div>
            <div className="p-6 md:p-7">
              <p className={`num text-[13px] tracking-[0.14em] ${dark ? "text-cedar-light" : "text-cedar-deep"}`}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-[22px]">{c.title}</h3>
              <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-stone"}`}>{c.body}</p>
              <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${dark ? "text-cedar-light" : "text-cedar"}`}>Explore <Icon name="ArrowRight" size={14} className="transition group-hover:translate-x-1" /></span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function PriceGuide({ rows, title = "How pricing works" }: { rows: PriceRow[]; title?: string }) {
  const showsNewDeck = rows.some((r) => r.range.includes("/ sq ft"));
  return (
    <div id="price-guide" className="scroll-mt-24 border border-line bg-white p-6 shadow-card md:p-10">
      <PricingViewBeacon where="price-guide" />
      <PricingTag />
      <h3 className="mt-3 font-display text-2xl md:text-3xl">{title}</h3>
      <table className="mt-6 w-full table-fixed text-left text-[15px] sm:table-auto">
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-b border-line last:border-0">
              <th className="py-4 pr-3 font-medium align-top">{r.item}</th>
              <td className="num py-4 text-right text-[15px] leading-snug sm:text-[17px] sm:whitespace-nowrap">{r.range}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 space-y-2 text-sm leading-relaxed text-stone">
        {showsNewDeck && <p>* {PRICING.assumptions.join(" ")}</p>}
        <p>{PRICING.repairNote}</p>
        <p>{PRICE_DISCLAIMER}</p>
      </div>
    </div>
  );
}

export const PROCESS = [
  { icon: "Camera", title: "Send us photos", body: "Upload 3 photos: the whole deck or fence, the worst spots, and the stairs or gates. It takes about 2 minutes." },
  { icon: "MessageCircle", title: "We assess and advise", body: "We review your photos and tell you honestly whether it looks like a repair, a refinish or a rebuild, and how we would price it." },
  { icon: "Calendar", title: "We confirm the scope", body: "If anything needs a closer look, we agree a site visit with you. Your price is set in writing before any work starts." },
  { icon: "Sparkles", title: "We do the work and send photos", body: "We finish, clean up and walk it with you. Property clients get a photo report." },
];

export function Process({ cta = true }: { cta?: boolean }) {
  return (
    <section className="bg-bone px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead eyebrow="How it works" title="Four steps." accent="No pressure, no guesswork." />
        <ol className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-4 md:gap-8">
          {PROCESS.map((s, i) => (
            <li key={s.title}>
              <p className="num text-[44px] leading-none text-cedar">0{i + 1}</p>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-stone">{s.body}</p>
            </li>
          ))}
        </ol>
        {cta && <Link href="/free-assessment" className="btn btn-char mt-12">Start with a free photo assessment</Link>}
      </div>
    </section>
  );
}

export function Checklist({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3"><Icon name="Check" size={18} className={`mt-0.5 shrink-0 ${dark ? "text-cedar-light" : "text-cedar"}`} /><span className={dark ? "text-white/90" : ""}>{t}</span></li>
      ))}
    </ul>
  );
}

export function TownPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {TOWNS.map((t) => (
        <Link key={t.slug} href={`/${t.slug}`} className="border border-char/25 px-4 py-2 text-sm font-medium transition hover:border-char hover:bg-char hover:text-white">{t.name}</Link>
      ))}
    </div>
  );
}

/** Verified-only trust strip: reviews and licensing appear only once confirmed in config. */
export function TrustBar() {
  const items: [string, string][] = [];
  if (site.reviews.live && site.reviews.rating && site.reviews.count) items.push(["Star", `${site.reviews.rating} on Google · ${site.reviews.count} reviews`]);
  if (site.credentials.licensedAndInsuredVerified) items.push(["ShieldCheck", "Licensed and insured in Massachusetts"]);
  items.push(["Camera", site.responseHours ? `Photo assessment within ${site.responseHours} business hours` : "Free photo assessment"]);
  items.push(["MapPin", `${TOWNS.length}+ Greater Boston communities`]);
  items.push(["Building2", "HOA, landlord and commercial programs"]);
  items.push(["FileText", "Written scope and price before work starts"]);
  return (
    <div className="border-b border-line bg-ivory px-5 py-5 lg:px-8">
      <ul className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[13px] font-medium text-char/80">
        {items.map(([i, t]) => <li key={t} className="flex items-center gap-2"><Icon name={i} size={16} className="text-cedar" />{t}</li>)}
      </ul>
    </div>
  );
}

export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <section className="bg-bone px-5 pb-24 lg:px-8">
      <div className="mx-auto max-w-[1320px] border-t border-line pt-10">
        <p className="eyebrow text-stone">Related</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {links.map((l) => <Link key={l.href} href={l.href} className="border border-char/25 px-4 py-2.5 text-sm font-semibold transition hover:bg-char hover:text-white">{l.label} →</Link>)}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title, sub, href = "/free-assessment", label = "Send 3 Photos for an Assessment", secondary, photo = "eveningLights" }: { title: string; sub?: string; href?: string; label?: string; secondary?: { href: string; label: string }; photo?: PhotoKey }) {
  return (
    <section className="relative isolate overflow-hidden bg-char px-5 py-24 text-center text-white lg:px-8">
      <div className="absolute inset-0 -z-10 opacity-35"><Photo k={photo} sizes="100vw" /></div>
      <div className="absolute inset-0 -z-10 bg-char/55" />
      <h2 className="mx-auto max-w-3xl font-display text-[32px] leading-tight md:text-[44px]">{title}</h2>
      {sub && <p className="mx-auto mt-5 max-w-xl text-white/80">{sub}</p>}
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href={href} className="btn btn-cedar">{label}</Link>
        {secondary && <Link href={secondary.href} className="btn btn-ghost">{secondary.label}</Link>}
      </div>
    </section>
  );
}
