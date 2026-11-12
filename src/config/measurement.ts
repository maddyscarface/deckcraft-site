/**
 * Phase 2 spec §4 measurement events. Browser events go to the dataLayer (GTM/GA4) and server events go to GA4
 * Measurement Protocol, Meta CAPI and OpenAI Ads, de-duplicated by event_id.
 *   assessment_view     browser: assessment / estimate form viewed
 *   photos_uploaded     browser: photos attached to a submitted form (NOT a conversion, never a sale)
 *   qualified_lead      browser (hot/warm tier at submit) + server (CRM "Qualified" stage)
 *   appointment_booked  server: CRM "Inspection booked" / "Walkthrough"
 *   estimate_sent       server: CRM "Estimate sent" / "Bid/RFP"
 *   won_job             server: CRM won (with contract value)
 *   revenue             server: CRM paid (with collected value; Google Ads offline import uses this)
 * `generate_lead` is still fired on every successful form so existing GA4/Ads conversions keep working.
 */
export const MEASUREMENT_EVENTS = {
  assessment_view: { meta: "ViewContent" },
  photos_uploaded: { meta: "PhotosUploaded" },
  qualified_lead: { meta: "QualifiedLead" },
  appointment_booked: { meta: "Schedule" },
  estimate_sent: { meta: "EstimateSent" },
  won_job: { meta: "WonJob" },
  revenue: { meta: "Purchase" },
} as const;
export type MeasurementEvent = keyof typeof MEASUREMENT_EVENTS;

const CRM_TO_EVENT: Record<string, { event: MeasurementEvent; withValue?: boolean }> = {
  qualified: { event: "qualified_lead" },
  inspection_booked: { event: "appointment_booked" }, estimate_booked: { event: "appointment_booked" },
  walkthrough: { event: "appointment_booked" }, walkthrough_booked: { event: "appointment_booked" },
  estimate_sent: { event: "estimate_sent" }, bid_rfp: { event: "estimate_sent" },
  won: { event: "won_job", withValue: true },
  paid: { event: "revenue", withValue: true },
};

export const measurementFor = (crmEvent: string) => CRM_TO_EVENT[crmEvent] ?? null;
