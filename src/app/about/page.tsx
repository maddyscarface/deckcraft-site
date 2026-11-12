import Link from "next/link";
import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { site } from "@/config/site";

export const metadata = meta("/about", "About DeckCraft Boston: Greater Boston Deck and Fence Specialists", "Independently owned deck and fence company serving Greater Boston.");

export default function Page() {
  const c = site.credentials;
  const creds = [c.hicRegistration && `MA Home Improvement Contractor Reg. #${c.hicRegistration}`, c.csl && `MA Construction Supervisor License #${c.csl}`, c.insuranceCarrier && `Insured through ${c.insuranceCarrier}`].filter(Boolean) as string[];
  return (
    <>
      <PageHero photo="crewFraming" eyebrow="ABOUT" h1="Not a handyman. Not a big-box installer. A deck and fence specialist." />
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-3xl text-lg leading-relaxed text-hunter/85">
          <p>DeckCraft Boston is an independently owned deck and fence company serving Greater Boston. New England is hard on outdoor wood: freeze-thaw cycles, snow load and humid summers. We built DeckCraft to repair, restore and build outdoor structures the right way, with honest assessments and clear pricing.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {[["Honesty", "If it should be repaired instead of replaced, we'll tell you."], ["Safety", "Railings, stairs and structure built and repaired properly, with permits where required."], ["Accountability", "One project lead, a written schedule, and photos of the finished work."]].map(([t, b]) => (
            <div key={t} className="rounded-[2px] bg-white p-6 shadow-card"><h2 className="font-display text-2xl">{t}</h2><p className="mt-2 text-hunter/75">{b}</p></div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-[2px] border border-cream-dark bg-white p-6">
          <h2 className="font-display text-2xl">Credentials</h2>
          {creds.length ? <ul className="mt-3 list-disc pl-5">{creds.map((x) => <li key={x}>{x}</li>)}</ul> : <p className="mt-2 text-hunter/70">License, registration and insurance details are published here once verified.</p>}
        </div>
        <div className="mt-12 text-center"><Link href="/free-assessment" className="btn btn-cedar">Get a Free Photo Assessment</Link></div>
      </section>
    </>
  );
}
