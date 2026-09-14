import Link from "next/link";
import { SITE } from "@/lib/site";

// The monetization surface: turns free tool usage into devAge agency leads.
// Reused on the results screen and content pages.
export default function LeadCTA({
  heading = "Want this built for you?",
  sub = "devAge ships production apps on exactly these stacks — region-aware payments, AI features, the works. Tell us your idea and get a plan and a quote.",
  compact = false,
}: {
  heading?: string;
  sub?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--color-accent)]/30 bg-gradient-to-br from-[var(--color-accent)]/12 to-transparent ${
        compact ? "p-5" : "p-6 sm:p-8"
      }`}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h3
            className={`font-semibold tracking-tight text-[var(--color-ink)] ${
              compact ? "text-lg" : "text-xl sm:text-2xl"
            }`}
          >
            {heading}
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
            {sub}
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-accent-2)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-accent-2)]/25 transition hover:bg-[var(--color-accent)]"
        >
          {SITE.agencyCtaText} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
