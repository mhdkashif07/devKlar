import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Devklar turns a plain-language app idea into a verified, region-aware tech stack — the AI extracts, the code matches, nothing is guessed.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  {
    n: "1",
    title: "Describe your idea",
    body: "Type what you want to build in one plain sentence. No forms, no jargon — 'a mobile app that transcribes voice notes' is enough.",
  },
  {
    n: "2",
    title: "AI reads it into tags",
    body: "A Claude model does one narrow job: turn your text into structured tags from a fixed vocabulary. It never recommends tools — it only classifies.",
  },
  {
    n: "3",
    title: "You confirm",
    body: "We show what we understood as editable chips and ask the two things text rarely reveals: your country, and (if mobile) your framework. One tap to fix anything.",
  },
  {
    n: "4",
    title: "Code matches the database",
    body: "Pure, deterministic code matches your confirmed tags against a hand-verified tool database — applying the regional payment rules — and ranks free-first. Same input, same result, every time.",
  },
  {
    n: "5",
    title: "Get an actionable stack",
    body: "A clean, grouped stack with what's free, where free ends, the gotchas, and a copy-paste prompt to scaffold it in Claude Code or Cursor.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <PageHero
        eyebrow="How it works"
        title="The AI reads. The code decides."
        sub="This separation is deliberate — it's what keeps recommendations consistent, defensible, and free of the 'one model recommends everything' problem."
      />

      <ol className="mt-10 space-y-4">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-2)] text-sm font-bold text-white">
              {s.n}
            </span>
            <div>
              <h3 className="font-semibold text-[var(--color-ink)]">{s.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-6 text-center">
        <p className="text-[15px] text-[var(--color-ink-2)]">
          That&apos;s the whole thing. No account, no cost.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-2)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
        >
          Try the stack finder <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="mt-12">
        <LeadCTA />
      </div>
    </main>
  );
}
