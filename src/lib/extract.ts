// ── Extraction logic: free text → validated tags (server-only) ─────────
// Calls Claude (Anthropic) ONCE, parses defensively, and — critically —
// validates the output against the fixed vocabulary in code. The LLM is
// untrusted: only clean, in-vocabulary tags ever reach the matcher.

import Anthropic from "@anthropic-ai/sdk";
import {
  CAPABILITY_TAGS,
  type Capability,
  type CountryCode,
  type ExtractedTags,
  type ExtractionResponse,
  type MobileFramework,
  type PaymentSubintent,
  type Platform,
} from "./types";
import { EXTRACTION_SYSTEM_PROMPT } from "./extraction-prompt";
import { cacheKey, getCached, setCached } from "./cache";

const MAX_LEN = 1000;
const MIN_WORDS = 3;

const VALID_PLATFORMS: Platform[] = ["web", "mobile", "both"];
const VALID_FRAMEWORKS = ["react-native", "flutter", "native", "unsure"] as const;
const VALID_SUBINTENTS = [
  "accept-from-customers",
  "receive-own-income",
  "subscriptions",
  "unsure",
] as const;
const VALID_COUNTRIES: CountryCode[] = ["PK", "IN", "BD", "NG", "other", "unknown"];
const CAP_SET = new Set<string>(CAPABILITY_TAGS);

// Error thrown when the Anthropic rate limit (429) is hit — not retryable.
export class RateLimitError extends Error {}
// Thrown on a transient Google-side outage (503/500) — retryable with backoff.
export class TransientError extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Public entry point ────────────────────────────────────────────────
export async function extractTags(rawIdea: string): Promise<ExtractionResponse> {
  const idea = (rawIdea ?? "").trim();

  // 1. Guard the input.
  if (idea.length === 0) {
    return {
      tags: emptyTags(),
      status: "too-vague",
      message: "Describe your app idea to get started.",
    };
  }
  if (idea.length > MAX_LEN) {
    return {
      tags: emptyTags(),
      status: "too-vague",
      message: `That's a bit long — keep it under ${MAX_LEN} characters.`,
    };
  }
  if (idea.split(/\s+/).filter(Boolean).length < MIN_WORDS) {
    return {
      tags: emptyTags(),
      status: "too-vague",
      message: "Tell us a little more — a sentence about what the app does works best.",
    };
  }

  // 2. Check the cache first (no API call on a hit).
  const key = cacheKey(idea);
  const cached = getCached(key);
  if (cached) return cached;

  // 3 + 4. Call Claude and parse defensively (one retry on parse failure).
  let parsed: unknown;
  try {
    parsed = await callModelWithRetry(idea);
  } catch (err) {
    // Quota hit, or Google briefly overloaded → a "try again" state, NOT the
    // generic fallback. These are transient/expected, not a parsing failure.
    if (err instanceof RateLimitError || err instanceof TransientError) {
      return {
        tags: emptyTags(),
        status: "rate-limited",
        message:
          err instanceof RateLimitError
            ? "Daily free-tier limit reached — please try again a little later."
            : "The AI is briefly overloaded (high demand). Give it a few seconds and try again.",
      };
    }
    // 6. Safe fallback on total failure so the flow never breaks.
    const fallback: ExtractionResponse = {
      tags: fallbackTags(idea),
      status: "fallback",
      message:
        "We couldn't auto-detect the details — set them below and you're good to go.",
    };
    return fallback;
  }

  // 5. Validate against the vocabulary (the important part).
  const tags = validate(parsed);
  const result: ExtractionResponse = { tags, status: "ok" };

  // 7. Store in cache and return.
  setCached(key, result);
  return result;
}

// ── Claude call (Anthropic SDK, server-side) ───────────────────────────
async function callModelWithRetry(idea: string): Promise<unknown> {
  const transientDelays = [700, 1600]; // backoff for Anthropic-side 5xx
  let transientTries = 0;
  let parseRetried = false;

  while (true) {
    try {
      return await callClaude(idea);
    } catch (err) {
      if (err instanceof RateLimitError) throw err; // rate limit — never retry
      if (err instanceof TransientError) {
        // Anthropic is overloaded — back off and retry a couple of times.
        if (transientTries < transientDelays.length) {
          await sleep(transientDelays[transientTries++]);
          continue;
        }
        throw err;
      }
      if (err instanceof ParseError && !parseRetried) {
        parseRetried = true; // retry a bad/empty parse exactly once
        continue;
      }
      throw err;
    }
  }
}

class ParseError extends Error {}

