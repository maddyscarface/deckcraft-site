# 07 — Sales Scripts, Follow-up Sequences and the Commercial Proposal Workflow

## Residential speed-to-lead call (BDR, within 5 business minutes)
1. **Open:** "Hi {name}, it's {rep} from DeckCraft Boston. You just sent us a request about your {service} in {town}. Is now a good minute?"
2. **Confirm:** "I see you mentioned {notes/checker result}. What's bugging you most about it?"
3. **Photos:** If photo_count = 0: "The fastest way to a real number is 3 photos: the whole deck, the worst spot, and the stairs. I'll text you a link." If photos are in: "Thanks for the photos, our estimator's reviewing them."
4. **Qualify:** timeline · decision makers ("anyone else we should include?") · rough budget comfort ("typical jobs like this run {range}; does that fit what you had in mind?") · permits/HOA rules.
5. **Safety line (if structural flags):** "Until we see it in person, please keep people off that section."
6. **Close:** "Next step is a 45-minute visit to confirm scope and lock your price in writing. I have {two options}. Which works?" Book in the GHL calendar, then move the stage to Estimate Booked.
7. **If not ready:** move to Follow-Up with a reason. Seasonal nurture.

**Voicemail:** "Hi {name}, {rep} from DeckCraft Boston about your deck request. I'll text you too. Reply with 3 photos and we'll send a range. You can reach me at {number}."

## Estimate visit (estimator)
Walk the deck with the owner → check framing, ledger and posts with a flashlight → photograph everything → explain options (repair / refinish / rebuild) with the trade-offs → confirm permits → written proposal sent the same or next day with line items, exclusions, payment terms, schedule window and photo appendix.

## Residential proposal follow-up sequence
| When | Channel | Message |
|---|---|---|
| Day 2 | SMS/email | "Any questions on the proposal? Happy to walk through options." |
| Day 5 | Call + email | "We're filling {month} dates. Want me to hold one for you?" |
| Day 10 | Email | Short case study or tip (water test / ledger) + "still interested?" |
| Day 21 | Email | "Closing your file for now. Reply anytime and we'll pick up where we left off." Move to Nurture |

**Objection handling**
- *"Another quote is cheaper."* "Can I see the scope? Often the difference is framing or ledger work that isn't included. We'll match apples to apples."
- *"Let me think."* "Of course. Is it the price, the timing, or the scope?"
- *"Can I just do the boards?"* "If the framing is sound, yes. If not, new boards won't last, and we'll show you the photos."

## Property client discovery call (owner / project lead)
1. Portfolio: how many properties, units, decks/porches/balconies, fence runs, towns.
2. Trigger: an insurer request, a resident complaint, a reserve study, an upcoming sale/refi, a recent incident?
3. Decision process: board vote? Management company? Budget cycle and next meeting date?
4. Current vendor situation: what's frustrating?
5. Access: resident notice requirements, keys, hours.
6. Book the walkthrough and request the property list, reserve study and prior reports.

## Commercial / association proposal workflow
1. **Walkthrough** (Property Accounts: Walkthrough). Photograph every structure. Use the inspection form (portal `inspections.findings`). Rate each finding *safety now / repair this year / monitor*.
2. **Findings report (within the promised days):** cover letter; property list; per-structure photos + finding + priority; per-item and per-building pricing; phasing options (A: safety only; B: safety + this year; C: full); schedule per phase; resident notice template; assumptions/exclusions; COI and W-9 attached.
3. **Internal review:** owner approves pricing. **Margins never appear on client or sub documents** (the internal cost columns in `jobs` are excluded from `jobs_for_subs`).
4. **Send + present:** stage → Proposal. Offer to attend the board meeting (stage → Board/Owner Approval when it's on the agenda).
5. **Contract:** written scope, property list, phased schedule, payment terms per phase, change-order procedure (written, priced, approved before work), insurance requirements. Stage → Contract.
6. **Active Work:** one project lead; start/finish photo report per property; weekly update email to the board/manager.
7. **Close-out:** final photo report, invoice per property or consolidated, renewal offer (annual inspection) → Renewal.

## Board-ready proposal template (outline)
1. Summary: what we inspected, how many items in each priority, total by phase
2. Property-by-property findings (photos, priority, price)
3. Phasing options matched to the reserve/budget
4. Schedule and resident coordination
5. Terms, insurance, references (real only)
