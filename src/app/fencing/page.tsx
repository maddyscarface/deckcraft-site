import Link from "next/link";
import { meta, serviceSchema, webPageSchema, breadcrumbSchema, pageGraph } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PageHero, CtaBand } from "@/components/sections/Blocks";

export const metadata = meta("/fencing", "Fence Installation in Boston | DeckCraft",
  "Residential and commercial fencing services in Greater Boston. Explore materials and request a project assessment.");

export default function Page() {
  return (
    <>
      <JsonLd data={pageGraph([webPageSchema("/fencing", "Fence Installation in Boston"), serviceSchema("Fence Installation and Repair", "/fencing"), breadcrumbSchema([["Home", "/"], ["Fencing", "/fencing"]])])} />
      <PageHero photo="fenceGarden" eyebrow="FENCING" h1="Fences built for New England winters." sub="Repair, replacement and new fencing for homes, associations and commercial properties." />
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Link href="/fencing/residential" className="rounded-[2px] bg-hunter p-10 text-white transition hover:-translate-y-0.5"><Icon name="House" className="text-linen" size={32} /><h2 className="mt-4 font-display text-3xl">Residential Fencing</h2><p className="mt-2 text-sage">Privacy, picket, vinyl, aluminum and pool fencing; repair, install, staining and gates.</p><span className="mt-5 inline-block font-semibold text-linen">Send photos →</span></Link>
          <Link href="/fencing/commercial" className="rounded-[2px] bg-white p-10 shadow-card transition hover:-translate-y-0.5"><Icon name="Building2" className="text-patina" size={32} /><h2 className="mt-4 font-display text-3xl">Commercial and Property Fencing</h2><p className="mt-2 text-hunter/75">Perimeter, pool, dumpster enclosure and common-area fencing for associations and businesses.</p><span className="mt-5 inline-block font-semibold text-linen-dark">Request a walkthrough →</span></Link>
        </div>
        <div className="mx-auto mt-14 max-w-6xl">
          <h2 className="font-display text-3xl">Why fences fail in Boston</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[["Snowflake", "Frost heave", "Freezing ground lifts and tilts posts that weren't set deep enough."], ["Droplets", "Rot at the ground line", "Wood posts fail where soil, water and air meet."], ["TriangleAlert", "Storm and snow load", "Wind, falling limbs and plowed snow push sections over."]].map(([i, t, b]) => (
              <div key={t} className="rounded-[2px] bg-white p-6 shadow-card"><Icon name={i} className="text-patina" /><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1 text-hunter/75">{b}</p></div>
            ))}
          </div>
          <p className="mt-8 text-sm text-hunter/70">Every installation starts with a Dig Safe request. We pull permits where your town requires them and build pool fencing to Massachusetts barrier requirements, confirmed with your local building department.</p>
        </div>
      </section>
      <CtaBand title="Send us 3 photos of your fence." sub="We'll tell you whether it's a repair, a section, or a new run." href="/free-assessment?service=fence_repair" label="Get a Free Fence Assessment" secondary={{ href: "/request-walkthrough?service=fencing", label: "Multiple properties?" }} />
    </>
  );
}
