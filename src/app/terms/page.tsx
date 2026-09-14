import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms for using ${SITE.name}. It's a free informational tool provided as-is — always verify a tool's terms before you build on it.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <p className="mt-3 text-[13px] text-[var(--color-muted)]">
        Last updated 9 September 2026
      </p>

      <div className="prose mt-8">
        <p>
          By using {SITE.name} (&ldquo;the tool&rdquo;), you agree to these terms.
          The tool is provided free of charge by {SITE.parent}.
        </p>

        <h2>What the tool is</h2>
        <p>
          {SITE.name} is an <strong>informational tool</strong>. It suggests
          technology and payment options based on a hand-verified database and
          your inputs. It is not legal, financial, or professional advice.
        </p>

        <h2>Accuracy &amp; &ldquo;as-is&rdquo;</h2>
        <p>
          We work hard to keep recommendations verified and dated, but free tiers,
          pricing, and regional availability change constantly. Recommendations
          are provided <strong>&ldquo;as is&rdquo; without warranty</strong>.
          Always confirm a provider&apos;s current pricing, terms, and country
          availability on their own site before you build on or pay for it.
        </p>

        <h2>No liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE.parent} is not liable for
          any loss arising from decisions you make based on the tool&apos;s output.
          You are responsible for your own due diligence.
        </p>

        <h2>Third-party services</h2>
        <p>
          The tools we recommend are operated by third parties under their own
          terms. We are not responsible for those services, and listing a tool is
          not an endorsement of, or partnership with, its provider.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Don&apos;t abuse, scrape, or overload the service.</li>
          <li>
            Don&apos;t submit unlawful content or attempt to disrupt the tool.
          </li>
        </ul>

        <h2>Changes</h2>
        <p>
          We may update these terms as the tool evolves. Continued use after a
          change means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      </div>
    </main>
  );
}
