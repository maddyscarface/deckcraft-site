const DEFAULT = process.env.NEXT_PUBLIC_CONSENT_DEFAULT === "denied" ? "denied" : "granted";
const KEY = "dc_consent_v1";
/** Runs inline in <head> before GTM/Pixel so Consent Mode v2 defaults are set first. */
export const consentInitScript = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('${KEY}')}catch(e){}
var gpc=navigator.globalPrivacyControl===true;
var ads=(c||'${DEFAULT}')==='granted'&&!gpc?'granted':'denied';
var an=(c||'${DEFAULT}')==='granted'?'granted':'denied';
gtag('consent','default',{ad_storage:ads,ad_user_data:ads,ad_personalization:ads,analytics_storage:an,wait_for_update:500});
gtag('set','ads_data_redaction',ads==='denied');gtag('set','url_passthrough',true);
window.__dcAdsConsent=ads;`;
