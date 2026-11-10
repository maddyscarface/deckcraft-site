"use client";
import { useId, useState } from "react";

/**
 * Accessible before/after slider (range input drives the clip). With real photos pass `before`/`after`
 * image URLs. Without them it renders an SVG illustration that is always labelled "Illustrative example"
 * — never presented as a real job.
 */
export function BeforeAfter({
  before, after, alt = "Deck before and after", town, service, illustrative = !before,
  variant = "deck", className = "",
}: { before?: string; after?: string; alt?: string; town?: string; service?: string; illustrative?: boolean; variant?: "deck" | "fence" | "rail"; className?: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className={`relative aspect-[4/3] overflow-hidden rounded-xl shadow-premium select-none ${className}`}>
      <div className="absolute inset-0">{after ? <img src={after} alt={`${alt}: after`} className="h-full w-full object-cover" loading="lazy" /> : <Boards state="after" variant={variant} />}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before ? <img src={before} alt={`${alt}: before`} className="h-full w-full object-cover" loading="lazy" /> : <Boards state="before" variant={variant} />}
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-linen" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-linen text-xs font-bold text-hunter shadow">⇆</div>
      </div>
      <label htmlFor={id} className="sr-only">Drag to compare before and after</label>
      <input id={id} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-hunter px-3 py-1 text-xs font-semibold text-white">Before</span>
      <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-linen px-3 py-1 text-xs font-semibold text-hunter">After</span>
      {town && <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-linen px-3 py-1 text-xs font-semibold text-hunter">{town}</span>}
      {service && <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-patina px-3 py-1 text-xs font-semibold text-white">{service}</span>}
      {illustrative && (
        <figcaption className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rotate-0 rounded bg-black/55 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase" style={{ top: town || service ? "3.4rem" : "0.75rem", transform: "none" }}>
          Illustrative example
        </figcaption>
      )}
    </figure>
  );
}

function Boards({ state, variant }: { state: "before" | "after"; variant: "deck" | "fence" | "rail" }) {
  const before = state === "before";
  const base = before ? "#9a9a92" : "#8a5a32";
  const alt = before ? "#85857d" : "#7a4e2a";
  const line = before ? "#6b6b64" : "#5a3519";
  const vertical = variant === "fence";
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <rect width="400" height="300" fill={before ? "#a7a79f" : "#93613a"} />
      {Array.from({ length: 10 }).map((_, i) =>
        vertical ? (
          <g key={i}>
            <rect x={i * 40} y={before && i % 4 === 1 ? 12 : 0} width="38" height="300" fill={i % 2 ? base : alt} />
            {before && <path d={`M${i * 40 + 10} 40 l6 60 M${i * 40 + 25} 150 l-4 70`} stroke={line} strokeWidth="1.5" />}
          </g>
        ) : (
          <g key={i}>
            <rect x="0" y={i * 30} width="400" height="28" fill={i % 2 ? base : alt} />
            {before && <path d={`M${(i * 53) % 300} ${i * 30 + 8} l90 6 M${(i * 97) % 340} ${i * 30 + 18} l50 -4`} stroke={line} strokeWidth="1.5" />}
            {before && i % 3 === 0 && <ellipse cx={(i * 71) % 360 + 20} cy={i * 30 + 14} rx="22" ry="7" fill="#4f5b45" opacity=".35" />}
            {!before && <rect x="0" y={i * 30} width="400" height="4" fill="#fff" opacity=".07" />}
          </g>
        ),
      )}
      {variant === "rail" && <rect x="0" y="40" width="400" height="14" fill={before ? "#6f6f68" : "#3d2511"} />}
    </svg>
  );
}
