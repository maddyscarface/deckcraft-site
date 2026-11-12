"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChoiceGrid, Field, FileDrop, Honeypot, Progress, SmsConsent } from "./kit";
import { CONTACT_PREF_LABELS, CONTACT_PREFS, URGENCY, URGENCY_LABELS, type CustomerType, type ServiceKey } from "@/lib/lead-schema";
import { TOWN_NAMES } from "@/lib/towns";
import { newEventId, submitLead, uploadFiles } from "@/lib/submit";
import { track } from "@/lib/tracking";

const ROLES = ["Board member", "Property manager", "Owner", "Facilities manager", "Other"];
const TYPES: { value: Exclude<CustomerType, "homeowner">; label: string }[] = [
  { value: "hoa_condo", label: "HOA or condo association" }, { value: "landlord_pm", label: "Landlord or property manager" }, { value: "commercial", label: "Commercial property" },
];
const NEEDS: { value: ServiceKey; label: string }[] = [
  { value: "inspection", label: "Annual inspection" }, { value: "deck_repair", label: "Repairs" }, { value: "staining", label: "Staining and sealing" },
  { value: "railings_stairs", label: "Railings and stairs" }, { value: "fence_repair", label: "Fencing repair" }, { value: "new_fence", label: "New fencing" },
  { value: "capital_project", label: "Capital project" }, { value: "turnover", label: "Turnover work" },
];
const TIMELINES = [{ value: "asap", label: "ASAP" }, { value: "this_season", label: "This season" }, { value: "next_season", label: "Next season" }, { value: "budget_planning", label: "Budget planning" }];
const BUDGET = ["Board vote required", "Owner approval", "Management company approves", "Pre-approved budget", "Not sure yet"];
const PROCUREMENT = ["Certificate of insurance (COI)", "W-9 / vendor setup", "Formal bid or RFP", "Multiple quotes required", "Board or owner vote", "None that I know of"];
const FREQ = ["One-time project", "Annual", "Twice a year", "As needed"];
const LABELS = ["Contact", "Properties", "Scope", "Files", "Walkthrough"];
const CAL = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL;

