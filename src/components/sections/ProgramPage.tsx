import Link from "next/link";
import { PageHero, Checklist } from "./Blocks";
import { FaqSection } from "../ui/Faq";
import { JsonLd } from "../ui/JsonLd";
import { WalkthroughForm } from "../forms/WalkthroughForm";
import { PortfolioPlanner } from "../tools/PortfolioPlanner";
import { PROGRAMS, SERVICE_PROMISE } from "@/lib/programs";
import { serviceSchema } from "@/lib/seo";
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
    <div className="overflow-x-auto rounded-lg border border-cream-dark bg-white">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="bg-hunter text-white"><tr><th className="p-4">Program</th><th className="p-4">What you get</th><th className="p-4">Best for</th></tr></thead>
        <tbody>
          {PROGRAMS.map((p) => (
            <tr key={p.name} className="border-t border-cream-dark align-top">
              <th className="p-4 font-display text-lg">{p.name}</th><td className="p-4 text-hunter/80">{p.gets}</td><td className="p-4 text-hunter/80">{p.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProgramPage(p: ProgramPageProps) {
  return (
    <>
      <JsonLd data={serviceSchema("Deck and Fence Property Maintenance Program", p.path)} />
      <PageHero eyebrow={p.eyebrow} h1={p.h1} sub={p.sub}>
        <Link href="#get-started" className="btn btn-linen">{p.cta ?? "Request a Property Walkthrough"}</Link>
        <Link href="/portfolio-inspection-planner" className="btn btn-ghost">Plan an inspection round</Link>
      </PageHero>
      {p.pills && (
        <div className="bg-linen px-5 py-4"><div className="mx-auto flex max-w-6xl flex-wrap gap-2">{p.pills.map((x) => <span key={x} className="rounded-full bg-white/70 px-3 py-1 text-sm font-medium">{x}</span>)}</div></div>
      )}
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            {p.body && <p className="text-lg leading-relaxed text-hunter/85">{p.body}</p>}
            {p.list && (<><h2 className="mt-8 font-display text-2xl">{p.listTitle}</h2><div className="mt-4"><Checklist items={p.list} /></div></>)}
            {p.note && <p className="mt-6 rounded-md border-l-4 border-patina bg-white p-4 text-[15px]">{p.note}</p>}
          </div>
          <div>
            <h2 className="font-display text-2xl">Our service promise</h2>
            <div className="mt-4"><Checklist items={SERVICE_PROMISE} /></div>
          </div>
        </div>
        {p.cards && (
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
            {p.cards.map((c) => <div key={c.title} className="rounded-lg bg-white p-6 shadow-card"><h3 className="font-display text-xl">{c.title}</h3><p className="mt-2 text-hunter/75">{c.body}</p></div>)}
          </div>
        )}
      </section>
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl">Programs</h2>
          <div className="mt-8"><ProgramTable /></div>
        </div>
      </section>
      {p.planner && (
        <section className="bg-linen-pale px-5 py-20"><div className="mx-auto max-w-xl"><PortfolioPlanner /></div></section>
      )}
      {p.faqs && <FaqSection faqs={p.faqs} />}
      <section id="get-started" className="bg-hunter px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-white">Tell us about your properties. We&apos;ll come walk them.</h2>
          <p className="mt-2 mb-8 text-sage">Free walkthrough for associations, landlords and commercial properties.</p>
          <WalkthroughForm presetType={p.presetType} />
        </div>
      </section>
    </>
  );
}
