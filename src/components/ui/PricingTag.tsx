import { pricingEyebrow, pricingFlag } from "@/config/pricing";

/** "Planning assumption" eyebrow with a compact "Owner to confirm" flag (spec §2 labelling). */
export function PricingTag({ dark = false, prefix }: { dark?: boolean; prefix?: string }) {
  const flag = pricingFlag();
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className={`eyebrow ${dark ? "text-cedar-light" : "text-cedar-deep"}`}>{prefix ? `${prefix} · ` : ""}{pricingEyebrow()}</span>
      {flag && (
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${dark ? "border-white/25 text-white/80" : "border-cedar/40 text-cedar-deep"}`}>{flag}</span>
      )}
    </p>
  );
}
