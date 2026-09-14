import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Logo />
          <p className="mt-3 max-w-[220px] text-[13px] leading-relaxed text-[var(--color-muted)]">
            {SITE.tagline}
          </p>
        </div>

        {SITE.footer.map((group) => (
          <div key={group.title}>
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {group.title}
            </h4>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[var(--color-ink-2)] transition hover:text-[var(--color-ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-[12px] text-[var(--color-muted)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name} — a {SITE.parent} project.
          </p>
          <p>
            Free-tier numbers are verified and dated. Spot something stale?{" "}
            <Link
              href="/contact"
              className="text-[var(--color-accent)] hover:underline"
            >
              Tell us
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
