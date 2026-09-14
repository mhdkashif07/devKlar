"use client";

import { useState } from "react";
import LeadCTA from "@/components/LeadCTA";
import type {
  Capability,
  ExtractedTags,
  FreeType,
  MatchResult,
  Pick,
  StackBlock,
} from "@/lib/types";

// Build-order groups — turns the stack into a roadmap, not just a list.
const GROUPS: { title: string; hint: string; caps: Capability[] }[] = [
  {
    title: "Foundations",
    hint: "set these up first",
    caps: ["database", "auth", "hosting", "file-storage", "background-jobs"],
  },
  {
    title: "Features",
    hint: "the AI & app capabilities",
    caps: [
      "llm-chat",
      "speech-to-text",
      "text-to-speech",
      "image-gen",
      "video-gen",
      "email",
      "push-notifications",
      "realtime",
    ],
  },
  {
    title: "Payments",
    hint: "wire up last",
    caps: ["payments-web", "payments-mobile"],
  },
];

const FREE_LABEL: Record<FreeType, { label: string; cls: string }> = {
  ongoing: { label: "Ongoing free tier", cls: "text-[var(--color-free)]" },
  credits: { label: "Free credits", cls: "text-[var(--color-free)]" },
  trial: { label: "Trial only", cls: "text-[var(--color-warn)]" },
  none: { label: "No real free tier", cls: "text-[var(--color-muted)]" },
};

