import Link from "next/link";
import { SITE } from "@/lib/site";

// Wordmark: a small gradient glyph + "Devklar", with the devAge parentage.
export default function Logo({ showParent = true }: { showParent?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-white shadow-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 4h6.5a7 7 0 0 1 0 14H6V4Z"
            stroke="white"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M6 11h9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
          {SITE.name}
        </span>
        {showParent && (
          <span className="mt-0.5 text-[10px] font-medium text-[var(--color-muted)]">
            a {SITE.parent} project
          </span>
        )}
      </span>
    </Link>
  );
}
