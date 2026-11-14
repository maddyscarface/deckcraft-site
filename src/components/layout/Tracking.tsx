"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, dl } from "@/lib/tracking";
import { OPENAI_PIXEL_ID, oaiqConsent, oaiqSnippet } from "@/lib/openai-ads/client";

const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
/** Direct Google tag (gtag.js) is used ONLY when there is no GTM container, to avoid double counting. */
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const GADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID; // AW-XXXXXXXXX
const GTAG_ID = !GTM ? GA4 || GADS : undefined;
/** Intent-data pixel (DataMoon / AudienceLab). Off unless explicitly enabled AND ads consent is granted. */
const INTENT_SRC = process.env.NEXT_PUBLIC_INTENT_ENABLED === "true" ? process.env.NEXT_PUBLIC_INTENT_PIXEL_SRC : undefined;
/** "granted" (US default, opt-out model) or "denied" (opt-in). Global Privacy Control always denies ad storage. */
const DEFAULT = process.env.NEXT_PUBLIC_CONSENT_DEFAULT === "denied" ? "denied" : "granted";
const KEY = "dc_consent_v1";

function choice(): "granted" | "denied" | null {
  try { return (localStorage.getItem(KEY) as "granted" | "denied" | null) ?? null; } catch { return null; }
}

/** Private customer links and staff pages never load ad/analytics tags (token URLs must not reach third parties). */
export const isPrivatePath = (p: string | null) => Boolean(p && (p.startsWith("/w/") || p.startsWith("/admin")));

export function Tracking() {
  const path = usePathname();
  const priv = isPrivatePath(path);
  useEffect(() => { if (!priv) captureAttribution(); }, [path, priv]);
  useEffect(() => { if (!priv) dl("virtual_page_view", { page_path: path }); }, [path, priv]);
  if (priv) return null;

  return (
    <>
      {GTM && (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}</Script>
      )}
      {GTAG_ID && (
        <>
          <Script id="gtag-src" src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">{`window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());${GA4 ? `gtag('config','${GA4}',{send_page_view:true});` : ""}${GADS ? `gtag('config','${GADS}',{allow_enhanced_conversions:true});` : ""}`}</Script>
        </>
      )}
      {INTENT_SRC && <IntentPixel src={INTENT_SRC} />}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
if(window.__dcAdsConsent!=='granted'){fbq('consent','revoke')}
fbq('init','${PIXEL}');fbq('track','PageView');`}</Script>
      )}
      {OPENAI_PIXEL_ID && (
        // OpenAI Ads (ChatGPT) pixel. Consent is applied before init; GPC or "Decline" keeps it off.
        <Script id="openai-pixel" strategy="afterInteractive">{oaiqSnippet(OPENAI_PIXEL_ID, "window.__dcAdsConsent==='granted'")}</Script>
      )}
      <PrivacyChoices />
    </>
  );
}

/** Loads the intent-data pixel only after ads consent is granted (and never with Global Privacy Control). */
function IntentPixel({ src }: { src: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk((window as unknown as { __dcAdsConsent?: string }).__dcAdsConsent === "granted");
    check();
    window.addEventListener("dc:consent", check);
    return () => window.removeEventListener("dc:consent", check);
  }, []);
  return ok ? <Script id="intent-pixel" src={src} strategy="lazyOnload" /> : null;
}

/** Small persistent control; opt-in banner when default is denied. */
function PrivacyChoices() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (DEFAULT === "denied" && !choice()) setShow(true); }, []);
  function set(v: "granted" | "denied") {
    try { localStorage.setItem(KEY, v); } catch {}
    window.gtag?.("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    if (window.fbq) window.fbq("consent", v === "granted" ? "grant" : "revoke");
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
    oaiqConsent(v === "granted" && !gpc);
    (window as unknown as { __dcAdsConsent?: string }).__dcAdsConsent = v === "granted" && !gpc ? "granted" : "denied";
    window.dispatchEvent(new Event("dc:consent"));
    setShow(false);
  }
  useEffect(() => {
    const h = () => setShow(true);
    window.addEventListener("dc:privacy-choices", h);
    return () => window.removeEventListener("dc:privacy-choices", h);
  }, []);
  if (!show) return null;
  return (
    <div role="dialog" aria-label="Privacy choices" className="fixed bottom-16 left-4 right-4 z-50 rounded-[2px] border border-char-3 bg-char p-5 text-sm text-white shadow-premium md:bottom-4 md:left-auto md:w-96">
      <p>We use cookies for analytics and to measure our ads. You can change this anytime.</p>
      <div className="mt-3 flex gap-2">
        <button className="btn btn-cedar !min-h-11 !px-3 !text-sm" onClick={() => set("granted")}>Allow</button>
        <button className="btn btn-ghost !min-h-11 !px-3 !text-sm" onClick={() => set("denied")}>Decline</button>
      </div>
    </div>
  );
}
