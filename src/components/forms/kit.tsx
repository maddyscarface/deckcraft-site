"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, X, Lock, FileText } from "lucide-react";
import Link from "next/link";
import { track } from "@/lib/tracking";

export function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-hunter/60">{hint}</p>}
      {error && <p className="err" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function ChoiceGrid<T extends string>({ options, value, onChange, multi = false, cols = 2, name }: {
  options: { value: T; label: string }[]; value: T | T[] | undefined; onChange: (v: any) => void; multi?: boolean; cols?: 2 | 3; name: string;
}) {
  const sel = (v: T) => (multi ? (value as T[] | undefined)?.includes(v) : value === v);
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={name} className={`grid gap-2 ${cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((o) => (
        <button
          type="button" key={o.value} className="choice"
          role={multi ? "checkbox" : "radio"} aria-checked={Boolean(sel(o.value))}
          onClick={() => {
            if (!multi) return onChange(o.value);
            const cur = new Set((value as T[] | undefined) ?? []);
            cur.has(o.value) ? cur.delete(o.value) : cur.add(o.value);
            onChange([...cur]);
          }}
        >{o.label}</button>
      ))}
    </div>
  );
}

export function Progress({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs font-semibold text-hunter/70">
        <span>Step {step + 1} of {total}</span><span>{labels[step]}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-cream-dark" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1}>
        <div className="h-1.5 rounded-full bg-hunter transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}

const IMG_ACCEPT = ".jpg,.jpeg,.png,.heic,.heif,.webp,image/jpeg,image/png,image/webp,image/heic";
const DOC_ACCEPT = IMG_ACCEPT + ",.pdf,application/pdf";

export function FileDrop({ files, setFiles, allowPdf = false, max = 10, formType }: { files: File[]; setFiles: (f: File[]) => void; allowPdf?: boolean; max?: number; formType: string }) {
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    const urls = files.map((f) => (f.type.startsWith("image/") && !/hei[cf]/.test(f.type) ? URL.createObjectURL(f) : ""));
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  function add(list: FileList | null) {
    if (!list) return;
    setErr("");
    const ok: File[] = [];
    for (const f of Array.from(list)) {
      const isImg = /\.(jpe?g|png|heic|heif|webp)$/i.test(f.name) || f.type.startsWith("image/");
      const isPdf = /\.pdf$/i.test(f.name) || f.type === "application/pdf";
      if (!(isImg || (allowPdf && isPdf))) { setErr(`${f.name}: unsupported file type`); continue; }
      if (f.size > 20 * 1024 * 1024) { setErr(`${f.name} is over 20MB`); continue; }
      ok.push(f);
    }
    const next = [...files, ...ok].slice(0, max);
    if (files.length + ok.length > max) setErr(`Up to ${max} files`);
    setFiles(next);
    if (ok.length) track.photoUploadSuccess(ok.length, formType);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        role="button" tabIndex={0}
        className={`flex cursor-pointer flex-col items-center rounded-[2px] border-2 border-dashed px-5 py-10 text-center transition ${drag ? "border-linen-dark bg-linen-pale" : "border-hunter bg-cream"}`}
      >
        <Camera size={40} className="text-linen-dark" />
        <p className="mt-3 font-semibold">Drop photos here or tap to browse</p>
        <p className="mt-1 max-w-sm text-sm text-hunter/70">
          {allowPdf ? "Photos, reserve studies or prior inspection reports (images or PDF). " : "3 to 5 photos: the whole deck or fence, the worst spots, and the stairs, railings or gates. Phone photos are perfect. "}
          Up to {max} files, 20MB each.
        </p>
        <input ref={input} type="file" multiple accept={allowPdf ? DOC_ACCEPT : IMG_ACCEPT} className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ""; }} data-testid="file-input" />
      </div>
      {err && <p className="err">{err}</p>}
      {files.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((f, i) => (
            <li key={i} className="relative aspect-square overflow-hidden rounded-[2px] border border-cream-dark bg-white">
              {previews[i] ? <img src={previews[i]} alt={f.name} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center p-1 text-center text-[10px]"><FileText size={20} />{f.name.slice(0, 18)}</div>}
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))} className="absolute top-1 right-1 rounded-full bg-hunter p-0.5 text-white"><X size={14} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SmsConsent({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 text-[13px] leading-snug text-hunter/80">
      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1A3828]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>I agree to receive texts from DeckCraft Boston about my request. Msg frequency varies. Msg and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. See <Link href="/terms#sms" className="underline">SMS Terms</Link>.</span>
    </label>
  );
}

export function PrivacyNote() {
  return (
    <p className="mt-3 flex items-start gap-2 text-xs text-hunter/70">
      <Lock size={14} className="mt-0.5 shrink-0" /> Your photos are stored securely and never shared or published without your written permission. <Link href="/privacy" className="underline">Privacy Policy</Link>
    </p>
  );
}

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" /></label>
    </div>
  );
}

export function SuccessState({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="py-6 text-center" role="status" data-testid="lead-success">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cedar text-3xl text-white">✓</div>
      <h2 className="mt-4 font-display text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-hunter/80">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}
