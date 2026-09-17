// ── Matcher: confirmed tags + country → ranked stack (pure code, no LLM) ─
// Same input → same output, every time. No randomness, no dates, no LLM in
// the ranking. This determinism is what makes the tool trustworthy.

import { COUNTRY_RULES, TOOLS, TOOLS_BY_ID } from "./database";
import {
  CAPABILITY_LABELS,
  type Capability,
  type CountryCode,
  type ExtractedTags,
  type FreeType,
  type MatchResult,
  type Pick,
  type StackBlock,
  type Tool,
} from "./types";

// Render order: foundations first, feature tools next, payments last.
const RENDER_ORDER: Capability[] = [
  "database",
  "auth",
  "hosting",
  "file-storage",
  "background-jobs",
  "llm-chat",
  "speech-to-text",
  "text-to-speech",
  "image-gen",
  "video-gen",
  "email",
  "push-notifications",
  "realtime",
  "payments-web",
  "payments-mobile",
];

const FREE_TYPE_ORDER: Record<FreeType, number> = {
  ongoing: 0,
  credits: 1,
  trial: 2,
  none: 3,
};

// How many ranked options to return per capability. The UI shows the top 3 by
// default and reveals the rest behind a "show more" toggle — so this is the
// upper bound on choice, not what's shown at rest. Ranked best-first throughout.
const MAX_PICKS = 6;
// What the stack card shows before the "show N more" expander.
export const DEFAULT_VISIBLE_PICKS = 3;

export function matchStack(tags: ExtractedTags): MatchResult {
  const warnings: string[] = [];
  const platform = tags.platform;
  const country = tags.country;

  // Order the requested capabilities by the render order; unknown ones last.
  const requested = [...tags.capabilities].sort(
    (a, b) => renderIndex(a) - renderIndex(b),
  );

  const stack: StackBlock[] = requested.map((cap) => {
    const isPayment = cap === "payments-web" || cap === "payments-mobile";
    const picks = isPayment
      ? matchPayments(cap, tags, warnings)
      : matchGeneric(cap, platform);
    return {
      capability: cap,
      label: CAPABILITY_LABELS[cap],
      picks,
      note: picks.length === 0 ? "no verified pick yet" : null,
    };
  });

  return { stack, warnings, unmatched: tags.unmatched };
}

// ── Generic (non-payment) matching ─────────────────────────────────────
function matchGeneric(cap: Capability, platform: string): Pick[] {
  const candidates = TOOLS.filter(
    (t) => t.verified && t.tags.includes(cap) && platformOverlap(t, platform),
  );
  return rank(candidates).slice(0, MAX_PICKS).map(toPick);
}

// ── Payments special case (the regional moat) ──────────────────────────
function matchPayments(
  cap: Capability,
  tags: ExtractedTags,
  warnings: string[],
): Pick[] {
  const lane: "web" | "mobile" = cap === "payments-web" ? "web" : "mobile";
  const country = tags.country;
  const rule = COUNTRY_RULES[country] ?? COUNTRY_RULES.unknown;
  const subintent = tags.payment_subintent;

  // Branch A: the user wants to receive their OWN income (not a checkout).
  if (subintent === "receive-own-income") {
    const receiving = TOOLS.filter(
      (t) =>
        t.verified &&
        t.tags.includes(cap) &&
        t.payment_intents?.includes("receive-own-income") &&
        availableIn(t, country),
    );
    if (receiving.length === 0) return [];
    // For receiving, global tools (Payoneer/Wise) first, then local PKR accounts.
    return rank(receiving).slice(0, MAX_PICKS).map(toPick);
  }

  // Branch B: accept payments FROM customers (the country-blocked path).
  // 1. Candidates: payment gateways for this lane, excluding receive-only tools.
  let candidates = TOOLS.filter(
    (t) =>
      t.verified &&
      t.tags.includes(cap) &&
      !isReceiveOnly(t) &&
      availableIn(t, country),
  );

  if (candidates.length === 0) return [];

  // 2. Build the promotion order from the country's fallback list for this lane.
  const promoteIds = [
    ...(rule.fallbacks[lane] ?? []),
    ...(rule.fallbacks.all ?? []),
    ...(rule.fallbacks.local ?? []),
  ];
  const promoteRank = new Map<string, number>();
  promoteIds.forEach((id, i) => {
    if (!promoteRank.has(id)) promoteRank.set(id, i);
  });

  // 3. Rank: promoted tools first (in fallback order), everything else after
  //    by the standard free-first ranking. Deterministic throughout.
  candidates = candidates.sort((a, b) => {
    const pa = promoteRank.has(a.id) ? promoteRank.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const pb = promoteRank.has(b.id) ? promoteRank.get(b.id)! : Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    return compareStandard(a, b);
  });

  // 4. Surface the country warning — this is a headline feature.
  addPaymentWarning(rule, country, warnings);

  return candidates.slice(0, MAX_PICKS).map(toPick);
}

