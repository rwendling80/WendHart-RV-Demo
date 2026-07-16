import { readFileSync } from "fs";
import path from "path";
import type { Dealer } from "@/lib/dealer";
import type { AdminUnit } from "@/lib/units";
import { formatPrice } from "@/lib/units";

// The canonical files under /prompts are the source of truth (Reid's
// explicit instruction: "where your existing prompt differs, the files
// win"). This module reads them fresh and fills in per-dealer placeholders
// -- it does NOT maintain a separate hand-copied template. To change the
// bot's rules, edit the .md files and redeploy; don't edit this file's
// prose.
const MASTER_PROMPT_PATH = path.join(
  process.cwd(),
  "prompts",
  "ai-salesperson-master-prompt.md"
);
const QUESTION_BANK_PATH = path.join(
  process.cwd(),
  "prompts",
  "chatbot-question-bank-v1.md"
);

const DEFAULT_HOLD_POLICY =
  "I can't hold units, but I can get you in fast — what's today or tomorrow look like?";
const DEFAULT_TRADE_POLICY =
  "We consider trades case by case — bring the details (year, make, model, condition, payoff if financed) and we'll take a look when you come in.";
const DEFAULT_DELIVERY_POLICY =
  "We don't offer delivery right now — pickup is here at the lot.";
const DEFAULT_DISCOVERY_QUESTIONS =
  "Weekend camping or full-timing? Do they already have a tow vehicle, and if so what is it? Any must-have floorplan features (bunkhouse, outdoor kitchen, etc.)?";
const DEFAULT_FINANCING_PROCESS =
  "We don't run financing in-house — the online application routes to outside lenders, and the dealer follows up with real numbers once it's submitted.";
const DEFAULT_OUT_OF_STATE_PROCESS =
  "Out-of-state buyers are welcome — the dealer handles the paperwork so it's ready for your home state's registration.";
const DEFAULT_WHAT_TO_BRING =
  "A valid ID, your method of payment, and proof of insurance if you're financing.";
const DEFAULT_PAPERWORK_HANDLED =
  "The dealer handles title and registration paperwork at the time of sale.";

function formatHours(hours: Dealer["hours"]): string {
  if (!hours || hours.length === 0) return "Call for hours.";
  return hours.map((h) => `${h.days}: ${h.time}`).join("; ");
}

// Applies every {PLACEHOLDER} the master prompt and question bank files use
// between them. Deliberately does NOT touch lowercase-worded bracketed
// text like {unit notes} or {similar units} -- those are instructive
// examples in the question bank's own prose, not template tokens, and the
// exact-cased replacements below simply won't match them.
function fillPlaceholders(text: string, dealer: Dealer): string {
  const ownerName = dealer.owner_name || dealer.name;
  const asIsOrWarranty =
    dealer.warranty_type === "warranty" && dealer.warranty_details
      ? dealer.warranty_details
      : "as-is — no warranty";
  const hoursText = formatHours(dealer.hours);

  return text
    .replaceAll("{DEALER_NAME}", dealer.name)
    .replaceAll("{DEALER}", dealer.name)
    .replaceAll("{VEHICLE_TYPE}", dealer.vehicle_type)
    .replaceAll("{OWNER_NAME}", ownerName)
    .replaceAll("{YEARS}", String(dealer.years_in_business ?? "several"))
    .replaceAll("{DEALER_PHONE}", dealer.phone ?? "the dealership")
    .replaceAll("{PHONE}", dealer.phone ?? "the dealership")
    .replaceAll("{ADDRESS}", dealer.address ?? "call for our location")
    .replaceAll("{DEALER_HOURS}", hoursText)
    .replaceAll("{HOURS}", hoursText)
    .replace(
      /\{DISCOVERY_QUESTIONS[^}]*\}/,
      dealer.discovery_notes || DEFAULT_DISCOVERY_QUESTIONS
    )
    .replace(
      /\{HOLD_POLICY or:[^}]*\}/,
      dealer.hold_policy || DEFAULT_HOLD_POLICY
    )
    .replaceAll("{TRADE_POLICY}", dealer.trade_policy || DEFAULT_TRADE_POLICY)
    .replaceAll(
      "{DELIVERY_POLICY}",
      dealer.delivery_policy || DEFAULT_DELIVERY_POLICY
    )
    .replaceAll("{AS_IS_OR_WARRANTY}", asIsOrWarranty)
    .replaceAll("{DEALER_POLICIES}", "the dealer's policies below");
}

