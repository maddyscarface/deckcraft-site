import Link from "next/link";
import { Photo } from "../ui/Photo";
import { SectionHead } from "./Blocks";
import type { PhotoKey } from "@/lib/photos";
import { SCOPING_STEPS } from "@/lib/scoping";

/** Visible label so stock photography is never mistaken for a completed DeckCraft job. */
export function IllustrativeLabel({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute bottom-3 right-3 bg-navy/80 px-2.5 py-1 text-[11px] tracking-wide text-white/80 ${className}`}>
      Illustrative photo
    </span>
  );
}

export function ScopingSteps() {
  return (
    <section className="bg-ivory px-5 py-24 lg:px-8" aria-labelledby="scoping-title">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead eyebrow="How scoping works" title="Three steps to a" accent="written estimate." sub="No structural conclusions from photos alone, and no work starts until the scope is in writing." />
        <ol className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
          {SCOPING_STEPS.map((s) => (
            <li key={s.n}>
              <p className="num text-[44px] leading-none text-cedar">{s.n}</p>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-stone">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/new-deck-estimate" className="btn btn-char">Request a New Deck Estimate</Link>
          <Link href="/free-assessment" className="btn btn-outline">Send Photos for a Deck Assessment</Link>
        </div>
      </div>
    </section>
  );
}

const MATRIX: [string, string, string][] = [
  ["Gray boards, peeling stain, or a few split planks that still feel firm", "Often a cleaning, stain, seal or board replacement — if the framing is sound.", "/services/deck-staining-sealing"],
  ["Soft spots, movement in posts, or rot at the joists or ledger", "Needs an in-person look. Photos help us prepare; they do not certify the structure.", "/services/deck-repair"],
  ["Several issues at once on an older deck, or you want a new layout or material", "A rebuild or new deck may be the better comparison. We price options side by side when we can.", "/services/deck-rebuild-resurfacing"],
];

export function RepairMatrix() {
  return (
    <section className="bg-bone px-5 py-24 lg:px-8" aria-labelledby="matrix-title">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead eyebrow="Repair or rebuild" title="A first read," accent="confirmed in person." sub="This matrix is a planning guide, not a safety certification. Soft boards, moving posts or rot at the ledger should be inspected by qualified personnel before the deck is used heavily." />
        <div className="mt-12 grid gap-5">
          {MATRIX.map(([a, b, href]) => (
            <article key={a} className="border-t border-line pt-5 md:grid md:grid-cols-[1.1fr_1.2fr_auto] md:gap-6">
              <p className="text-[13px] font-medium uppercase tracking-wider text-stone md:sr-only">If you notice…</p>
              <p className="font-medium text-char">{a}</p>
              <div className="mt-3 md:mt-0">
                <p className="text-[13px] font-medium uppercase tracking-wider text-stone md:sr-only">It often points to…</p>
                <p className="text-stone">{b}</p>
              </div>
              <p className="mt-3 md:mt-0 md:self-start"><Link href={href} className="inline-flex min-h-11 items-center font-semibold text-cedar-deep hover:underline">Learn more →</Link></p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-stone">Want a structured walkthrough first? Try the <Link href="/repair-or-replace" className="font-semibold text-char underline decoration-cedar underline-offset-4">repair-or-replace checker</Link>, then send photos so we can confirm.</p>
      </div>
    </section>
  );
}

const HOME_GALLERY: { k: PhotoKey; caption: string; ratio: "16/9" | "4/5" }[] = [
  { k: "heroModernDeck", caption: "A finished wood deck beside a contemporary house — licensed, illustrative", ratio: "16/9" },
  { k: "weatheredBoards", caption: "Weathered, split boards of the kind we assess — licensed, illustrative", ratio: "4/5" },
  { k: "railingDetail", caption: "Timber post and rail detail — licensed, illustrative", ratio: "4/5" },
  { k: "autumnBoards", caption: "Autumn leaves on unprotected deck boards — licensed, illustrative", ratio: "16/9" },
];

export function HomeGallery() {
  return (
    <section className="bg-char px-5 py-24 text-white lg:px-8" aria-labelledby="gallery-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead dark eyebrow="Photography" title="Work you can study," accent="clearly labelled." sub="Until we have permissioned project photos with a town, work type and date, these licensed images illustrate materials and conditions only. They are not DeckCraft jobs." />
          <Link href="/gallery" className="link-arrow shrink-0 text-cedar-light">Open the gallery →</Link>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_GALLERY.map((g) => (
            <figure key={g.k} className="relative overflow-hidden">
              <div className={`relative ${g.ratio === "16/9" ? "aspect-[16/9] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
                <Photo k={g.k} sizes="(min-width:1024px) 25vw, 50vw" />
                <IllustrativeLabel />
              </div>
              <figcaption className="mt-3 text-[13px] leading-relaxed text-white/65">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-sm text-white/50">A real before-and-after gallery needs the owner’s permission, an approximate location, the work type, a date and a caption. We do not pair unrelated stock photos as if they were one job.</p>
      </div>
    </section>
  );
}

export function PermitNote({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`border-l-2 border-cedar bg-white text-[15px] leading-relaxed text-char/85 ${compact ? "p-4" : "p-6 md:p-7"}`}>
      <p className="text-xs font-semibold tracking-wider text-cedar uppercase">Permits and inspections</p>
      <p className="mt-2">Deck permitting and inspections vary by municipality and by the work itself. Structural repairs, new decks and some fences often need a permit in Massachusetts; cosmetic work sometimes does not. We check the rules for your town on each job and pull permits where they are required. Structural issues should be inspected in person by qualified personnel — a photo review is not that inspection.</p>
    </aside>
  );
}

