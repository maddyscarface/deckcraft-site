"use client";
import { useState } from "react";
import Link from "next/link";
import { CHECKER_DISCLAIMER, CHECKER_RESULTS, evaluateChecker, type CheckerAnswers, type YN } from "@/lib/checker";
import { track } from "@/lib/tracking";
import { PhotoAssessmentForm } from "../forms/PhotoAssessmentForm";

const Q: { key: keyof CheckerAnswers; q: string; opts?: { v: string; l: string }[] }[] = [
  { key: "age", q: "About how old is the deck?", opts: [{ v: "<10", l: "Under 10 years" }, { v: "10-20", l: "10 to 20 years" }, { v: "20+", l: "Over 20 years" }, { v: "unknown", l: "Not sure" }] },
  { key: "surface_only", q: "Is the main problem gray, splintered or cracked surface wood?" },
  { key: "soft_boards", q: "Do any boards feel soft or spongy underfoot?" },
  { key: "rot_at_framing", q: "Can you see rot or dark, crumbling wood on the joists, posts, or where the deck meets the house?" },
  { key: "posts_move", q: "Do any posts lean, sink, or move?" },
  { key: "railings_loose", q: "Do any railings wobble or have missing balusters?" },
  { key: "stairs_issue", q: "Are any stair treads cracked or soft, or do the stairs feel unstable?" },
];
const YNO: { v: YN; l: string }[] = [{ v: "yes", l: "Yes" }, { v: "no", l: "No" }, { v: "unsure", l: "Not sure" }];
const TONE = { linen: "border-linen bg-linen/15", amber: "border-amber bg-amber/20", patina: "border-patina bg-patina/30" };

export function RepairOrReplaceChecker({ withForm = true }: { withForm?: boolean }) {
  const [a, setA] = useState<Partial<CheckerAnswers>>({});
  const [i, setI] = useState(0);
  const done = Q.every((q) => a[q.key]);
  const result = done ? evaluateChecker(a as CheckerAnswers) : null;
  const r = result ? CHECKER_RESULTS[result] : null;

  function answer(key: keyof CheckerAnswers, v: string) {
    const next = { ...a, [key]: v } as Partial<CheckerAnswers>;
    setA(next);
    if (i < Q.length - 1) setI(i + 1);
    else if (Q.every((q) => next[q.key])) track.toolComplete("repair_or_replace", evaluateChecker(next as CheckerAnswers));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-hunter p-6 text-white shadow-premium md:p-8" data-testid="checker">
        <h2 className="font-display text-2xl">Repair or Replace?</h2>
        <p className="mt-1 text-sm text-sage">{Q.length} quick questions. About a minute.</p>
        {!r && (
          <div className="mt-6">
            <div className="mb-4 h-1 rounded bg-hunter-light"><div className="h-1 rounded bg-linen transition-all" style={{ width: `${(i / Q.length) * 100}%` }} /></div>
            <p className="text-xs font-semibold tracking-wider text-linen">QUESTION {i + 1} OF {Q.length}</p>
            <p className="mt-2 text-lg font-medium">{Q[i].q}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Q[i].opts ?? YNO.map((o) => ({ v: o.v, l: o.l }))).map((o) => (
                <button key={o.v} type="button" onClick={() => answer(Q[i].key, o.v)} aria-pressed={a[Q[i].key] === o.v}
                  className={`rounded-md border px-3 py-3 text-sm font-semibold transition ${a[Q[i].key] === o.v ? "border-linen bg-linen text-hunter" : "border-hunter-light hover:border-linen"}`}>{o.l}</button>
              ))}
            </div>
            {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="mt-4 text-sm text-sage underline">Back</button>}
          </div>
        )}
        {r && result && (
          <div className="mt-6" role="status" data-testid="checker-result">
            <div className={`rounded-lg border-2 p-5 ${TONE[r.tone]}`}>
              <p className="text-xs font-semibold tracking-wider text-linen">PRELIMINARY RESULT</p>
              <p className="mt-1 font-display text-2xl">{r.label}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/90">{r.body}</p>
            </div>
            <p className="mt-4 text-xs text-sage">{CHECKER_DISCLAIMER}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {!withForm && <Link href={`/free-assessment?service=deck_repair`} className="btn btn-linen">Send 3 Photos to Confirm</Link>}
              <button type="button" onClick={() => { setA({}); setI(0); }} className="btn btn-ghost">Start over</button>
            </div>
          </div>
        )}
      </div>
      {r && result && withForm && (
        <div>
          <h3 className="font-display text-2xl">Confirm it with photos</h3>
          <p className="mt-1 mb-5 text-hunter/75">Add your details, dimensions and a few photos. We&apos;ll review your answers and photos together and reply with what we see.</p>
          <PhotoAssessmentForm presetService="deck_repair" checker={{ result, answers: a as Record<string, string> }} />
        </div>
      )}
    </div>
  );
}
