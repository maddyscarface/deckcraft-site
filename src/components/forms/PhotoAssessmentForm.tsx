"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChoiceGrid, Field, FileDrop, Honeypot, PrivacyNote, Progress, SmsConsent } from "./kit";
import { CUSTOMER_LABELS, type CustomerType, type ServiceKey } from "@/lib/lead-schema";
import { TOWN_NAMES } from "@/lib/towns";
import { newEventId, submitLead, uploadFiles } from "@/lib/submit";
import { track } from "@/lib/tracking";
import { EstimateQualifiers, validateQualifiers, withPricingSeen } from "@/components/estimate/EstimateQualifiers";
import { START_TO_TIMELINE, estimateConfig, qualifierTheme } from "@/config/estimate";
import type { Qualifiers } from "@/lib/estimate/qualifiers";

const SERVICES: { value: ServiceKey; label: string }[] = [
  { value: "deck_repair", label: "Deck repair" }, { value: "staining", label: "Staining or sealing" },
  { value: "railings_stairs", label: "Railings or stairs" }, { value: "new_deck", label: "New deck" },
  { value: "fence_repair", label: "Fence repair" }, { value: "new_fence", label: "New fence" },
  { value: "fence_staining", label: "Fence staining" }, { value: "gate", label: "Gate" }, { value: "not_sure", label: "Not sure" },
];
const MATERIALS = ["Pressure-treated wood", "Cedar", "Composite", "Vinyl", "Aluminum or metal", "Not sure"];
const LABELS = ["About you", "Your project", "Budget & visit", "Photos", "Anything else?"];
const LAST = LABELS.length - 1;
/** Condensed forms keep budget/size/start but skip visit time, styles and address (asked on the call). */
const CONDENSED_HIDE = ["visit", "favorites", "address"] as const;

/** Pre-select the estimate project type from the services they ticked. */
function projectFromServices(services: ServiceKey[], material: string): string | undefined {
  if (services.includes("new_deck")) return /composite/i.test(material) ? "new_deck_composite" : material ? "new_deck_wood" : undefined;
  if (services.includes("deck_repair") || services.includes("railings_stairs")) return "deck_repair";
  if (services.includes("staining")) return "staining";
  if (services.some((s) => s.includes("fence") || s === "gate")) return "fence";
  return undefined;
}

type Props = { presetService?: ServiceKey; presetTown?: string; presetCustomerType?: CustomerType; condensed?: boolean; checker?: { result: string; answers: Record<string, string> } };

