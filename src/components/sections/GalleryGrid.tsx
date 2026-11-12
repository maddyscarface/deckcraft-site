"use client";
import { useState } from "react";
import { BeforeAfter } from "../ui/BeforeAfter";
import { GALLERY } from "@/lib/gallery";

const FILTERS = ["All", "Deck Repair", "Staining", "Railings and Stairs", "New Decks", "Fencing", "Commercial and Property"];

export function GalleryGrid() {
  const [f, setF] = useState("All");
  const [n, setN] = useState(12);
  const items = GALLERY.filter((g) => f === "All" || g.service === f || g.town === f);
  return (
    <>
      <div className="sticky top-[68px] z-30 border-b border-line bg-bone/95 px-5 py-3 backdrop-blur lg:top-[76px]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {FILTERS.map((x) => (
            <button key={x} onClick={() => setF(x)} className={`shrink-0 border px-4 py-1.5 text-sm font-medium ${f === x ? "border-char bg-char text-white" : "border-char/25"}`}>{x}</button>
          ))}
        </div>
      </div>
      <section className="bg-bone px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          {items.length === 0 ? (
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="eyebrow rule text-cedar">Coming soon</p>
                <h2 className="mt-4 font-display text-[30px] leading-tight md:text-[38px]">We&apos;re documenting our first Greater Boston jobs now.</h2>
                <p className="mt-5 max-w-xl text-stone">We won&apos;t fill this page with stock photos or other people&apos;s work. Each project will appear here with real before and after photos, the town and the service, once the owner says yes.</p>
              </div>
              <ol className="grid gap-px bg-line sm:grid-cols-3">
                {[["Before", "Photos of the whole structure and every problem area, taken before work starts."], ["During", "Framing, fasteners and flashing photographed while they're still visible."], ["After", "The finished job from the same angles, plus a written summary for your records."]].map(([t, b], i) => (
                  <li key={t} className="bg-bone p-6"><p className="num text-2xl text-cedar">0{i + 1}</p><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-2 text-[15px] leading-relaxed text-stone">{b}</p></li>
                ))}
              </ol>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(0, n).map((g, i) => (
                  <div key={i} className="rounded-[2px] bg-white p-2 shadow-card">
                    <BeforeAfter before={g.before} after={g.after} town={g.town} service={g.service} illustrative={false} alt={`${g.service} in ${g.town}, MA`} />
                    {g.quote && <p className="p-3 text-sm italic">&ldquo;{g.quote}&rdquo;</p>}
                  </div>
                ))}
              </div>
              {items.length > n && <button onClick={() => setN(n + 6)} className="btn btn-hunter mx-auto mt-8 block">Load More</button>}
            </>
          )}
        </div>
      </section>
    </>
  );
}
