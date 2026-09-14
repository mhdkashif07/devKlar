"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const BUDGETS = [
  "Not sure yet",
  "< $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
];

export default function ContactForm({ presetIdea = "" }: { presetIdea?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    idea: presetIdea,
    budget: BUDGETS[0],
    timeline: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!form.email.trim() || !form.idea.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[var(--color-free)]/30 bg-[var(--color-free)]/10 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-free)]/20 text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-ink)]">
          Got it — thank you!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--color-ink-2)]">
          We&apos;ve received your project. Someone from {SITE.parent} will reach
          out at <strong>{form.email}</strong> shortly. In the meantime, feel free
          to run more ideas through the finder.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition focus:border-[var(--color-accent)]/70 focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-ink-2)]">
            Name
          </label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-ink-2)]">
            Email <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input
            type="email"
            required
            className={inputCls}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-ink-2)]">
          What are you building?{" "}
          <span className="text-[var(--color-accent)]">*</span>
        </label>
        <textarea
          required
          rows={4}
          className={`${inputCls} resize-none`}
          value={form.idea}
          onChange={(e) => update("idea", e.target.value)}
          placeholder="A sentence or two about your app idea, and where you're based."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-ink-2)]">
            Budget
          </label>
          <select
            className={inputCls}
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-ink-2)]">
            Timeline
          </label>
          <input
            className={inputCls}
            value={form.timeline}
            onChange={(e) => update("timeline", e.target.value)}
            placeholder="e.g. ASAP, 1–2 months"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-[var(--color-warn)]">
          Something went wrong sending that. Please email {SITE.contactEmail}{" "}
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !form.email.trim() || !form.idea.trim()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-2)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[var(--color-accent-2)]/25 transition hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "sending" ? "Sending…" : "Send project details"}
      </button>
      <p className="text-center text-[12px] text-[var(--color-muted)]">
        No spam. We only use this to reply about your project.
      </p>
    </form>
  );
}
