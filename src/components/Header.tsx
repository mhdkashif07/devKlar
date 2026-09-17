import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

// Minimal header for now — just the brand, the "work with devAge" CTA, and the
// theme toggle. Nav links are intentionally hidden while we focus on the tool;
// re-add <nav> with SITE.nav (and the mobile menu) later.
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <div className="flex items-center gap-2">
          {/* <Link
            href="/contact"
            className="rounded-lg bg-[var(--color-accent-2)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
          >
            Work with devAge
          </Link> */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
