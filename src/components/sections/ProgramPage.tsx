import Link from "next/link";
import { PageHero, Checklist, SectionHead } from "./Blocks";
import { Photo } from "../ui/Photo";
import { ROUTE_PHOTO } from "@/lib/page-photos";
import { FaqSection } from "../ui/Faq";
import { JsonLd } from "../ui/JsonLd";
import { WalkthroughForm } from "../forms/WalkthroughForm";
import { PortfolioPlanner } from "../tools/PortfolioPlanner";
import { PROGRAMS, SERVICE_PROMISE } from "@/lib/programs";
import { serviceSchema, faqSchema, pageGraph, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import type { Faq } from "@/lib/services";
import type { CustomerType } from "@/lib/lead-schema";

export type ProgramPageProps = {
  path: string;
  eyebrow: string;
  h1: string;
  sub: string;
  body?: string;
  pills?: string[];
  cards?: { title: string; body: string }[];
  listTitle?: string;
  list?: string[];
  note?: string;
  faqs?: Faq[];
  presetType?: Exclude<CustomerType, "homeowner">;
  planner?: boolean;
  cta?: string;
};

export function ProgramTable() {
  return (
    <>
    <ul className="space-y-4 md:hidden">
      {PROGRAMS.map((p) => (
        <li key={p.name} className="border border-line border-l-2 border-l-cedar bg-white p-5">
          <h3 className="font-display text-lg leading-snug">{p.name}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-hunter/80">{p.gets}</p>
          <p className="mt-3 text-sm text-stone"><span className="font-semibold text-char">Best for:</span> {p.bestFor}</p>
        </li>
      ))}
    </ul>
    <div className="hidden overflow-x-auto border border-line bg-white md:block">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="bg-char text-white"><tr><th className="p-4">Program</th><th className="p-4">What you get</th><th className="p-4">Best for</th></tr></thead>
        <tbody>
          {PROGRAMS.map((p) => (
            <tr key={p.name} className="border-t border-cream-dark align-top">
              <th className="p-4 font-display text-lg">{p.name}</th><td className="p-4 text-hunter/80">{p.gets}</td><td className="p-4 text-hunter/80">{p.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export function ProgramPage(p: ProgramPageProps) {
  return (
    <>
      <JsonLd data={pageGraph([webPageSchema(p.path, p.h1, p.sub), serviceSchema("Deck and Fence Property Maintenance Program", p.path), breadcrumbSchema([["Home", "/"], [p.eyebrow, p.path]]), ...(p.faqs?.length ? [faqSchema(p.faqs, p.path)] : [])])} />
      <PageHero eyebrow={p.eyebrow} h1={p.h1} sub={p.sub} photo={ROUTE_PHOTO[p.path] ?? "townhomeDeck"}>
        <Link href="#get-started" className="btn btn-cedar">{p.cta ?? "Request a Property Walkthrough"}</Link>
        <Link href="/portfolio-inspection-planner" className="btn btn-ghost">Plan an inspection round</Link>
      </PageHero>
      {p.pills && (
        <div className="border-b border-line bg-ivory px-5 py-4 lg:px-8"><div className="mx-auto flex max-w-[1320px] flex-wrap gap-2">{p.pills.map((x) => <span key={x} className="border border-line bg-white px-3 py-1.5 text-[13px] font-medium">{x}</span>)}</div></div>
      )}
      <section className="bg-bone px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            {p.body && <p className="text-lg leading-relaxed text-hunter/85">{p.body}</p>}
            {p.list && (<><h2 className="mt-8 font-display text-2xl">{p.listTitle}</h2><div className="mt-4"><Checklist items={p.list} /></div></>)}
            {p.note && <p className="mt-6 rounded-[2px] border-l-4 border-patina bg-white p-4 text-[15px]">{p.note}</p>}
          </div>
          <div>
            <div className="relative mb-10 aspect-[16/10] overflow-hidden"><Photo k="townhomeDeck" sizes="(min-width:1024px) 45vw, 100vw" /></div>
            <h2 className="font-display text-2xl">Our service promise</h2>
            <div className="mt-5"><Checklist items={SERVICE_PROMISE} /></div>
          </div>
        </div>
        {p.cards && (
          <div className="mx-auto mt-16 grid max-w-[1320px] gap-px bg-line md:grid-cols-3">
            {p.cards.map((c) => <div key={c.title} className="bg-bone p-8"><h3 className="font-display text-xl">{c.title}</h3><p className="mt-3 text-stone">{c.body}</p></div>)}
          </div>
        )}
      </section>
      <section className="bg-ivory px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <SectionHead eyebrow="Programs" title="Four ways to work with us," accent="one standard." />
          <div className="mt-8"><ProgramTable /></div>
        </div>
      </section>
      {p.planner && (
        <section className="bg-cedar-soft px-5 py-24"><div className="mx-auto max-w-xl"><PortfolioPlanner /></div></section>
      )}
      {p.faqs && <FaqSection faqs={p.faqs} />}
      <section id="get-started" className="scroll-mt-20 bg-char px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[32px] leading-tight text-white md:text-[42px]">Tell us about your properties. <span className="accent text-cedar-light">We&apos;ll scope the next step.</span></h2>
          <p className="mt-3 mb-10 text-white/70">Free walkthrough for associations, landlords and commercial properties.</p>
          <WalkthroughForm presetType={p.presetType} />
        </div>
      </section>
    </>
  );
}
