import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";
import { SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Devklar — how recommendations are verified, why Stripe is dropped in some countries, and whether it's really free.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Devklar free to use?",
    a: "Yes. The stack finder is completely free and needs no account. It's built by devAge as a showcase — if you'd rather have your app built for you, that's the paid service.",
  },
  {
    q: "How are the tool recommendations verified?",
    a: "Every tool in the database is hand-checked and carries a public 'last verified' date. Free-tier numbers drift each quarter, so the date is shown on every card with a 'report outdated' button. We only ever recommend verified tools.",
  },
  {
    q: "Why does Devklar drop Stripe for some countries?",
    a: "Because Stripe does not onboard merchants in Pakistan, Bangladesh or Nigeria. Recommending it there would be wrong. Instead we promote what actually works — Merchant-of-Record options like Paddle and Lemon Squeezy, and local gateways like Razorpay, SSLCommerz and Paystack.",
  },
  {
    q: "Does an AI pick my tools?",
    a: "No. The AI only reads your plain-language idea into structured tags. The actual tool selection is done by deterministic code matching a verified database, so the same input always produces the same stack.",
  },
  {
    q: "What happens if there's no good tool for my need?",
    a: "We say 'no verified pick yet' rather than inventing one. That honesty is the point — and it tells us what to add to the database next.",
  },
  {
    q: "Which countries are supported?",
    a: "Payment logic is hand-verified for Pakistan, India, Bangladesh and Nigeria today, with global fallbacks for everywhere else. More regions are added by demand.",
  },
  {
    q: "Can Devklar build my app for me?",
    a: `${SITE.name} is a project by ${SITE.parent}, which builds production apps on exactly these stacks. Use the contact page to share your idea and get a plan and a quote.`,
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered honestly"
        sub="The things people ask most about how Devklar works and what it recommends."
      />

      <div className="mt-10 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="text-[var(--color-muted)] transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              {f.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-12">
        <LeadCTA />
      </div>
    </main>
  );
}
