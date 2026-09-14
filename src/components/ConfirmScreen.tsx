"use client";

import { useState } from "react";
import {
  CAPABILITY_LABELS,
  CAPABILITY_TAGS,
  KNOWN_COUNTRIES,
  type Capability,
  type CountryCode,
  type ExtractedTags,
  type MobileFramework,
  type PaymentSubintent,
  type Platform,
} from "@/lib/types";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "both", label: "Both" },
];

const FRAMEWORKS: { value: Exclude<MobileFramework, null>; label: string }[] = [
  { value: "react-native", label: "React Native" },
  { value: "flutter", label: "Flutter" },
  { value: "native", label: "Native" },
  { value: "unsure", label: "Not sure" },
];

const SUBINTENTS: { value: Exclude<PaymentSubintent, null>; label: string }[] = [
  { value: "accept-from-customers", label: "Charge customers" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "receive-own-income", label: "Receive my own income" },
  { value: "unsure", label: "Not sure" },
];

export default function ConfirmScreen({
  initial,
  banner,
  onBack,
  onConfirm,
}: {
  initial: ExtractedTags;
  banner: string | null;
  onBack: () => void;
  onConfirm: (tags: ExtractedTags) => void;
}) {
  const [tags, setTags] = useState<ExtractedTags>(initial);
  const [addOpen, setAddOpen] = useState(false);

  const hasPayments =
    tags.capabilities.includes("payments-web") ||
    tags.capabilities.includes("payments-mobile");
  const isMobile = tags.platform === "mobile" || tags.platform === "both";
  const countrySet = tags.country !== "unknown";

  function toggleCapability(cap: Capability) {
    setTags((t) => {
      const has = t.capabilities.includes(cap);
      return {
        ...t,
        capabilities: has
          ? t.capabilities.filter((c) => c !== cap)
          : [...t.capabilities, cap],
      };
    });
  }

  function setPlatform(p: Platform) {
    setTags((t) => ({
      ...t,
      platform: p,
      mobile_framework:
        p === "web" ? null : t.mobile_framework ?? "unsure",
    }));
  }

  const available = CAPABILITY_TAGS.filter((c) => !tags.capabilities.includes(c));

  return (
    <div className="mx-auto w-full max-w-2xl animate-rise px-5 pt-14 pb-20">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
      >
        <span aria-hidden>←</span> Start over
      </button>

      <p className="text-sm font-medium text-[var(--color-accent)]">
        Quick check
      </p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
        Here&apos;s what we understood
      </h2>
      <p className="mt-2 text-[15px] text-[var(--color-ink-2)]">
        Tweak anything that&apos;s off — one tap. Then set your country so the
        payment picks are accurate.
      </p>

      {banner && (
        <div className="mt-5 rounded-xl border border-[var(--color-warn)]/30 bg-[var(--color-warn)]/10 px-4 py-3 text-sm text-[var(--color-warn)]">
          {banner}
        </div>
      )}

      {/* Summary */}
      <Section title="Building">
        <textarea
          value={tags.summary}
          onChange={(e) => setTags((t) => ({ ...t, summary: e.target.value }))}
          rows={2}
          className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-3 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-accent)]/70 focus:outline-none"
        />
      </Section>

      {/* Platform */}
      <Section title="Platform">
        <Segmented
          options={PLATFORMS}
          value={tags.platform}
          onChange={(v) => setPlatform(v as Platform)}
        />
      </Section>

      {/* Framework */}
      {isMobile && (
        <Section title="Mobile framework">
          <Segmented
            options={FRAMEWORKS}
            value={tags.mobile_framework ?? "unsure"}
            onChange={(v) =>
              setTags((t) => ({ ...t, mobile_framework: v as MobileFramework }))
            }
          />
        </Section>
      )}

      {/* Capabilities */}
      <Section title="What it needs">
        <div className="flex flex-wrap gap-2">
          {tags.capabilities.length === 0 && (
            <span className="text-sm text-[var(--color-muted)]">
              Nothing detected — add what you need below.
            </span>
          )}
          {tags.capabilities.map((cap) => (
            <button
              key={cap}
              onClick={() => toggleCapability(cap)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/12 px-3.5 py-1.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/70"
            >
              {CAPABILITY_LABELS[cap]}
              <span className="text-[var(--color-muted)] transition group-hover:text-[var(--color-ink)]">
                ✕
              </span>
            </button>
          ))}
          <button
            onClick={() => setAddOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--color-border-2)] px-3.5 py-1.5 text-sm text-[var(--color-ink-2)] transition hover:border-[var(--color-accent)]/60 hover:text-[var(--color-ink)]"
          >
            + add
          </button>
        </div>

        {addOpen && available.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-3">
            {available.map((cap) => (
              <button
                key={cap}
                onClick={() => {
                  toggleCapability(cap);
                }}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-ink-2)] transition hover:border-[var(--color-accent)]/60 hover:text-[var(--color-ink)]"
              >
                {CAPABILITY_LABELS[cap]}
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* Payment sub-intent */}
      {hasPayments && (
        <Section title="Payments — which kind?">
          <Segmented
            options={SUBINTENTS}
            value={tags.payment_subintent ?? "unsure"}
            onChange={(v) =>
              setTags((t) => ({
                ...t,
                payment_subintent: v as PaymentSubintent,
              }))
            }
            wrap
          />
        </Section>
      )}

      {/* Country — required */}
      <Section title="Country" required>
        <div className="flex flex-wrap gap-2">
          {KNOWN_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setTags((t) => ({ ...t, country: c.code }))}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                tags.country === c.code
                  ? "border-[var(--color-accent)]/70 bg-[var(--color-accent)]/15 text-[var(--color-ink)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]/40 text-[var(--color-ink-2)] hover:border-[var(--color-border-2)]"
              }`}
            >
              <span aria-hidden>{c.flag}</span>
              {c.name}
            </button>
          ))}
        </div>
        {!countrySet && (
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Required — this drives the payment logic, so it can&apos;t be skipped.
          </p>
        )}
      </Section>

      {/* Unmatched */}
      {tags.unmatched.length > 0 && (
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 px-4 py-3">
          <p className="text-[13px] text-[var(--color-muted)]">
            We couldn&apos;t map:{" "}
            <span className="text-[var(--color-ink-2)]">
              {tags.unmatched.filter((u) => u !== "platform-unclear").join(", ") ||
                "a few details"}
            </span>{" "}
            — we&apos;ll show what we can and flag the rest honestly.
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        <button
          onClick={() => onConfirm(tags)}
          disabled={!countrySet || tags.capabilities.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-2)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[var(--color-accent-2)]/25 transition hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Show my stack <span aria-hidden>→</span>
        </button>
        {tags.capabilities.length === 0 && (
          <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
            Add at least one capability to continue.
          </p>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  required,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="mb-2.5 flex items-center gap-2">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          {title}
        </h3>
        {required && (
          <span className="rounded-full bg-[var(--color-warn)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-warn)]">
            required
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  wrap,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  wrap?: boolean;
}) {
  return (
    <div
      className={`inline-flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-1 ${
        wrap ? "flex-wrap" : ""
      }`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            value === o.value
              ? "bg-[var(--color-accent-2)] text-white shadow"
              : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