const MATERIALS: { name: string; points: [string, string][] }[] = [
  {
    name: "Pressure-treated wood",
    points: [
      ["Upfront cost", "Usually the lowest material cost of the three common options."],
      ["Look and feel", "Traditional wood grain; color and surface change as it weathers."],
      ["Maintenance", "Needs periodic cleaning and sealing to limit freeze-thaw damage in New England."],
      ["Heat and traction", "Can be refinished; traction depends on the board profile and wear."],
      ["Warranty", "Varies by treatment and manufacturer — confirm the current terms for the product specified."],
    ],
  },
  {
    name: "Cedar",
    points: [
      ["Upfront cost", "Typically higher than pressure-treated; lower than many composite systems."],
      ["Look and feel", "Natural color and aroma; often chosen where the wood itself is part of the design."],
      ["Maintenance", "Naturally more rot-resistant than untreated wood, but still benefits from a finish in this climate."],
      ["Heat and traction", "Softwood; dents and weathers. Finish choice affects water shedding."],
      ["Warranty", "Usually limited to the material supplier; ask us to include the sheet in your estimate."],
    ],
  },
  {
    name: "Composite",
    points: [
      ["Upfront cost", "Usually the highest material and fastening cost; less annual refinishing."],
      ["Look and feel", "Manufactured boards in a range of colors; appearance depends on the product line."],
      ["Maintenance", "Washing rather than staining, in most cases. Still inspect the frame underneath."],
      ["Heat and traction", "Some colors run hotter in full sun; check the product’s guidance for your exposure."],
      ["Warranty", "Manufacturer warranties vary widely and have conditions. We do not invent coverage terms."],
    ],
  },
];

export function MaterialsCompare() {
  return (
    <section className="bg-ivory px-5 py-24 lg:px-8" aria-labelledby="materials-title">
      <div className="mx-auto max-w-[1320px]">
        <SectionHead eyebrow="Materials" title="Composite, cedar or" accent="pressure-treated." sub="Tradeoffs below are typical, not quotes. Installed prices depend on size, height, access, railings, demolition and permits, and are confirmed in a written estimate." />
        <div className="mt-12 grid gap-6 lg:hidden">
          {MATERIALS.map((m) => (
            <article key={m.name} className="border border-line bg-white p-5">
              <h3 className="font-display text-xl text-char">{m.name}</h3>
              <dl className="mt-4 space-y-3">
                {m.points.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[13px] font-medium uppercase tracking-wider text-stone">{k}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-char/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <div className="mt-12 hidden lg:block">
          <table className="w-full table-fixed text-left text-[15px]">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[18%] py-3 pr-4 text-[13px] font-medium uppercase tracking-wider text-stone">Topic</th>
                {MATERIALS.map((m) => (
                  <th key={m.name} className="py-3 pr-4 font-display text-lg font-normal text-char">{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATERIALS[0].points.map((_, i) => (
                <tr key={MATERIALS[0].points[i][0]} className="border-b border-line align-top">
                  <th className="py-4 pr-4 font-medium">{MATERIALS[0].points[i][0]}</th>
                  {MATERIALS.map((m) => (
                    <td key={m.name} className="py-4 pr-4 text-stone">{m.points[i][1]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-stone">Read the longer comparison in <Link href="/blog/composite-vs-pressure-treated-deck-boards" className="font-semibold text-char underline decoration-cedar underline-offset-4">Composite vs pressure-treated deck boards</Link>, or <Link href="/new-deck-estimate" className="font-semibold text-char underline decoration-cedar underline-offset-4">request a new deck estimate</Link>.</p>
      </div>
    </section>
  );
}

