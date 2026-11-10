import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "../forms/NewsletterForm";
import { site } from "@/config/site";

const services = [
  ["Deck Repair", "/services/deck-repair"], ["Staining and Sealing", "/services/deck-staining-sealing"],
  ["Railings and Stairs", "/services/board-railing-stairs"], ["New Decks", "/services/new-decks"],
  ["Residential Fencing", "/fencing/residential"], ["Commercial Fencing", "/fencing/commercial"],
  ["Repair-or-Replace Checker", "/repair-or-replace"],
];
const company = [
  ["HOA and Condo", "/hoa-condo"], ["Landlords and Property Managers", "/landlords"], ["Commercial", "/commercial"],
  ["Request a Walkthrough", "/request-walkthrough"], ["About", "/about"], ["Gallery", "/gallery"], ["Resources", "/blog"],
  ["Service Areas", "/service-areas"], ["Contact", "/contact"],
];

export function Footer() {
  return (
    <footer className="pb-14 lg:pb-0">
      <div className="bg-linen px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-[22px] text-hunter">Seasonal deck and fence tips for Greater Boston, straight to your inbox.</h3>
            <p className="text-sm text-hunter/80">No spam. Unsubscribe anytime.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="bg-hunter px-5 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <Wordmark />
            <p className="mt-3 text-sm text-sage">Greater Boston&apos;s deck and fence specialists.</p>
            <div className="mt-4 flex gap-2 text-sm">
              <a className="rounded-full bg-patina px-3 py-1.5 hover:bg-linen hover:text-hunter" href={site.social.instagram} rel="noopener" target="_blank">Instagram</a>
              <a className="rounded-full bg-patina px-3 py-1.5 hover:bg-linen hover:text-hunter" href={site.social.facebook} rel="noopener" target="_blank">Facebook</a>
              <a className="rounded-full bg-patina px-3 py-1.5 hover:bg-linen hover:text-hunter" href={site.social.tiktok} rel="noopener" target="_blank">TikTok</a>
            </div>
          </div>
          <div>
            <p className="eyebrow text-linen">Services</p>
            <ul className="mt-3 space-y-2 text-sm">{services.map(([l, h]) => <li key={h}><Link className="hover:text-linen" href={h}>{l}</Link></li>)}</ul>
          </div>
          <div>
            <p className="eyebrow text-linen">Programs and Company</p>
            <ul className="mt-3 space-y-2 text-sm">{company.map(([l, h]) => <li key={h}><Link className="hover:text-linen" href={h}>{l}</Link></li>)}</ul>
          </div>
          <div className="text-sm">
            <p className="eyebrow text-linen">Get in touch</p>
            {site.phone && <p className="mt-3"><a href={`tel:${site.phoneE164}`} className="hover:text-linen">{site.phone}</a></p>}
            <p className="mt-3"><a href={`mailto:${site.email}`} className="hover:text-linen">{site.email}</a></p>
            {site.hours && <p className="mt-2 text-sage">{site.hours.label}</p>}
            <p className="mt-2 text-sage">Serving Greater Boston</p>
            <Link href="/free-assessment" className="btn btn-linen mt-4">Get Free Assessment</Link>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap gap-x-5 gap-y-2 border-t border-hunter-light pt-6 text-xs text-sage">
          <span>© {new Date().getFullYear()} DeckCraft Boston. All rights reserved.</span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/terms#sms">SMS Terms</Link>
          <Link href="/terms#accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
