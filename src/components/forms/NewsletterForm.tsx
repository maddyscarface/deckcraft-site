"use client";
import { useRef, useState } from "react";
import { newEventId, submitLead } from "@/lib/submit";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const eventId = useRef(newEventId("nl"));
  const started = useRef(Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const r = await submitLead({ form_type: "newsletter", email, sms_consent: false, consent_marketing: true }, eventId.current, started.current);
    if (r.ok) setState("done");
    else { setState("error"); setMsg(r.fields?.email ?? r.error ?? "Something went wrong"); }
  }

  if (state === "done") return <p className="font-medium text-white">You're on the list. Seasonal tips only, and you can unsubscribe anytime.</p>;
  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row" noValidate>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input id="nl-email" type="email" required className="field flex-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <button className="btn btn-cedar" disabled={state === "sending"}>{state === "sending" ? "Subscribing…" : "Subscribe"}</button>
      {state === "error" && <p className="err sm:basis-full">{msg}</p>}
    </form>
  );
}
