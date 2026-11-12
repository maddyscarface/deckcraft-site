import { z } from "zod";

export const CUSTOMER_TYPES = ["homeowner", "hoa_condo", "landlord_pm", "commercial"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export const CUSTOMER_LABELS: Record<CustomerType, string> = {
  homeowner: "Homeowner",
  hoa_condo: "HOA or Condo Board",
  landlord_pm: "Landlord or Property Manager",
  commercial: "Commercial Property",
};

export const SERVICE_KEYS = [
  "deck_repair", "staining", "railings_stairs", "new_deck", "fence_repair", "new_fence",
  "fence_staining", "gate", "inspection", "capital_project", "turnover", "not_sure",
] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];
export const SERVICE_LABELS: Record<ServiceKey, string> = {
  deck_repair: "Deck repair",
  staining: "Staining or sealing",
  railings_stairs: "Railings or stairs",
  new_deck: "New deck",
  fence_repair: "Fence repair",
  new_fence: "New fence",
  fence_staining: "Fence staining",
  gate: "Gate",
  inspection: "Annual inspection",
  capital_project: "Capital project",
  turnover: "Turnover work",
  not_sure: "Not sure",
};

export const FORM_TYPES = ["assessment", "walkthrough", "short", "newsletter", "checker", "planner"] as const;
export type FormType = (typeof FORM_TYPES)[number];

export const TIMELINES = ["asap", "this_season", "next_season", "next_spring", "planning", "budget_planning"] as const;

const phoneRe = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const opt = (s: z.ZodString) => s.optional().or(z.literal("").transform(() => undefined));

export const attributionSchema = z.object({
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  gclid: z.string().max(300).optional(),
  gbraid: z.string().max(300).optional(),
  wbraid: z.string().max(300).optional(),
  fbclid: z.string().max(500).optional(),
  fbc: z.string().max(500).optional(),
  fbp: z.string().max(200).optional(),
  landing_page: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
  first_touch_at: z.string().max(40).optional(),
  openai_obref: z.string().max(300).optional(),
  openai_oppref: z.string().max(300).optional(),
  msclkid: z.string().max(300).optional(),
  ttclid: z.string().max(300).optional(),
  ft_source: z.string().max(200).optional(), // first-touch UTM source / medium / campaign
  ft_medium: z.string().max(200).optional(),
  ft_campaign: z.string().max(200).optional(),
  ga_client_id: z.string().max(100).optional(),
}).partial();

export const WORK_TYPES = ["repair", "replace", "new", "not_sure"] as const;
export const MATERIAL_PREFS = ["wood", "composite", "unsure"] as const;
export const URGENCY = ["safety_now", "this_season", "planned", "budgeting"] as const;
export const CONTACT_PREFS = ["phone", "email", "text"] as const;
export const WORK_TYPE_LABELS: Record<(typeof WORK_TYPES)[number], string> = { repair: "Repair", replace: "Replace", new: "New build", not_sure: "Not sure" };
export const MATERIAL_PREF_LABELS: Record<(typeof MATERIAL_PREFS)[number], string> = { wood: "Wood", composite: "Composite", unsure: "Unsure" };
export const URGENCY_LABELS: Record<(typeof URGENCY)[number], string> = { safety_now: "Safety issue now", this_season: "This season", planned: "Planned / capital project", budgeting: "Budgeting for next year" };
export const CONTACT_PREF_LABELS: Record<(typeof CONTACT_PREFS)[number], string> = { phone: "Phone call", email: "Email", text: "Text" };

export const leadSchema = z
  .object({
    form_type: z.enum(FORM_TYPES),
    event_id: z.string().min(8).max(80),
    first_name: z.string().trim().max(80).optional(),
    last_name: opt(z.string().trim().max(80)),
    email: z.string().trim().toLowerCase().email().max(200),
    phone: opt(z.string().trim().regex(phoneRe, "Enter a valid US phone number")),
    sms_consent: z.boolean().default(false),
    customer_type: z.enum(CUSTOMER_TYPES).optional(),
    company_name: opt(z.string().trim().max(160)),
    role: opt(z.string().trim().max(80)),
    town: opt(z.string().trim().max(80)),
    towns: z.array(z.string().max(80)).max(40).optional(),
    services: z.array(z.enum(SERVICE_KEYS)).max(12).optional(),
    material: opt(z.string().max(60)),
    size_estimate: opt(z.string().max(60)),
    property_count: z.coerce.number().int().min(0).max(5000).optional(),
    unit_count: z.coerce.number().int().min(0).max(50000).optional(),
    structure_count: z.coerce.number().int().min(0).max(5000).optional(),
    fence_linear_ft: z.coerce.number().int().min(0).max(100000).optional(),
    timeline: z.enum(TIMELINES).optional(),
    board_meeting_date: opt(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    budget_process: opt(z.string().max(120)),
    maintenance_frequency: opt(z.string().max(60)),
    message: opt(z.string().trim().max(3000)),
    // Phase 2 homeowner project fields (all optional for schema compatibility)
    zip: opt(z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP")),
    work_type: z.enum(WORK_TYPES).optional(),
    current_structure: opt(z.string().max(80)),
    material_preference: z.enum(MATERIAL_PREFS).optional(),
    access: opt(z.string().max(80)),
    hoa_permit: opt(z.string().max(80)),
    availability: opt(z.string().trim().max(200)),
    // Phase 2 property / HOA / commercial fields
    urgency: z.enum(URGENCY).optional(),
    procurement: z.array(z.string().max(60)).max(10).optional(),
    preferred_contact: z.enum(CONTACT_PREFS).optional(),
    walkthrough_requested: z.boolean().optional(),
    photo_urls: z.array(z.string().max(600)).max(10).optional(),
    file_urls: z.array(z.string().max(600)).max(10).optional(),
    checker_result: opt(z.string().max(60)),
    checker_answers: z.record(z.string(), z.string().max(60)).optional(),
    source_page: z.string().max(300).optional(),
    attribution: attributionSchema.optional(),
    /** Pre-estimate answers (budget, size, start, visit time…). Sanitised against src/config/estimate.ts on the server. */
    qualifiers: z.record(z.string(), z.unknown()).optional(),
    consent_marketing: z.boolean().optional(),
    /** Advertising consent at submit time (false when declined or GPC). Gates OpenAI Ads server events. */
    ads_consent: z.boolean().optional(),
    // anti-spam
    website: z.string().max(0).optional(), // honeypot must be empty
    elapsed_ms: z.number().int().min(0).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.form_type !== "newsletter") {
      if (!v.first_name) ctx.addIssue({ code: "custom", path: ["first_name"], message: "First name is required" });
      if (!v.phone) ctx.addIssue({ code: "custom", path: ["phone"], message: "Phone is required" });
    }
    if (v.form_type === "walkthrough") {
      if (!v.company_name) ctx.addIssue({ code: "custom", path: ["company_name"], message: "Company or association name is required" });
      if (!v.customer_type || v.customer_type === "homeowner")
        ctx.addIssue({ code: "custom", path: ["customer_type"], message: "Choose a property customer type" });
      if (!v.property_count || v.property_count < 1)
        ctx.addIssue({ code: "custom", path: ["property_count"], message: "Number of properties is required" });
    }
    if (v.sms_consent && !v.phone) ctx.addIssue({ code: "custom", path: ["phone"], message: "Phone needed for texts" });
  });

export type LeadInput = z.infer<typeof leadSchema>;
