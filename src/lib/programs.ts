import { site } from "@/config/site";

export const PROGRAMS = [
  { name: "Annual Deck and Fence Safety Inspection", gets: "Each deck, balcony, porch, stair, railing and fence run in the agreed scope inspected; written condition report with photos, priority ratings (safety now / repair this year / monitor) and repair pricing.", bestFor: "Condo boards, HOAs and landlords who want documentation for insurers and residents" },
  { name: "Preferred Vendor Agreement", gets: "Set rates, priority scheduling, one project lead, consolidated monthly invoicing, COI on file.", bestFor: "Property managers with ongoing repairs" },
  { name: "Capital Repair Program", gets: "Multi-property or multi-building project scoped from the inspection, with a phased schedule aligned to the budget or reserve plan.", bestFor: "Associations planning large projects; landlords doing portfolio upgrades" },
  { name: "Turnover and Make-Ready (Exterior)", gets: "Deck, porch and fence repairs and staining between tenants, on a committed timeline.", bestFor: "Landlords and rental property managers" },
];

export const SERVICE_PROMISE = [
  "Written scope and property list before any work starts",
  "One written schedule covering every property in the job",
  "One project lead from walkthrough to final report",
  "Photo report at start and completion for each property",
  "Work scheduled around residents, tenants and business hours",
  site.coiHours ? `Certificate of insurance within ${site.coiHours} hours of request; W-9 and vendor setup handled` : site.credentials.licensedAndInsuredVerified ? "Certificate of insurance on request; W-9 and vendor setup handled" : "W-9 and vendor setup handled",
];