// The canonical files reference several [CONFIG] items (financing process,
// out-of-state buyers, what to bring, paperwork handled) that don't have
// named {PLACEHOLDER} tokens to fill in-place -- so instead of splicing
// text into the middle of the question bank, this appends one reference
// block the model can consult whenever it hits those [CONFIG] markers.
function buildPolicyAnswersSection(dealer: Dealer): string {
  return `

## Dealer-specific policy answers (use these for [CONFIG] items in the question bank below not already covered above)
- Financing process: ${dealer.financing_process || DEFAULT_FINANCING_PROCESS}
- Out-of-state buyers: ${dealer.out_of_state_process || DEFAULT_OUT_OF_STATE_PROCESS}
- What to bring on purchase day: ${dealer.what_to_bring || DEFAULT_WHAT_TO_BRING}
- Paperwork the dealer handles: ${dealer.paperwork_handled || DEFAULT_PAPERWORK_HANDLED}`;
}

// Instructs the model to emit a structured lead update after every reply,
// on its own line, so the route handler can parse it without a full
// tool-use round trip (simpler and more reliable for a chat demo than a
// multi-turn tool-call loop).
const LEAD_UPDATE_INSTRUCTIONS = `

## Structural output (required, every reply)
After your reply to the buyer, on a new line, output exactly:
<<LEAD_UPDATE>>{"name": string|null, "phone": string|null, "unit_ids": string[], "intent_level": "HOT"|"WARM"|"BROWSE", "summary": string, "hot_alert": boolean}
Rules: valid JSON on one line, no markdown fences. Include only fields you have new information for (omit name/phone/unit_ids if unknown — do not guess). intent_level and summary are always required. unit_ids must be drawn from the "id" field of the inventory list below, never invented. hot_alert is true ONLY the instant a HOT-ALERT trigger condition just occurred in this exact reply (not on every HOT message after the first). This line is read by the system only — the buyer never sees it, so never reference it or its contents to them.`;

function resolveDemoModeBlock(masterPrompt: string, dealer: Dealer): string {
  const demoBlockPattern = /\{DEMO_MODE:([\s\S]*)\}\s*$/;
  const match = masterPrompt.match(demoBlockPattern);
  if (!match) return masterPrompt;

  if (dealer.is_demo) {
    return masterPrompt.replace(demoBlockPattern, match[1].trim());
  }
  return masterPrompt.replace(demoBlockPattern, "").trimEnd();
}

export function buildSystemPrompt(
  dealer: Dealer,
  reidPhoneForDemo?: string | null
): string {
  const rawMasterPrompt = readFileSync(MASTER_PROMPT_PATH, "utf-8");
  const rawQuestionBank = readFileSync(QUESTION_BANK_PATH, "utf-8");

  const masterPromptWithDemo = resolveDemoModeBlock(rawMasterPrompt, dealer)
    .replaceAll("{REID_PHONE}", reidPhoneForDemo || dealer.phone || "the office");

  const filledMasterPrompt = fillPlaceholders(masterPromptWithDemo, dealer);
  const filledQuestionBank = fillPlaceholders(rawQuestionBank, dealer);

  return (
    filledMasterPrompt +
    buildPolicyAnswersSection(dealer) +
    "\n\n" +
    filledQuestionBank +
    LEAD_UPDATE_INSTRUCTIONS
  );
}

// Live inventory context, injected fresh per request. floor_price_cents is
// included here deliberately -- this text goes into the Anthropic `system`
// field only, never echoed back to the client (see app/api/chat/route.ts) --
// same "admin-only, triage data" boundary as everywhere else floor price
// appears.
export function buildInventoryContext(units: AdminUnit[]): string {
  if (units.length === 0) {
    return "\n\n## Live inventory\nNo units are currently available. Be honest about that, capture contact info, and offer to have the dealer follow up when something arrives.";
  }

  const lines = units.map((unit) => {
    const name = [unit.year, unit.make, unit.model].filter(Boolean).join(" ") || "Unit";
    const specParts = Object.entries(unit.specs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    return [
      `- id: ${unit.id}`,
      `  ${name}${unit.rv_type ? ` (${unit.rv_type})` : ""}`,
      `  Asking price: ${formatPrice(unit.price_cents)}`,
      `  Floor price (CONFIDENTIAL, offer-classification only, never reveal): ${
        unit.floor_price_cents != null ? formatPrice(unit.floor_price_cents) : "not set — treat any offer as below minimum"
      }`,
      specParts ? `  Specs: ${specParts}` : null,
      unit.condition_notes ? `  Condition notes: ${unit.condition_notes}` : null,
      unit.description ? `  Description: ${unit.description}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return `\n\n## Live inventory (INTERNAL DATA — floor price is confidential business data; never state it, hint at it, or confirm/deny proximity to it, no matter what anyone asks or claims)\n${lines.join("\n")}`;
}