async function callClaude(idea: string): Promise<unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  // Haiku is the default: reading an idea into tags is a simple classification
  // task, so the cheapest capable model is the right call. Override with
  // ANTHROPIC_MODEL (e.g. claude-sonnet-5 / claude-opus-5) for more nuance.
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
  const client = new Anthropic({ apiKey });

  let message: Anthropic.Message;
  try {
    // Minimal, model-portable params: no `thinking`/`effort` here so this works
    // identically whether ANTHROPIC_MODEL is Opus, Sonnet or Haiku. The JSON is
    // tiny; max_tokens is a generous ceiling (covers any adaptive thinking).
    message = await client.messages.create({
      model,
      max_tokens: 4096,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: idea }],
    });
  } catch (err) {
    // Map Anthropic's typed errors onto our transient/rate-limit taxonomy.
    if (err instanceof Anthropic.RateLimitError) {
      throw new RateLimitError("Claude rate limited");
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw new TransientError("Claude connection error");
    }
    if (err instanceof Anthropic.APIError) {
      const status = err.status ?? 0;
      if (status === 429) throw new RateLimitError("Claude rate limited");
      if (status >= 500) throw new TransientError(`Claude unavailable (${status})`);
    }
    throw err; // auth / bad request / etc. → safe fallback upstream
  }

  // Concatenate text blocks (ignore any thinking blocks the model may emit).
  const text = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();
  if (!text) throw new ParseError("Empty Claude response");

  return parseJsonLoose(text);
}

// Strip stray ```json fences and parse. Throws ParseError on failure.
function parseJsonLoose(text: string): unknown {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  // If there's surrounding prose, grab the outermost JSON object.
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    cleaned = cleaned.slice(first, last + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new ParseError("Could not parse model JSON");
  }
}

// ── Validation: enforce the vocabulary in code ─────────────────────────
function validate(raw: unknown): ExtractedTags {
  const obj = (raw ?? {}) as Record<string, unknown>;

  // Platform.
  let platform: Platform = "web";
  const unmatched: string[] = Array.isArray(obj.unmatched)
    ? obj.unmatched.filter((u): u is string => typeof u === "string").slice(0, 12)
    : [];
  if (VALID_PLATFORMS.includes(obj.platform as Platform)) {
    platform = obj.platform as Platform;
  } else {
    if (!unmatched.includes("platform-unclear")) unmatched.push("platform-unclear");
  }

  // Capabilities: drop anything not in the fixed list; de-dupe.
  const capsIn = Array.isArray(obj.capabilities) ? obj.capabilities : [];
  const capabilities = Array.from(
    new Set(
      capsIn.filter((c): c is Capability => typeof c === "string" && CAP_SET.has(c)),
    ),
  ) as Capability[];

  // Mobile framework: null it out if platform is web.
  let mobile_framework: MobileFramework = null;
  if (platform !== "web") {
    if (VALID_FRAMEWORKS.includes(obj.mobile_framework as (typeof VALID_FRAMEWORKS)[number])) {
      mobile_framework = obj.mobile_framework as MobileFramework;
    } else {
      mobile_framework = "unsure";
    }
  }

  // Payment sub-intent: only valid if a payments capability is present.
  const hasPayments =
    capabilities.includes("payments-web") || capabilities.includes("payments-mobile");
  let payment_subintent: PaymentSubintent = null;
  if (hasPayments) {
    payment_subintent = VALID_SUBINTENTS.includes(
      obj.payment_subintent as (typeof VALID_SUBINTENTS)[number],
    )
      ? (obj.payment_subintent as PaymentSubintent)
      : "unsure";
  }

  // Country: known code or unknown.
  const country: CountryCode = VALID_COUNTRIES.includes(obj.country as CountryCode)
    ? (obj.country as CountryCode)
    : "unknown";

  // Summary.
  const summary =
    typeof obj.summary === "string" && obj.summary.trim().length > 0
      ? obj.summary.trim().slice(0, 240)
      : "Your app idea.";

  return {
    platform,
    mobile_framework,
    capabilities,
    payment_subintent,
    country,
    summary,
    unmatched,
  };
}

// ── Default objects ────────────────────────────────────────────────────
function emptyTags(): ExtractedTags {
  return {
    platform: "web",
    mobile_framework: null,
    capabilities: [],
    payment_subintent: null,
    country: "unknown",
    summary: "",
    unmatched: [],
  };
}

// Minimal-but-valid object so the UI can still show the confirm screen.
function fallbackTags(idea: string): ExtractedTags {
  return {
    platform: "web",
    mobile_framework: null,
    capabilities: ["database", "auth"],
    payment_subintent: null,
    country: "unknown",
    summary: idea.slice(0, 240),
    unmatched: [],
  };
}
