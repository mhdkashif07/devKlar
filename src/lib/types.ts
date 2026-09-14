// ── Shared types for the devAge Stack Recommender ──────────────────────

// The fixed capability vocabulary. The LLM may only emit these; the matcher
// only understands these. Keep this list and CAPABILITY_TAGS in sync.
export type Capability =
  | "payments-web"
  | "payments-mobile"
  | "llm-chat"
  | "speech-to-text"
  | "text-to-speech"
  | "image-gen"
  | "video-gen"
  | "database"
  | "auth"
  | "file-storage"
  | "email"
  | "push-notifications"
  | "realtime"
  | "hosting"
  | "background-jobs";

export const CAPABILITY_TAGS: Capability[] = [
  "payments-web",
  "payments-mobile",
  "llm-chat",
  "speech-to-text",
  "text-to-speech",
  "image-gen",
  "video-gen",
  "database",
  "auth",
  "file-storage",
  "email",
  "push-notifications",
  "realtime",
  "hosting",
  "background-jobs",
];

// Human-friendly labels for each capability, used across the UI.
export const CAPABILITY_LABELS: Record<Capability, string> = {
  "payments-web": "Payments (web)",
  "payments-mobile": "Payments (mobile)",
  "llm-chat": "AI / LLM",
  "speech-to-text": "Speech-to-text",
  "text-to-speech": "Text-to-speech",
  "image-gen": "Image generation",
  "video-gen": "Video generation",
  database: "Database",
  auth: "Auth",
  "file-storage": "File storage",
  email: "Email",
  "push-notifications": "Push notifications",
  realtime: "Realtime",
  hosting: "Hosting",
  "background-jobs": "Background jobs",
};

export type Platform = "web" | "mobile" | "both";
export type MobileFramework = "react-native" | "flutter" | "native" | "unsure" | null;
export type PaymentSubintent =
  | "accept-from-customers"
  | "receive-own-income"
  | "subscriptions"
  | "unsure"
  | null;

// The four countries with hand-verified regional rules, plus the escape hatches.
export type CountryCode = "PK" | "IN" | "BD" | "NG" | "other" | "unknown";

export const KNOWN_COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "other", name: "Other / elsewhere", flag: "🌍" },
];

export type FreeType = "ongoing" | "credits" | "trial" | "none";

// One tool row in the verified database.
export interface Tool {
  id: string;
  name: string;
  category: string;
  tags: string[]; // includes the capability tag(s) it serves
  not_for?: string[];
  platform: ("web" | "mobile")[];
  pricing_model: string;
  free_type: FreeType;
  free_details: string;
  free_ends_at: string | null;
  requires_card: boolean;
  countries_blocked: string[]; // ISO codes where it is unavailable
  countries_supported: string[]; // ["*"] means global
  gotcha: string | null;
  docs_url: string;
  verified: boolean;
  last_verified_at: string;
  rank?: number; // lower = preferred, for stable manual tiebreaks
  // Payment-specific hints (only on payment tools):
  payment_intents?: PaymentSubintent[]; // which sub-intents this tool serves
  is_local_only?: boolean; // local wallet/gateway (JazzCash, bKash, ...)
}

// The validated output of the extraction step.
export interface ExtractedTags {
  platform: Platform;
  mobile_framework: MobileFramework;
  capabilities: Capability[];
  payment_subintent: PaymentSubintent;
  country: CountryCode;
  summary: string;
  unmatched: string[];
}

// Wraps the extraction result with UI-relevant status flags.
export interface ExtractionResponse {
  tags: ExtractedTags;
  status: "ok" | "too-vague" | "rate-limited" | "fallback";
  message?: string; // friendly note for the UI when status !== "ok"
  cached?: boolean;
}

// One pick inside a stack block.
export interface Pick {
  toolId: string;
  name: string;
  why: string;
  free_type: FreeType;
  free_details: string;
  free_ends_at: string | null;
  gotcha: string | null;
  requires_card: boolean;
  docs_url: string;
  last_verified_at: string;
}

// One capability's worth of the final stack.
export interface StackBlock {
  capability: Capability;
  label: string;
  picks: Pick[];
  note: string | null; // e.g. "no verified pick yet"
}

// The full matcher output.
export interface MatchResult {
  stack: StackBlock[];
  warnings: string[];
  unmatched: string[];
}
