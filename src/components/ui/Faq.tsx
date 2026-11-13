import type { Faq as F } from "@/lib/services";

export function FaqSection({ faqs, title = "Frequently asked questions", dark = false }: { faqs: F[]; title?: string; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-char text-white" : "bg-ivory"} border-t ${dark ? "border-white/10" : "border-line"} px-5 py-24 lg:px-8`}>
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div>
          <p className={`eyebrow rule ${dark ? "text-cedar-light" : "text-cedar"}`}>Questions</p>
          <h2 className="mt-4 font-display text-[32px] leading-tight md:text-[40px]">{title}</h2>
        </div>
        <div className={`divide-y border-y ${dark ? "divide-white/15 border-white/15" : "divide-line border-line"}`}>
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-1 text-[17px] font-semibold">
                {f.q}
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center border text-lg transition group-open:rotate-45 ${dark ? "border-white/30 text-cedar-light" : "border-line text-cedar"}`}>+</span>
              </summary>
              <p className={`mt-3 max-w-2xl leading-relaxed ${dark ? "text-white/70" : "text-stone"}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
