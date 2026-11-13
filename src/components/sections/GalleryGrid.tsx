"use client";
import { useMemo, useState } from "react";
import { BeforeAfter } from "../ui/BeforeAfter";
import { Photo } from "../ui/Photo";
import { GALLERY, GALLERY_CATEGORIES, ILLUSTRATIVE } from "@/lib/gallery";

export function GalleryGrid() {
  const [cat, setCat] = useState<string>("All");
  const [town, setTown] = useState<string>("All towns");
  const towns = useMemo(() => [...new Set(GALLERY.map((g) => g.town))].sort(), []);
  const real = GALLERY.filter((g) => (cat === "All" || g.category === cat) && (town === "All towns" || g.town === town));
  const illus = town === "All towns" ? ILLUSTRATIVE.filter((g) => cat === "All" || g.category === cat) : [];
  return (
    <>
      <div className="sticky top-[68px] z-30 border-b border-line bg-bone/95 px-5 py-3 backdrop-blur lg:top-[76px]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-3">
          <div className="flex flex-1 gap-2 overflow-x-auto" role="group" aria-label="Category">
            {["All", ...GALLERY_CATEGORIES].map((x) => (
              <button key={x} onClick={() => setCat(x)} aria-pressed={cat === x} className={`shrink-0 border px-4 py-2.5 text-sm font-medium min-h-11 ${cat === x ? "border-navy bg-navy text-white" : "border-navy/25 text-char"}`}>{x}</button>
            ))}
          </div>
          <label className="hidden shrink-0 items-center gap-2 text-sm md:flex">
            <span className="text-stone">Location</span>
            <select className="border border-navy/25 bg-white px-3 py-1.5 text-sm" value={town} onChange={(e) => setTown(e.target.value)} disabled={!towns.length} title={towns.length ? "" : "Location tags appear with real, permissioned jobs"}>
              <option>All towns</option>{towns.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
      </div>
      <section className="bg-bone px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          {real.length > 0 && (
            <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {real.map((g, i) => (
                <figure key={i} className="bg-white p-2 shadow-card">
                  <BeforeAfter before={g.before} after={g.after} town={g.town} service={g.category} illustrative={false} alt={`${g.category} in ${g.town}, MA`} />
                  <figcaption className="flex items-center justify-between p-3 text-sm"><span className="font-semibold">{g.category}</span><span className="bg-bone-2 px-2 py-0.5 text-xs">{g.town}, MA</span></figcaption>
                  {g.quote && <p className="px-3 pb-3 text-sm italic">&ldquo;{g.quote}&rdquo;</p>}
                </figure>
              ))}
            </div>
          )}
          {GALLERY.length === 0 && (
            <div className="mb-12 grid gap-6 border-l-[3px] border-copper bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <p className="eyebrow text-cedar">Real jobs are being documented</p>
                <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-char/85">The photos below are <b>illustrative</b> licensed images that show each category. They are not DeckCraft projects and carry no location. Real before-and-after jobs will appear with the town and service once each owner gives permission.</p>
              </div>
            </div>
          )}
          {illus.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="gallery-illustrative">
              {illus.map((g) => (
                <figure key={g.photo + g.category} className="bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Photo k={g.photo} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
                    <span className="absolute left-3 top-3 bg-navy/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">Illustrative</span>
                  </div>
                  <figcaption className="flex items-start justify-between gap-3 p-4 text-sm">
                    <span><span className="block font-semibold text-char">{g.category}</span><span className="text-stone">{g.caption}</span></span>
                    <span className="shrink-0 text-xs text-stone">Stock photo</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          {real.length === 0 && illus.length === 0 && <p className="text-stone">No projects in this category yet.</p>}
        </div>
      </section>
    </>
  );
}