function addPaymentWarning(
  rule: (typeof COUNTRY_RULES)[string],
  country: CountryCode,
  warnings: string[],
): void {
  if (rule.assume_global) {
    const msg =
      "Results assume global availability — set your country for accurate payment picks.";
    if (!warnings.includes(msg)) warnings.push(msg);
    return;
  }
  if (!rule.stripe) {
    const msg = `Stripe isn't available in ${rule.name}. We've promoted Merchant-of-Record and local options that actually work there instead.`;
    if (!warnings.includes(msg)) warnings.push(msg);
  }
}

// ── Ranking (the deterministic core) ───────────────────────────────────
// a. free_type: ongoing > credits > trial > none
// b. requires_card: false before true
// c. no gotcha before has-a-gotcha
// d. stable tiebreak: manual rank, then id (alphabetical)
function rank(tools: Tool[]): Tool[] {
  return [...tools].sort(compareStandard);
}

function compareStandard(a: Tool, b: Tool): number {
  const ft = FREE_TYPE_ORDER[a.free_type] - FREE_TYPE_ORDER[b.free_type];
  if (ft !== 0) return ft;

  const card = Number(a.requires_card) - Number(b.requires_card);
  if (card !== 0) return card;

  const gotcha = Number(!!a.gotcha) - Number(!!b.gotcha);
  if (gotcha !== 0) return gotcha;

  const ra = a.rank ?? 999;
  const rb = b.rank ?? 999;
  if (ra !== rb) return ra - rb;

  return a.id.localeCompare(b.id);
}

// ── Helpers ────────────────────────────────────────────────────────────
function platformOverlap(t: Tool, platform: string): boolean {
  if (platform === "both") return true; // any tool that runs on web OR mobile qualifies
  return t.platform.includes(platform as "web" | "mobile");
}

function availableIn(t: Tool, country: CountryCode): boolean {
  if (t.countries_blocked.includes(country)) return false;
  if (t.countries_supported.includes("*")) return true;
  return t.countries_supported.includes(country);
}

function isReceiveOnly(t: Tool): boolean {
  const intents = t.payment_intents ?? [];
  return intents.length > 0 && intents.every((i) => i === "receive-own-income");
}

function renderIndex(cap: Capability): number {
  const i = RENDER_ORDER.indexOf(cap);
  return i === -1 ? RENDER_ORDER.length : i;
}

// Build a pick's templated `why` line from DB fields — factual, not generated.
function toPick(t: Tool): Pick {
  const why = t.gotcha
    ? `${t.free_details}. Note: ${t.gotcha}`
    : `${t.free_details}.`;
  return {
    toolId: t.id,
    name: t.name,
    why,
    free_type: t.free_type,
    free_details: t.free_details,
    free_ends_at: t.free_ends_at,
    gotcha: t.gotcha,
    requires_card: t.requires_card,
    docs_url: t.docs_url,
    last_verified_at: t.last_verified_at,
  };
}

// Re-export for callers that want a tool by id (e.g. starter prompt).
export { TOOLS_BY_ID };
