"use client";

import { useState } from "react";

const EXAMPLES = [
  "A mobile app that transcribes voice notes and summarizes them",
  "Web SaaS where users pay monthly to generate marketing images with AI, I'm in Pakistan",
  "An app like Uber for tutors",
  "A newsletter tool that sends transactional emails and stores subscribers",
];

export default function SearchBox({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (idea: string) => void;
  loading: boolean;
  error: string | null;
}) {
  const [idea, setIdea] = useState("");

  function submit() {
    if (loading) return;
    const trimmed = idea.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 pt-12 pb-16 sm:pt-20">
      <div className="animate-rise mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-2)] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-free)]" />
        Verified · region-aware · free-first
      </div>

      <h1
        className="animate-rise text-center text-4xl font-semibold tracking-tight sm:text-6xl"
        style={{ animationDelay: "40ms" }}
      >
        <span className="text-gradient">Describe your app.</span>
        <br />
        Get the right stack.
      </h1>

      <p
        className="animate-rise mt-5 max-w-xl text-center text-base leading-relaxed text-[var(--color-ink-2)] sm:text-lg"
        style={{ animationDelay: "90ms" }}
      >
        Tell us what you want to build. We&apos;ll return a verified, free-first
        stack that actually works in your country — Stripe-blocked regions
        included.
      </p>

      <div
        className="animate-rise mt-9 w-full"
        style={{ animationDelay: "140ms" }}
      >
        <div className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-2 shadow-2xl shadow-black/40 backdrop-blur transition focus-within:border-[var(--color-accent)]/70">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
            }}
            maxLength={1000}
            rows={3}
            placeholder="e.g. a mobile app that lets users record voice notes and get AI summaries…"
            className="w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none"
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-1">
            <span className="text-xs text-[var(--color-muted)]">
              {idea.length}/1000 · ⌘/Ctrl+Enter
            </span>
            <button
              onClick={submit}
              disabled={loading || idea.trim().length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-2)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-2)]/25 transition hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Spinner /> Analyzing…
                </>
              ) : (
                <>
                  Get my stack
                  <span aria-hidden>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-[var(--color-warn)]">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setIdea(ex)}
              disabled={loading}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/40 px-3.5 py-1.5 text-xs text-[var(--color-ink-2)] transition hover:border-[var(--color-border-2)] hover:text-[var(--color-ink)] disabled:opacity-40"
            >
              {ex.length > 46 ? ex.slice(0, 46) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      <div
        className="animate-rise mt-16 grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
        style={{ animationDelay: "200ms" }}
      >
        <Feature
          title="Only verified tools"
          body="Every pick is hand-checked with a public verification date. No guessing, ever."
        />
        <Feature
          title="Knows your region"
          body="Drops Stripe where it doesn't work and promotes the local gateways that do."
        />
        <Feature
          title="Free-first, honestly"
          body="Shows exactly when each free tier ends — and flags the gotchas that bite."
        />
      </div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 text-left">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-muted)]">
        {body}
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
