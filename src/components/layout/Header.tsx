"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Phone, Camera, ArrowRight } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { NAV } from "./nav";
import { site, phoneHref } from "@/config/site";
import { track } from "@/lib/tracking";

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const tel = phoneHref(); // null until a real number is configured → no phone UI anywhere
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  useEffect(() => { setOpen(false); }, [path]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-char/95 text-white backdrop-blur supports-[backdrop-filter]:bg-char/85">
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-5 lg:h-[76px] lg:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV.map((n) =>
              "items" in n ? (
                <div key={n.label} className="group relative">
                  <button className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-white/85 transition hover:text-white" aria-haspopup="true">
                    {n.label} <ChevronDown size={14} className="opacity-60 transition group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full min-w-72 translate-y-1 border border-char-3 bg-char-2 p-2 opacity-0 shadow-premium transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {n.items.map((i) => (
                      <Link key={i.href} href={i.href} className="flex items-center justify-between px-3 py-2.5 text-[14px] text-white/85 hover:bg-char-3 hover:text-white">
                        {i.label} <ArrowRight size={13} className="opacity-40" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} className={`px-3 py-2 text-[14px] font-medium transition hover:text-white ${path === n.href ? "text-white" : "text-white/85"}`}>{n.label}</Link>
              ),
            )}
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            {tel && site.phone && (
              <a href={tel} onClick={() => track.phoneClick("header")} className="text-[14px] font-medium text-white/85 hover:text-white">{site.phone}</a>
            )}
            <Link href="/free-assessment" className="btn btn-cedar !min-h-[44px] !px-5 !text-[14px]">Free Photo Assessment</Link>
          </div>
          <button className="grid h-11 w-11 min-h-11 min-w-11 place-items-center text-white lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={26} /></button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-char px-6 pb-28 pt-5 text-white lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center text-white"><X size={28} /></button>
          </div>
          {tel && site.phone && (
            <a href={tel} onClick={() => track.phoneClick("mobile_menu")} className="mt-8 block text-2xl font-semibold text-cedar-light">{site.phone}</a>
          )}
          <nav className="mt-8 space-y-7" aria-label="Mobile">
            {NAV.map((n) =>
              "items" in n ? (
                <div key={n.label}>
                  <p className="eyebrow text-cedar-light">{n.label}</p>
                  <div className="mt-2 divide-y divide-white/10 border-y border-white/10">
                    {n.items.map((i) => (
                      <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-3 text-[17px]">{i.label}<ArrowRight size={15} className="opacity-40" /></Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-[17px] font-medium">{n.label}</Link>
              ),
            )}
          </nav>
          <Link href="/free-assessment" onClick={() => setOpen(false)} className="btn btn-cedar mt-10 w-full">Free Photo Assessment</Link>
          <p className="mt-4 text-center text-sm text-fog"><a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
      )}

      {/* Sticky mobile action bar. Without a configured number it never shows a call button. */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-char lg:hidden">
        {tel ? (
          <a href={tel} onClick={() => track.phoneClick("mobile_bar")} className="flex h-14 items-center justify-center gap-2 font-semibold text-white"><Phone size={18} /> Call</a>
        ) : (
          <Link href="/request-walkthrough" className="flex h-14 items-center justify-center gap-2 text-[14px] font-semibold text-white">Multiple properties?</Link>
        )}
        <Link href="/free-assessment" className="flex h-14 items-center justify-center gap-2 bg-cedar font-semibold text-white"><Camera size={18} /> Send photos</Link>
      </div>
    </>
  );
}