export function PhotoAssessmentForm({ presetService, presetTown, presetCustomerType, condensed = false, checker }: Props) {
  const router = useRouter();
  const eventId = useRef(newEventId());
  const started = useRef(Date.now());
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<"" | "uploading" | "sending">("");
  const [uploaded, setUploaded] = useState(0);
  const [serverErr, setServerErr] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [hp, setHp] = useState("");
  const [q, setQ] = useState<Qualifiers>({});
  const [qErrors, setQErrors] = useState<Partial<Record<keyof Qualifiers, string>>>({});
  const [v, setV] = useState({
    first_name: "", last_name: "", email: "", phone: "", sms_consent: false,
    customer_type: (presetCustomerType ?? "homeowner") as CustomerType,
    town: presetTown ?? "", services: (presetService ? [presetService] : []) as ServiceKey[],
    material: "", size_estimate: "", timeline: "" as string, property_count: "", message: "",
  });
  const set = (k: keyof typeof v) => (val: any) => {
    if (!touched) { setTouched(true); track.formStart(condensed ? "short" : "assessment"); }
    setV((s) => ({ ...s, [k]: val }));
  };

  function validate(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0 || condensed) {
      if (!v.first_name.trim()) e.first_name = "First name is required";
      if (!condensed && !v.last_name.trim()) e.last_name = "Last name is required";
      if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
      if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
    }
    if (s === 1 || condensed) {
      if (!v.town.trim()) e.town = "Town is required";
      if (!v.services.length) e.services = "Choose at least one";
    }
    let qe: Partial<Record<keyof Qualifiers, string>> = {};
    if (s === 2 || condensed) qe = validateQualifiers(estimateConfig, q, condensed ? [...CONDENSED_HIDE] : []);
    setErrors(e);
    setQErrors(qe);
    return Object.keys(e).length === 0 && Object.keys(qe).length === 0;
  }

  async function onSubmit() {
    if (!condensed && (!validate(0) || !validate(1) || !validate(2))) {
      setStep(!validate(0) ? 0 : !validate(1) ? 1 : 2);
      return;
    }
    if (condensed && !validate(0)) return;
    setServerErr("");
    try {
      let photo_urls: string[] = [];
      if (files.length) { setBusy("uploading"); photo_urls = await uploadFiles(files, "assessment", setUploaded); }
      setBusy("sending");
      const r = await submitLead({
        form_type: condensed ? "short" : checker ? "checker" : "assessment",
        ...v,
        property_count: v.property_count ? Number(v.property_count) : undefined,
        timeline: (q.start ? START_TO_TIMELINE[q.start] : undefined) ?? (v.timeline || undefined),
        material: v.material || undefined,
        photo_urls,
        qualifiers: withPricingSeen(q),
        website: hp,
        checker_result: checker?.result,
        checker_answers: checker?.answers,
      }, eventId.current, started.current);
      if (!r.ok) {
        setBusy("");
        if (r.fields) { setErrors(r.fields); if (!condensed) setStep(r.fields.first_name || r.fields.email || r.fields.phone ? 0 : 1); }
        setServerErr(r.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push(`/thank-you?type=assessment${v.customer_type !== "homeowner" ? "&seg=property" : ""}`);
    } catch (e) {
      setBusy("");
      setServerErr(e instanceof Error ? e.message : "Upload failed. Please try again.");
    }
  }

  const isProperty = v.customer_type !== "homeowner";
  const contact = (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id="first_name" label="First name *" error={errors.first_name}><input id="first_name" className="field" autoComplete="given-name" value={v.first_name} onChange={(e) => set("first_name")(e.target.value)} /></Field>
      {!condensed && <Field id="last_name" label="Last name *" error={errors.last_name}><input id="last_name" className="field" autoComplete="family-name" value={v.last_name} onChange={(e) => set("last_name")(e.target.value)} /></Field>}
      <Field id="email" label="Email *" error={errors.email}><input id="email" type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set("email")(e.target.value)} /></Field>
      <Field id="phone" label="Phone *" error={errors.phone} hint="(617) 000-0000"><input id="phone" type="tel" className="field" autoComplete="tel" value={v.phone} onChange={(e) => set("phone")(e.target.value)} /></Field>
      <div className="sm:col-span-2"><SmsConsent checked={v.sms_consent} onChange={set("sms_consent")} /></div>
    </div>
  );
  const project = (
    <div className="space-y-5">
      <div>
        <p className="label">I am a *</p>
        <ChoiceGrid name="Customer type" value={v.customer_type} onChange={set("customer_type")} options={(Object.keys(CUSTOMER_LABELS) as CustomerType[]).map((k) => ({ value: k, label: CUSTOMER_LABELS[k] }))} />
      </div>
      {isProperty && (
        <div className="rounded-md bg-linen-pale p-4 text-sm">
          <Field id="property_count" label="How many properties?"><input id="property_count" type="number" min={1} className="field max-w-[160px]" value={v.property_count} onChange={(e) => set("property_count")(e.target.value)} /></Field>
          <p className="mt-2">Multiple properties? <Link href="/request-walkthrough" className="font-semibold underline">Request a walkthrough instead →</Link></p>
        </div>
      )}
      <Field id="town" label="Town *" error={errors.town}>
        <input id="town" list="towns" className="field" value={v.town} onChange={(e) => set("town")(e.target.value)} autoComplete="address-level2" />
        <datalist id="towns">{TOWN_NAMES.map((t) => <option key={t} value={t} />)}</datalist>
      </Field>
      <div>
        <p className="label">What needs attention? *</p>
        <ChoiceGrid name="Services" multi cols={3} value={v.services} onChange={set("services")} options={SERVICES} />
        {errors.services && <p className="err">{errors.services}</p>}
      </div>
      {!condensed && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="material" label="Material"><select id="material" className="field" value={v.material} onChange={(e) => set("material")(e.target.value)}><option value="">Select</option>{MATERIALS.map((m) => <option key={m}>{m}</option>)}</select></Field>
          <Field id="size_estimate" label="Approx. size" hint="Deck sq ft or fence linear ft"><input id="size_estimate" className="field" value={v.size_estimate} onChange={(e) => set("size_estimate")(e.target.value)} /></Field>
        </div>
      )}
    </div>
  );
  const qualifiers = (
    <div>
      <p className="mb-4 text-sm text-hunter/80">A few quick answers so your estimate comes with no surprises.</p>
      <EstimateQualifiers cfg={estimateConfig} value={q} onChange={(n) => { if (!touched) { setTouched(true); track.formStart("assessment"); } setQ(n); setQErrors({}); }}
        theme={qualifierTheme} errors={qErrors} hide={condensed ? [...CONDENSED_HIDE] : []} />
    </div>
  );
  const photos = <FileDrop files={files} setFiles={setFiles} formType="assessment" />;
  const extra = (
    <Field id="message" label="Anything we should know? (optional)">
      <textarea id="message" rows={4} className="field" placeholder="Soft spots, a deadline, HOA rules, pets…" value={v.message} onChange={(e) => set("message")(e.target.value)} />
    </Field>
  );

  const goTo = (n: number) => {
    if (n === 2 && !q.project_type) {
      const pt = projectFromServices(v.services, v.material);
      if (pt) setQ((cur) => ({ ...cur, project_type: pt }));
    }
    setStep(n);
  };
  const submitLabel = busy === "uploading" ? `Uploading photos ${uploaded}/${files.length}…` : busy === "sending" ? "Sending…" : "Send My Photos — Get Free Assessment";

  return (
    <form className="relative rounded-xl border border-hunter bg-white p-6 shadow-premium md:p-8" onSubmit={(e) => { e.preventDefault(); if (condensed || step === LAST) onSubmit(); else if (validate(step)) goTo(step + 1); }} noValidate data-testid="assessment-form">
      <Honeypot value={hp} onChange={setHp} />
      {condensed ? (
        <div className="space-y-5">{contact}{project}{qualifiers}{photos}</div>
      ) : (
        <>
          <Progress step={step} total={LABELS.length} labels={LABELS} />
          {step === 0 && contact}
          {step === 1 && project}
          {step === 2 && qualifiers}
          {step === 3 && photos}
          {step === 4 && extra}
        </>
      )}
      {serverErr && <p className="err mt-4" role="alert">{serverErr}</p>}
      <div className="mt-6 flex gap-3">
        {!condensed && step > 0 && <button type="button" className="btn border border-hunter" onClick={() => setStep(step - 1)} disabled={!!busy}>Back</button>}
        <button type="submit" disabled={!!busy} className="btn btn-hunter h-[52px] flex-1">
          {condensed || step === LAST ? submitLabel : step === 3 && !files.length ? "Skip photos for now" : "Continue"}
        </button>
      </div>
      {(condensed || step >= 3) && <PrivacyNote />}
    </form>
  );
}
