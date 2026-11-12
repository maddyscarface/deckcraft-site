import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "../forms/NewsletterForm";
import { site } from "@/config/site";
import { TOWNS } from "@/lib/towns";

const services = [
  ["Deck Repair", "/services/deck-repair"], ["Staining and Sealing", "/services/deck-staining-sealing"],
  ["Boards, Railings and Stairs", "/services/board-railing-stairs"], ["New Decks", "/services/new-decks"],
  ["Residential Fencing", "/fencing/residential"], ["Commercial Fencing", "/fencing/commercial"],
  ["Repair-or-Replace Checker", "/repair-or-replace"],
];
const company = [
  ["Property Programs", "/property-programs"], ["HOA and Condo", "/hoa-condo"], ["Landlords and Property Managers", "/landlords"], ["Commercial", "/commercial"],
  ["Request a Walkthrough", "/request-walkthrough"], ["About", "/about"], ["Gallery", "/gallery"], ["Resources", "/blog"], ["Contact", "/contact"],
];

export function Footer() {
  const socials = Object.entries(site.social).filter(([, u]) => u) as [string, string][];
  return (
    <footer className="bg-char pb-14 text-white lg:pb-0">
      <div className="border-b border-white/10 px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow rule text-cedar-light">The DeckCraft seasonal note</p>
            <h2 className="mt-4 max-w-xl font-display text-[28px] leading-tight md:text-[34px]">Four short emails a year on keeping a New England deck and fence <span className="accent text-cedar-light">out of trouble.</span></h2>
          </div>
          <div>
            <NewsletterForm />
            <p className="mt-2 text-xs text-fog">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-fog">Deck repair, refinishing, railings and fencing for Greater Boston homes, associations and property owners.</p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-4 text-sm">
                {socials.map(([k, u]) => <a key={k} className="text-white/80 underline-offset-4 hover:text-white hover:underline" href={u} rel="noopener" target="_blank">{k[0].toUpperCase() + k.slice(1)}</a>)}
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow text-fog">Services</p>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">{services.map(([l, h]) => <li key={h}><Link className="text-white/85 hover:text-cedar-light" href={h}>{l}</Link></li>)}</ul>
          </div>
          <div>
            <p className="eyebrow text-fog">Programs and company</p>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">{company.map(([l, h]) => <li key={h}><Link className="text-white/85 hover:text-cedar-light" href={h}>{l}</Link></li>)}</ul>
          </div>
          <div className="text-[14.5px]">
            <p className="eyebrow text-fog">Get in touch</p>
            {site.phone && site.phoneE164 && <p className="mt-4"><a href={`tel:${site.phoneE164}`} className="text-white hover:text-cedar-light">{site.phone}</a></p>}
            <p className="mt-4"><a href={`mailto:${site.email}`} className="text-white hover:text-cedar-light">{site.email}</a></p>
            {site.hours && <p className="mt-2 text-fog">{site.hours.label}</p>}
            <p className="mt-2 text-fog">Serving {TOWNS.length}+ Greater Boston communities</p>
            <Link href="/free-assessment" className="btn btn-cedar mt-6">Free Photo Assessment</Link>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1320px] flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-fog">
          <span>© {new Date().getFullYear()} DeckCraft Boston. All rights reserved.</span>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/terms#sms" className="hover:text-white">SMS Terms</Link>
          <Link href="/terms#accessibility" className="hover:text-white">Accessibility</Link>
          <Link href="/photo-credits" className="hover:text-white">Photo credits</Link>
          <span className="basis-full text-[11px] text-white/45 lg:basis-auto lg:ml-auto">Photography on this site is licensed stock used to illustrate our services, not DeckCraft project work.</span>
        </div>
      </div>
    </footer>
  );
}
