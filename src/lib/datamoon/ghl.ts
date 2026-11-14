import type { LeadForGhl } from "../crm/ghl-map";
import type { ImportedContact } from "./importer";
import type { Recipe } from "./recipes";

/**
 * Maps an imported DataMoon prospect to a GoHighLevel contact upsert for the DeckCraft sub-account.
 * Returns null (no sync) when: CRM sync flag off, recipe lacks CRM approval or a CRM destination, contact suppressed /
 * opted out, or no email. Prospects get NO opportunity (pipeline "none"), are tagged no-SMS, and carry no phone.
 */
export function vendorContactToGhl(c: ImportedContact, r: Recipe, opts: { crmSyncEnabled: boolean; optedOut: boolean }): LeadForGhl | null {
  if (!opts.crmSyncEnabled) return null;
  if (!r.approvals.crm_sync || !r.approved_destinations.includes("ghl_email_nurture")) return null;
  if (opts.optedOut || c.status === "suppressed" || !c.email) return null;
  return {
    lead_id: `dm_${c.contact_id}`, email: c.email, first_name: c.first_name ?? undefined, last_name: c.last_name ?? undefined, company_name: c.company_name ?? undefined, town: c.city ?? undefined,
    pipeline: "none", score: 0, tier: "prospect", opportunity_name: "",
    tags: ["source:datamoon", `datamoon-recipe:${r.id}`, "intent:no-sms", "consent:none-recorded", "prospect:not-a-lead"],
    fields: {},
  };
}
