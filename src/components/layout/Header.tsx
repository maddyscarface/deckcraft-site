"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Phone, Camera } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { NAV } from "./nav";
import { site, phoneHref } from "@/config/site";
import { track } from "@/lib/tracking";

export function Header() {
  const [open, setOpen] = useState(false);
  const tel = phoneHref();
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-hunter text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-[72px]">
          <Wordmark />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) =>
              "items" in n ? (
                <div key={n.label} className="group relative">
                  <button className="flex items-center gap-1 rounded px-3 py-2 text-[14px] font-medium hover:text-linen" aria-haspopup="true">
                    {n.label} <ChevronDown size={14} />
                  </button>
                  <div className="invisible absolute left-0 top-full min-w-64 rounded-md border border-hunter-light bg-hunter-mid p-2 opacity-0 shadow-premium transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {n.items.map((i) => (
                      <Link key={i.href} href={i.href} className="block rounded px-3 py-2 text-[14px] hover:bg-hunter-light hover:text-linen">{i.label}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} className="rounded px-3 py-2 text-[14px] font-medium hover:text-linen">{n.label}</Link>
              ),
            )}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            {tel && site.phone && (
              <a href={tel} onClick={() => track.phoneClick("header")} className="text-[14px] font-medium hover:text-linen">{site.phone}</a>
            )}
            <Link href="/free-assessment" className="btn btn-linen !min-h-[42px] !text-[14px]">Get Free Assessment</Link>
          </div>
          <button className="text-linen lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={26} /></button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-hunter px-6 pb-28 pt-5 text-white lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-linen"><X size={28} /></button>
          </div>
          {tel && site.phone && (
            <a href={tel} onClick={() => track.phoneClick("mobile_menu")} className="mt-6 block text-2xl font-semibold text-linen">{site.phone}</a>
          )}
          <nav className="mt-6 space-y-6" aria-label="Mobile">
            {NAV.map((n) =>
              "items" in n ? (
                <div key={n.label}>
                  <p className="eyebrow text-patina">{n.label}</p>
                  <div className="mt-2 space-y-1">
                    {n.items.map((i) => (
                      <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="block py-1.5 text-lg">{i.label}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-lg">{n.label}</Link>
              ),
            )}
          </nav>
          <Link href="/free-assessment" onClick={() => setOpen(false)} className="btn btn-linen mt-8 w-full">Get Free Assessment</Link>
        </div>
      )}

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-hunter-light bg-hunter lg:hidden">
        {tel ? (
          <a href={tel} onClick={() => track.phoneClick("mobile_bar")} className="flex h-14 items-center justify-center gap-2 font-semibold text-white"><Phone size={18} /> Call Now</a>
        ) : (
          <Link href="/request-walkthrough" className="flex h-14 items-center justify-center gap-2 text-[14px] font-semibold text-white">Multiple Properties?</Link>
        )}
        <Link href="/free-assessment" className="flex h-14 items-center justify-center gap-2 bg-linen font-semibold text-hunter"><Camera size={18} /> Send Photos</Link>
      </div>
    </>
  );
}
