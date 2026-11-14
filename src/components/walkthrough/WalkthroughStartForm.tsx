"use client";
import { useRef, useState } from "react";
import { Field, Honeypot, PrivacyNote } from "@/components/forms/kit";
import { newEventId, submitLead } from "@/lib/submit";
import { TOWN_NAMES } from "@/lib/towns";

type Choice = { id: string; label: string; short: string };

export function WalkthroughStartForm({ services, presetService, sqft }: { services: Choice[]; presetService?: string; sqft?: number }) {
  const eventId = useRef(newEventId());
  const started = useRef(Date.now());
  const [v, setV] = useState({ service: presetService ?? "", first_name: "", last_name: "", email: "", phone: "", town: "", zip: "", customer_type: "homeowner" });
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const set = (k: keyof typeof v) => (x: string) => setV((p) => ({ ...p, [k]: x }));

  async function go() {
    const e: Record<string, string> = {};
    if (!v.service) e.service = "Choose what you'd like to show us";
    if (!v.first_name.trim()) e.first_name = "First name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email";
    if (!v.phone.trim()) e.phone = "Phone is required";
    if (!v.town.trim()) e.town = "Town is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true); setServerErr("");
    try {
      const j = await submitLead({ ...v, sqft, website: hp, zip: v.zip || undefined, last_name: v.last_name || undefined }, eventId.current, started.current, "/api/walkthrough/start");
      if (j.ok && j.url) { window.location.assign(j.url); return; }
      if (j.ok) { setServerErr("Thanks. We received your request."); return; }
      if (j.fields) setErrors(Object.fromEntries(Object.entries(j.fields).map(([k, m]) => [k.split(".")[0], m])));
      setServerErr(j.error ?? "Please check the form.");
    } catch { setServerErr("Network problem. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <form className="space-y-6 bg-white p-6 shadow-card md:p-8" onSubmit={(e) => { e.preventDefault(); go(); }} data-testid="walkthrough-start" noValidate>
      <Honeypot value={hp} onChange={setHp} />
      <div>
        <p className="label">What would you like to show us? *</p>
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Project type">
          {services.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={v.service === s.id} className="choice !items-start !text-left" data-testid={`svc-${s.id}`} onClick={() => set("service")(s.id)}>
              <span><b className="block">{s.label}</b><span className="text-xs font-normal opacity-75">{s.short}</span></span>
            </button>
          ))}
        </div>
        {errors.service && <p className="err" role="alert">{errors.service}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="first_name" label="First name *" error={errors.first_name}><input id="first_name" className="field" autoComplete="given-name" value={v.first_name} onChange={(e) => set("first_name")(e.target.value)} /></Field>
        <Field id="last_name" label="Last name" error={errors.last_name}><input id="last_name" className="field" autoComplete="family-name" value={v.last_name} onChange={(e) => set("last_name")(e.target.value)} /></Field>
        <Field id="email" label="Email *" error={errors.email}><input id="email" type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set("email")(e.target.value)} /></Field>
        <Field id="phone" label="Phone *" error={errors.phone} hint="So the estimator can reach you about the walkthrough"><input id="phone" type="tel" className="field" autoComplete="tel" value={v.phone} onChange={(e) => set("phone")(e.target.value)} /></Field>
        <Field id="town" label="Town *" error={errors.town}>
          <input id="town" list="wt-towns" className="field" autoComplete="address-level2" value={v.town} onChange={(e) => set("town")(e.target.value)} />
          <datalist id="wt-towns">{TOWN_NAMES.map((t) => <option key={t} value={t} />)}</datalist>
        </Field>
        <Field id="zip" label="ZIP" error={errors.zip}><input id="zip" inputMode="numeric" maxLength={5} className="field" autoComplete="postal-code" value={v.zip} onChange={(e) => set("zip")(e.target.value.replace(/\D/g, ""))} /></Field>
      </div>
      <div>
        <p className="label">I&rsquo;m a</p>
        <div className="flex flex-wrap gap-2">
          {[["homeowner", "Homeowner"], ["hoa_condo", "HOA / condo"], ["landlord_pm", "Landlord / property manager"], ["commercial", "Commercial"]].map(([id, l]) => (
            <button key={id} type="button" className="choice !min-h-[44px] !px-3 text-sm" aria-pressed={v.customer_type === id} onClick={() => set("customer_type")(id)}>{l}</button>
          ))}
        </div>
      </div>
      {sqft ? <p className="text-sm text-stone">Your planned size ({sqft} sq ft) will be added to the walkthrough as your own estimate.</p> : null}
      {serverErr && <p className="err" role="alert">{serverErr}</p>}
      <button type="submit" className="btn btn-cedar w-full" disabled={busy} data-testid="walkthrough-start-submit">{busy ? "Starting…" : "Start my walkthrough"}</button>
      <p className="text-xs text-stone">You&rsquo;ll get a private link on the next screen. Bookmark it to come back later. No prices are shown online.</p>
      <PrivacyNote />
    </form>
  );
}
