import type { Faq as F } from "@/lib/services";
import { JsonLd } from "./JsonLd";
import { faqSchema } from "@/lib/seo";

export function FaqSection({ faqs, title = "Frequently asked questions", dark = false }: { faqs: F[]; title?: string; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-hunter text-white" : "bg-cream"} px-5 py-20`}>
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
        <div className="mt-8 divide-y divide-cream-dark border-y border-cream-dark">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                {f.q}
                <span className="text-xl text-linen-dark transition group-open:rotate-45">+</span>
              </summary>
              <p className={`mt-3 leading-relaxed ${dark ? "text-sage" : "text-hunter/80"}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
