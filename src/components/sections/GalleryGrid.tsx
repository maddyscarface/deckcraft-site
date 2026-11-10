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
      <div className="sticky top-16 z-30 border-b border-cream-dark bg-cream px-5 py-3 lg:top-[72px]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {FILTERS.map((x) => (
            <button key={x} onClick={() => setF(x)} className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium ${f === x ? "border-hunter bg-hunter text-white" : "border-hunter"}`}>{x}</button>
          ))}
        </div>
      </div>
      <section className="bg-cream px-5 py-12">
        <div className="mx-auto max-w-7xl">
          {items.length === 0 ? (
            <div>
              <p className="max-w-2xl text-hunter/80">We&apos;re documenting our first Greater Boston jobs now. Every project added here will be a real DeckCraft job, labelled by town and service, shared with the owner&apos;s permission. Until then, these illustrations show the kind of transformation we&apos;re talking about.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <BeforeAfter service="Staining" /><BeforeAfter variant="rail" service="Railings" /><BeforeAfter variant="fence" service="Fencing" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(0, n).map((g, i) => (
                  <div key={i} className="rounded-lg bg-white p-2 shadow-card">
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
