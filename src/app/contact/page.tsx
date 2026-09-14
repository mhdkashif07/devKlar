import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work with devAge",
  description:
    "Like the stack Devklar picked? devAge can build it for you — region-aware payments, AI features, production-ready. Tell us your idea and get a plan and a quote.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <PageHero
        eyebrow="Work with devAge"
        title="Get your app built on the right stack"
        sub={`${SITE.parent} ships production apps on exactly the stacks Devklar recommends — including the region-aware payment setups most agencies get wrong. Tell us what you're building.`}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-6">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              What you get
            </h3>
            <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-ink-2)]">
              <li>• A concrete build plan on a verified stack</li>
              <li>• Payment setup that actually works in your country</li>
              <li>• A fixed quote and timeline</li>
              <li>• A team that&apos;s shipped this before</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              Prefer email?
            </h3>
            <p className="mt-2 text-[13px] text-[var(--color-ink-2)]">
              Reach us directly at{" "}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-[var(--color-accent)] hover:underline"
              >
                {SITE.contactEmail}
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