function WalkthroughFormInner({ presetType, presetService }: { presetType?: Exclude<CustomerType, "homeowner">; presetService?: ServiceKey }) {
  const router = useRouter();
  const qs = useSearchParams();
  const eventId = useRef(newEventId("wt"));
  const started = useRef(Date.now());
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [hp, setHp] = useState("");
  const [v, setV] = useState({
    first_name: "", last_name: "", company_name: "", role: "", email: "", phone: "", sms_consent: false,
    customer_type: (presetType ?? "") as CustomerType | "", property_count: "", unit_count: "", structure_count: "", fence_linear_ft: "",
    towns: [] as string[], townInput: "", services: (presetService ? [presetService] : []) as ServiceKey[], timeline: "", board_meeting_date: "",
    budget_process: "", maintenance_frequency: "", message: "", preferred_window: "",
    urgency: "", procurement: [] as string[], preferred_contact: "", walkthrough_requested: true,
  });

  useEffect(() => {
    const p = qs.get("properties"); const t = qs.get("type"); const s = qs.get("service");
    const typeMap: Record<string, CustomerType> = { condo: "hoa_condo", hoa: "hoa_condo", hoa_condo: "hoa_condo", multifamily: "landlord_pm", "triple-deckers": "landlord_pm", landlord_pm: "landlord_pm", mixed: "landlord_pm", commercial: "commercial" };
    setV((x) => ({
      ...x,
      property_count: p && /^\d+$/.test(p) ? p : x.property_count,
      customer_type: t && typeMap[t] ? typeMap[t] : x.customer_type,
      services: s === "fencing" ? Array.from(new Set([...x.services, "fence_repair" as ServiceKey])) : s === "inspection" ? Array.from(new Set([...x.services, "inspection" as ServiceKey])) : x.services,
    }));
  }, [qs]);

  const set = (k: keyof typeof v) => (val: any) => {
    if (!touched) { setTouched(true); track.formStart("walkthrough"); }
    setV((s) => ({ ...s, [k]: val }));
  };

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!v.first_name.trim()) e.first_name = "Required";
      if (!v.last_name.trim()) e.last_name = "Required";
      if (!v.company_name.trim()) e.company_name = "Required";
      if (!v.role) e.role = "Required";
      if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
      if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
    }
    if (s === 1) {
      if (!v.customer_type) e.customer_type = "Required";
      if (!Number(v.property_count)) e.property_count = "Required";
      if (!v.towns.length && !v.townInput.trim()) e.towns = "Add at least one town";
    }
    if (s === 2 && !v.services.length) e.services = "Choose at least one";
    setErrors(e);
    return !Object.keys(e).length;
  }

  function addTown() {
    const t = v.townInput.trim();
    if (t && !v.towns.includes(t)) setV((x) => ({ ...x, towns: [...x.towns, t], townInput: "" }));
  }

  async function onSubmit() {
    setBusy(true); setServerErr("");
    try {
      const file_urls = files.length ? await uploadFiles(files, "property") : [];
      const towns = v.townInput.trim() ? [...v.towns, v.townInput.trim()] : v.towns;
      const num = (s: string) => (s ? Number(s) : undefined);
      const r = await submitLead({
        form_type: "walkthrough",
        first_name: v.first_name, last_name: v.last_name, company_name: v.company_name, role: v.role, email: v.email, phone: v.phone, sms_consent: v.sms_consent,
        customer_type: v.customer_type, property_count: num(v.property_count), unit_count: num(v.unit_count), structure_count: num(v.structure_count), fence_linear_ft: num(v.fence_linear_ft),
        towns, town: towns[0], services: v.services, timeline: v.timeline || undefined, board_meeting_date: v.board_meeting_date || undefined,
        budget_process: v.budget_process || undefined, maintenance_frequency: v.maintenance_frequency || undefined,
        message: [v.message, v.preferred_window && `Preferred walkthrough window: ${v.preferred_window}`].filter(Boolean).join("\n\n") || undefined,
        urgency: v.urgency || undefined, procurement: v.procurement.length ? v.procurement : undefined,
        preferred_contact: v.preferred_contact || undefined, walkthrough_requested: v.walkthrough_requested,
        file_urls, website: hp,
      }, eventId.current, started.current);
      if (!r.ok) { setBusy(false); setServerErr(r.error ?? "Something went wrong"); if (r.fields) setErrors(r.fields); return; }
      router.push("/thank-you?type=walkthrough");
    } catch (e) {
      setBusy(false); setServerErr(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <form className="relative rounded-[2px] border border-line bg-white p-6 shadow-premium md:p-10" noValidate data-testid="walkthrough-form"
      onSubmit={(e) => { e.preventDefault(); if (step === 4) onSubmit(); else if (validate(step)) setStep(step + 1); }}>
      <Honeypot value={hp} onChange={setHp} />
      <Progress step={step} total={5} labels={LABELS} />
      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="w_first" label="First name *" error={errors.first_name}><input id="w_first" className="field" autoComplete="given-name" value={v.first_name} onChange={(e) => set("first_name")(e.target.value)} /></Field>
          <Field id="w_last" label="Last name *" error={errors.last_name}><input id="w_last" className="field" autoComplete="family-name" value={v.last_name} onChange={(e) => set("last_name")(e.target.value)} /></Field>
          <Field id="w_company" label="Company or association name *" error={errors.company_name}><input id="w_company" className="field" autoComplete="organization" value={v.company_name} onChange={(e) => set("company_name")(e.target.value)} /></Field>
          <Field id="w_role" label="Role *" error={errors.role}><select id="w_role" className="field" value={v.role} onChange={(e) => set("role")(e.target.value)}><option value="">Select</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></Field>
          <Field id="w_email" label="Email *" error={errors.email}><input id="w_email" type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set("email")(e.target.value)} /></Field>
          <Field id="w_phone" label="Phone *" error={errors.phone}><input id="w_phone" type="tel" className="field" autoComplete="tel" value={v.phone} onChange={(e) => set("phone")(e.target.value)} /></Field>
          <div className="sm:col-span-2"><SmsConsent checked={v.sms_consent} onChange={set("sms_consent")} /></div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-5">
          <div><p className="label">Customer type *</p><ChoiceGrid name="Customer type" cols={3} value={v.customer_type as any} onChange={set("customer_type")} options={TYPES} />{errors.customer_type && <p className="err">{errors.customer_type}</p>}</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="w_props" label="Number of properties *" error={errors.property_count}><input id="w_props" type="number" min={1} className="field" value={v.property_count} onChange={(e) => set("property_count")(e.target.value)} /></Field>
            <Field id="w_units" label="Number of units (approx.)"><input id="w_units" type="number" min={0} className="field" value={v.unit_count} onChange={(e) => set("unit_count")(e.target.value)} /></Field>
            <Field id="w_struct" label="Sites or structures (decks, balconies, porches)"><input id="w_struct" type="number" min={0} className="field" value={v.structure_count} onChange={(e) => set("structure_count")(e.target.value)} /></Field>
            <Field id="w_fence" label="Linear feet of fencing (optional)"><input id="w_fence" type="number" min={0} className="field" value={v.fence_linear_ft} onChange={(e) => set("fence_linear_ft")(e.target.value)} /></Field>
          </div>
          <Field id="w_towns" label="Towns *" error={errors.towns} hint="Add each town your properties are in">
            <div className="flex gap-2">
              <input id="w_towns" list="wtowns" className="field" value={v.townInput} onChange={(e) => set("townInput")(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTown(); } }} />
              <button type="button" className="btn border border-navy" onClick={addTown}>Add</button>
            </div>
            <datalist id="wtowns">{TOWN_NAMES.map((t) => <option key={t} value={t} />)}</datalist>
            {v.towns.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{v.towns.map((t) => <button type="button" key={t} onClick={() => setV((x) => ({ ...x, towns: x.towns.filter((y) => y !== t) }))} className="rounded-full bg-navy px-3 py-1 text-xs text-white">{t} ×</button>)}</div>}
          </Field>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <div><p className="label">What do you need? *</p><ChoiceGrid name="Needs" multi value={v.services} onChange={set("services")} options={NEEDS} />{errors.services && <p className="err">{errors.services}</p>}</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="w_urg" label="Urgency or safety concern"><select id="w_urg" className="field" value={v.urgency} onChange={(e) => set("urgency")(e.target.value)}><option value="">Select</option>{URGENCY.map((u) => <option key={u} value={u}>{URGENCY_LABELS[u]}</option>)}</select></Field>
            <Field id="w_tl" label="Timeline"><select id="w_tl" className="field" value={v.timeline} onChange={(e) => set("timeline")(e.target.value)}><option value="">Select</option>{TIMELINES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></Field>
            <Field id="w_bmd" label="Next board or owner meeting (optional)"><input id="w_bmd" type="date" className="field" value={v.board_meeting_date} onChange={(e) => set("board_meeting_date")(e.target.value)} /></Field>
            <Field id="w_budget" label="How is work approved?"><select id="w_budget" className="field" value={v.budget_process} onChange={(e) => set("budget_process")(e.target.value)}><option value="">Select</option>{BUDGET.map((b) => <option key={b}>{b}</option>)}</select></Field>
            <Field id="w_freq" label="Maintenance frequency you want"><select id="w_freq" className="field" value={v.maintenance_frequency} onChange={(e) => set("maintenance_frequency")(e.target.value)}><option value="">Select</option>{FREQ.map((b) => <option key={b}>{b}</option>)}</select></Field>
          </div>
          <div><p className="label">Procurement or vendor requirements</p><ChoiceGrid name="Procurement" multi cols={2} value={v.procurement as any} onChange={set("procurement")} options={PROCUREMENT.map((p) => ({ value: p, label: p }))} /></div>
          <Field id="w_msg" label="Property addresses or notes (optional)"><textarea id="w_msg" rows={4} className="field" placeholder="List addresses, access notes, known problem areas…" value={v.message} onChange={(e) => set("message")(e.target.value)} /></Field>
        </div>
      )}
      {step === 3 && <FileDrop files={files} setFiles={setFiles} allowPdf formType="walkthrough" />}
      {step === 4 && (
        <div className="space-y-4">
          {CAL ? (
            <>
              <p className="text-sm">Pick a walkthrough time below, then submit. If no time works, leave a preferred window instead.</p>
              <iframe src={CAL} title="Book a walkthrough" className="h-[560px] w-full rounded-[2px] border border-line" />
            </>
          ) : null}
          <label className="flex items-start gap-3 text-[15px]"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#172637]" checked={v.walkthrough_requested} onChange={(e) => set("walkthrough_requested")(e.target.checked)} data-testid="w-walkthrough" /><span>I&apos;d like a site walkthrough. <span className="text-stone">We&apos;ll confirm a date with you before anyone comes out.</span></span></label>
          <Field id="w_window" label="Preferred walkthrough window" hint="e.g. weekday mornings in the next two weeks"><input id="w_window" className="field" value={v.preferred_window} onChange={(e) => set("preferred_window")(e.target.value)} /></Field>
          <Field id="w_pc" label="Preferred contact method"><select id="w_pc" className="field" value={v.preferred_contact} onChange={(e) => set("preferred_contact")(e.target.value)}><option value="">No preference</option>{CONTACT_PREFS.map((c) => <option key={c} value={c}>{CONTACT_PREF_LABELS[c]}</option>)}</select></Field>
        </div>
      )}
      {serverErr && <p className="err mt-4" role="alert">{serverErr}</p>}
      <div className="mt-6 flex gap-3">
        {step > 0 && <button type="button" className="btn border border-navy" onClick={() => setStep(step - 1)} disabled={busy}>Back</button>}
        <button type="submit" className="btn btn-char h-[52px] flex-1" disabled={busy}>{step === 4 ? (busy ? "Sending…" : "Request My Walkthrough") : step === 3 && !files.length ? "Skip files" : "Continue"}</button>
      </div>
    </form>
  );
}

export function WalkthroughForm(props: { presetType?: Exclude<CustomerType, "homeowner">; presetService?: ServiceKey }) {
  return <Suspense fallback={<div className="h-96 rounded-[2px] border border-line bg-white" />}><WalkthroughFormInner {...props} /></Suspense>;
}
