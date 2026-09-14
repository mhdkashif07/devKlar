import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Devklar is a free, region-aware stack recommender built by devAge. Here's why it exists and the principles behind every recommendation.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <PageHero
        eyebrow="About"
        title="Honest stack advice, built for the real world"
        sub={`${SITE.name} exists to answer one question well: "what should I actually build my app with?" — with picks that respect where you are and what things really cost.`}
      />

      <div className="prose mt-10">
        <p>
          Most &ldquo;best tools&rdquo; lists are written from Silicon Valley,
          for Silicon Valley. They tell a founder in Karachi or Lagos to
          &ldquo;just use Stripe&rdquo; — a gateway that won&apos;t even onboard
          them. {SITE.name} was built to fix exactly that gap.
        </p>

        <h2>The principles</h2>
        <ul>
          <li>
            <strong>Only verified tools.</strong> Every recommendation is
            hand-checked and carries a public verification date. If we
            haven&apos;t verified it, we don&apos;t show it — we say &ldquo;no
            verified pick yet&rdquo; instead of guessing.
          </li>
          <li>
            <strong>Your region is a first-class input.</strong> The engine knows
            Stripe doesn&apos;t work in Pakistan, Bangladesh or Nigeria, and
            promotes the gateways that do — Paddle, Razorpay, SSLCommerz,
            Paystack, and local wallets.
          </li>
          <li>
            <strong>Free-first, and honest about it.</strong> We show what&apos;s
            free, and — the part everyone hides — exactly where the free tier
            ends.
          </li>
          <li>
            <strong>Deterministic.</strong> The AI only reads your idea into
            structured tags. The actual recommendations come from code matching a
            verified database, so the same input always gives the same answer.
          </li>
        </ul>

        <h2>Who&apos;s behind it</h2>
        <p>
          {SITE.name} is a project by <strong>{SITE.parent}</strong>, a software
          studio that ships production apps on exactly these stacks. The tool is
          free because it&apos;s also the best demonstration of how we think — if
          you&apos;d rather have it built for you, that&apos;s what we do.
        </p>
      </div>

      <div className="mt-12">
        <LeadCTA />
      </div>
    </main>
  );
}