export default function StackCard({
  tags,
  result,
  starterPrompt,
  onBack,
}: {
  tags: ExtractedTags;
  result: MatchResult;
  starterPrompt: string;
  onBack: () => void;
}) {
  const picked = result.stack.filter((b) => b.picks.length > 0);
  const missing = result.stack.filter((b) => b.picks.length === 0);

  return (
    <div className="mx-auto w-full max-w-5xl animate-rise px-5 pt-14 pb-24">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
      >
        <span aria-hidden>←</span> New idea
      </button>

      <p className="text-sm font-medium text-[var(--color-accent)]">
        Your stack
      </p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
        {tags.summary}
      </h2>
      <p className="mt-2 text-[15px] text-[var(--color-ink-2)]">
        {picked.length} verified pick{picked.length === 1 ? "" : "s"} ·
        free-first · checked for{" "}
        {tags.country === "unknown" ? "global availability" : tags.country}.
      </p>

      {/* Stack at a glance */}
      {picked.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {picked.map((b) => (
            <span
              key={b.capability}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-3 py-1 text-[13px] text-[var(--color-ink-2)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              {b.picks[0].name}
            </span>
          ))}
        </div>
      )}

      {/* Warnings — surfaced prominently */}
      {result.warnings.length > 0 && (
        <div className="mt-6 space-y-2.5">
          {result.warnings.map((w) => (
            <div
              key={w}
              className="flex items-start gap-3 rounded-xl border border-[var(--color-warn)]/30 bg-[var(--color-warn)]/10 px-4 py-3"
            >
              <span aria-hidden className="mt-0.5 text-[var(--color-warn)]">
                ⚠️
              </span>
              <p className="text-sm leading-relaxed text-[var(--color-warn)]">
                {w}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Starter prompt — headline feature */}
      <StarterPrompt prompt={starterPrompt} />

      {/* Stack cards — grouped by build order, 2-up grid on wider screens */}
      {GROUPS.map((group) => {
        const blocks = picked.filter((b) => group.caps.includes(b.capability));
        if (blocks.length === 0) return null;
        return (
          <section key={group.title} className="mt-8">
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-ink-2)]">
                {group.title}
              </h3>
              <span className="text-[12px] text-[var(--color-muted)]">
                {group.hint}
              </span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>
            <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
              {blocks.map((block) => (
                <ToolBlock key={block.capability} block={block} />
              ))}
            </div>
          </section>
        );
      })}

      {/* No-match blocks — honest, muted */}
      {missing.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            No verified pick yet
          </h3>
          <div className="space-y-2.5">
            {missing.map((block) => (
              <div
                key={block.capability}
                className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-border-2)] bg-[var(--color-surface)]/20 px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink-2)]">
                    {block.label}
                  </p>
                  <p className="text-[13px] text-[var(--color-muted)]">
                    We don&apos;t have a verified pick for this in your region
                    yet — we won&apos;t guess.
                  </p>
                </div>
                <ReportButton
                  capability={block.capability}
                  label="Suggest one"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <FreeSnapshot result={result} />

      {/* Agency lead-gen — the payoff moment to convert */}
      <div className="mt-10">
        <LeadCTA
          heading="Want this stack built for you?"
          sub="devAge ships production apps on exactly these picks — regional payments and AI features included. Send your idea and get a plan and a quote."
        />
      </div>
    </div>
  );
}

function StarterPrompt({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            ⚡ Copy-paste starter prompt
          </p>
          <p className="text-[13px] text-[var(--color-muted)]">
            Paste into Claude Code or Cursor to scaffold with exactly this
            stack.
          </p>
        </div>
        <button
          onClick={copy}
          className="shrink-0 rounded-lg bg-[var(--color-accent-2)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="max-h-64 overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words px-4 py-3.5 text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
        <code style={{ fontFamily: "var(--font-mono)" }}>{prompt}</code>
      </pre>
    </div>
  );
}

function ToolBlock({ block }: { block: StackBlock }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 transition hover:border-[var(--color-border-2)]">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          {block.label}
        </p>
        {block.picks.length > 1 && (
          <span className="text-[11px] text-[var(--color-muted)]">
            {block.picks.length} options
          </span>
        )}
      </div>
      <div className="space-y-2.5">
        {block.picks.map((pick, i) => (
          <OptionRow key={pick.toolId} pick={pick} index={i} />
        ))}
      </div>
    </div>
  );
}

// One ranked option inside a capability card — its own benefits, all visible.
function OptionRow({ pick, index }: { pick: Pick; index: number }) {
  const free = FREE_LABEL[pick.free_type];
  const isTop = index === 0;
  return (
    <div
      className={`rounded-xl border p-3.5 ${
        isTop
          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/[0.07]"
          : "border-[var(--color-border)] bg-[var(--color-bg-2)]/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-bold ${
              isTop
                ? "bg-[var(--color-accent-2)] text-white"
                : "bg-[var(--color-surface-2)] text-[var(--color-ink-2)]"
            }`}
          >
            {index + 1}
          </span>
          <h4 className="truncate text-[15px] font-semibold text-[var(--color-ink)]">
            {pick.name}
          </h4>
          {isTop && (
            <span className="hidden shrink-0 rounded-full border border-[var(--color-accent)]/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)] sm:inline">
              Top pick
            </span>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            pick.requires_card
              ? "border-[var(--color-warn)]/30 text-[var(--color-warn)]"
              : "border-[var(--color-free)]/30 text-[var(--color-free)]"
          }`}
        >
          {pick.requires_card ? "Card" : "No card"}
        </span>
      </div>

      <p className={`mt-2 text-[13px] leading-relaxed ${free.cls}`}>
        {pick.free_details}
      </p>
      <p className="mt-1 text-[12px] text-[var(--color-muted)]">
        Free ends:{" "}
        <span className="text-[var(--color-ink-2)]">
          {pick.free_ends_at ?? "—"}
        </span>
      </p>
      {pick.gotcha && (
        <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--color-warn)]">
          <span aria-hidden>⚠</span>
          <span>{pick.gotcha}</span>
        </p>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <a
          href={pick.docs_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium text-[var(--color-accent)] transition hover:text-[var(--color-ink)]"
        >
          Docs ↗
        </a>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-[var(--color-muted)]">
            verified {pick.last_verified_at}
          </span>
          <ReportButton toolId={pick.toolId} label="Report" />
        </div>
      </div>
    </div>
  );
}

function FreeSnapshot({ result }: { result: MatchResult }) {
  // Coarse, honest one-liner derived from the tightest cliff in the stack —
  // not a live cost model.
  const hasTrial = result.stack.some((b) =>
    b.picks.some((p) => p.free_type === "trial" || p.free_type === "none"),
  );
  return (
    <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 px-4 py-3.5">
      <p className="text-sm text-[var(--color-ink-2)]">
        <span className="font-semibold text-[var(--color-ink)]">
          This whole stack:
        </span>{" "}
        free to build and test.{" "}
        {hasTrial
          ? "A couple of picks run on trial credits — check the amber notes above for where cost kicks in."
          : "First real cost usually kicks in at the tightest free tier in the stack — see each card's “where free ends.”"}
      </p>
    </div>
  );
}

function ReportButton({
  toolId,
  capability,
  label,
}: {
  toolId?: string;
  capability?: string;
  label: string;
}) {
  const [sent, setSent] = useState(false);
  async function report() {
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: toolId ? "outdated" : "missing",
          toolId,
          capability,
        }),
      });
    } catch {
      /* best-effort */
    }
    setSent(true);
    setTimeout(() => setSent(false), 2200);
  }
  return (
    <button
      onClick={report}
      className="text-[11px] text-[var(--color-muted)] underline decoration-dotted underline-offset-2 transition hover:text-[var(--color-ink-2)]"
    >
      {sent ? "Thanks — logged ✓" : label}
    </button>
  );
}
