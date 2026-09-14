import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles data. Short version: no accounts, no tracking of who you are, and your idea text is only used to generate your stack.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <p className="mt-3 text-[13px] text-[var(--color-muted)]">
        Last updated 9 September 2026
      </p>

      <div className="prose mt-8">
        <p>
          <strong>The short version:</strong> {SITE.name} has no user accounts,
          doesn&apos;t ask who you are, and only uses your idea text to produce a
          stack recommendation. We don&apos;t sell data.
        </p>

        <h2>What we process</h2>
        <ul>
          <li>
            <strong>Your idea text.</strong> When you submit an app idea, it is
            sent from our server to Anthropic&apos;s Claude API to be classified
            into tags. It is processed to generate your result and may be briefly
            held in an in-memory cache so repeat lookups are fast. Don&apos;t
            paste confidential information — treat the box like a public search
            bar.
          </li>
          <li>
            <strong>Your confirmed choices</strong> (platform, country,
            capabilities) are used only in your browser to match your stack.
          </li>
          <li>
            <strong>Reports and contact messages.</strong> If you report an
            outdated tool or submit the contact form, we receive what you send so
            we can act on it.
          </li>
        </ul>

        <h2>Third parties</h2>
        <ul>
          <li>
            <strong>Anthropic (Claude API)</strong> processes your idea text to
            classify it. Anthropic does not train its models on API inputs by
            default, but you still shouldn&apos;t send sensitive data to any
            classification service.
          </li>
          <li>
            <strong>Our hosting provider</strong> may keep standard server logs
            (IP, timestamp, user agent) for security and reliability.
          </li>
        </ul>

        <h2>What we don&apos;t do</h2>
        <ul>
          <li>No accounts, no passwords, no profiles.</li>
          <li>No selling or renting of data.</li>
          <li>No advertising trackers.</li>
        </ul>

        <h2>Cookies &amp; local storage</h2>
        <p>
          We store a single preference in your browser&apos;s local storage —
          your light/dark theme choice. That never leaves your device.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Email{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      </div>
    </main>
  );
}
