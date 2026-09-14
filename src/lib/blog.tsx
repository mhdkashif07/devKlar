import type { ReactNode } from "react";
import Link from "next/link";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  readingTime: string;
  tags: string[];
  keywords: string[];
  content: ReactNode;
}

const TryTool = () => (
  <p>
    <Link href="/">Run your idea through the Devklar stack finder →</Link>
  </p>
);

export const POSTS: BlogPost[] = [
  {
    slug: "best-payment-gateway-saas-pakistan",
    title: "The best payment gateway for a SaaS in Pakistan (2026)",
    description:
      "Stripe doesn't onboard Pakistani merchants. Here's what actually works in 2026 — Paddle, Lemon Squeezy, PayFast and Safepay — and how to choose between them.",
    date: "2026-09-05",
    readingTime: "6 min read",
    tags: ["Payments", "Pakistan", "SaaS"],
    keywords: [
      "payment gateway Pakistan",
      "Stripe alternative Pakistan",
      "Paddle Pakistan",
      "PayFast Safepay",
      "accept payments Pakistan SaaS",
    ],
    content: (
      <>
        <p>
          If you&apos;re building a SaaS from Pakistan, the first wall you hit
          isn&apos;t code — it&apos;s <strong>getting paid</strong>. Stripe, the
          default everyone reaches for, does not onboard merchants based in
          Pakistan. Neither does a PayPal business/merchant account. So the real
          question isn&apos;t &ldquo;how do I add Stripe&rdquo; — it&apos;s
          &ldquo;what do I use instead?&rdquo;
        </p>
        <p>
          The good news: in 2026 there are solid, verified options. They fall
          into two groups.
        </p>

        <h2>Option 1 — Merchant of Record (best for global SaaS)</h2>
        <p>
          A <strong>Merchant of Record (MoR)</strong> becomes the legal seller of
          your product. They handle global card acceptance and — critically —
          worldwide VAT/sales-tax compliance, then pay you out. For a SaaS
          selling to customers abroad, this is usually the right answer from
          Pakistan.
        </p>
        <ul>
          <li>
            <strong>Paddle</strong> — no monthly fee, revenue-share per sale.
            Onboards businesses in Pakistan and handles tax globally.
          </li>
          <li>
            <strong>Lemon Squeezy</strong> — same MoR model, developer-friendly,
            great for digital products and subscriptions.
          </li>
        </ul>
        <p>
          Both let you charge customers in any currency while you sit in
          Pakistan. The trade-off is the revenue share (roughly 5% + a fixed
          fee), which is the price of never touching tax compliance yourself.
        </p>

        <h2>Option 2 — Local gateways (best for domestic customers)</h2>
        <p>
          If you&apos;re selling primarily to Pakistani customers in PKR, a local
          gateway is cheaper and more familiar to your buyers:
        </p>
        <ul>
          <li>
            <strong>PayFast</strong> and <strong>Safepay</strong> — local card
            gateways with low/no setup fees.
          </li>
          <li>
            <strong>JazzCash</strong> and <strong>Easypaisa</strong> — mobile
            wallet APIs, ideal when your users pay from a phone wallet rather than
            a card.
          </li>
        </ul>

        <h2>What about mobile apps?</h2>
        <p>
          If you&apos;re shipping a mobile app with subscriptions, none of the
          above is the natural fit — you&apos;ll be inside Apple/Google&apos;s
          in-app purchase rules. Use <strong>RevenueCat</strong>, which is free
          under $2,500/mo of tracked revenue and works fine from Pakistan. We
          compared it to Paddle in a{" "}
          <Link href="/blog/revenuecat-vs-paddle">separate guide</Link>.
        </p>

        <h2>The quick decision</h2>
        <ul>
          <li>
            <strong>Web SaaS, global customers</strong> → Paddle or Lemon
            Squeezy.
          </li>
          <li>
            <strong>Web, mostly Pakistani customers</strong> → PayFast / Safepay,
            or JazzCash / Easypaisa for wallets.
          </li>
          <li>
            <strong>Mobile app subscriptions</strong> → RevenueCat.
          </li>
        </ul>
        <blockquote>
          Whatever you pick, verify onboarding for your exact business type on the
          provider&apos;s site before you build — availability shifts, and
          that&apos;s the number the whole plan hangs on.
        </blockquote>
        <TryTool />
      </>
    ),
  },
  {
    slug: "free-tier-ai-app-stack",
    title: "How to build an AI app entirely on free tiers (the 2026 stack)",
    description:
      "A verified, free-first stack for shipping an AI app in 2026 — database, auth, hosting, and the AI APIs — plus exactly when each free tier runs out.",
    date: "2026-09-06",
    readingTime: "7 min read",
    tags: ["AI", "Free tier", "Stack"],
    keywords: [
      "free tier AI app",
      "build AI app free",
      "Gemini free tier",
      "Supabase free tier",
      "free LLM API",
      "free stack 2026",
    ],
    content: (
      <>
        <p>
          You can build and launch a real AI app in 2026 without paying for
          anything until you have actual users. The trick is knowing which free
          tiers are genuinely free-to-run (not just a trial) — and where each one
          quietly ends. Here&apos;s a verified starting stack.
        </p>

        <h2>Foundations</h2>
        <ul>
          <li>
            <strong>Database — Supabase or Neon.</strong> Supabase bundles
            Postgres, auth, storage and realtime on one free project (the catch:
            projects auto-pause after 7 days idle). Neon is serverless Postgres
            that scales to zero with no idle pause.
          </li>
          <li>
            <strong>Auth — Clerk or Firebase Auth.</strong> Clerk gives you
            drop-in UI free to ~10k monthly users; Firebase Auth is free and
            generous.
          </li>
          <li>
            <strong>Hosting — Cloudflare Pages/Workers or Vercel.</strong>{" "}
            Cloudflare&apos;s free tier is generous with no commercial
            restriction; Vercel is unbeatable for Next.js but its Hobby tier is
            non-commercial, so budget for Pro once you monetize.
          </li>
        </ul>

        <h2>The AI layer — don&apos;t default to the priciest model</h2>
        <p>
          The single biggest free-tier win is picking the right model for the
          job. For most tasks — classification, extraction, chat — a fast cheap
          model is plenty:
        </p>
        <ul>
          <li>
            <strong>Google AI Studio (Gemini Flash)</strong> — ~1,500 requests/day
            free, no card. Note: free inputs may train Google&apos;s models, so
            don&apos;t send sensitive data.
          </li>
          <li>
            <strong>Groq</strong> — the fastest inference, ~1,000 requests/day
            free per model.
          </li>
          <li>
            <strong>OpenRouter</strong> — one API, many models, with free
            variants you can route cheap tasks to.
          </li>
        </ul>
        <p>
          Reserve premium reasoning models for genuinely hard reasoning or coding
          — not for simple classification, where they just cost more for the same
          result.
        </p>

        <h2>Feature APIs that are actually free to start</h2>
        <ul>
          <li>
            <strong>Speech-to-text</strong> — AssemblyAI ($50 credit, no expiry,
            no card) or Deepgram ($200 signup credit).
          </li>
          <li>
            <strong>Email</strong> — Resend (~3,000/mo free) for transactional
            mail.
          </li>
          <li>
            <strong>Push</strong> — Firebase Cloud Messaging, fully free and
            unlimited.
          </li>
        </ul>

        <h2>Where &ldquo;free&rdquo; ends</h2>
        <p>
          The honest part most lists skip: image generation is mostly one-time
          credits, not an ongoing free tier (Stability, Fal). And your whole
          stack is free to build and test — the first real cost usually shows up
          at the tightest tier, often the database once you cross its row/MAU
          limits.
        </p>
        <TryTool />
      </>
    ),
  },
  {
    slug: "revenuecat-vs-paddle",
    title: "RevenueCat vs Paddle: which should your app use?",
    description:
      "They solve different problems. RevenueCat is for mobile in-app subscriptions; Paddle is a Merchant of Record for web SaaS. Here's how to choose.",
    date: "2026-09-07",
    readingTime: "5 min read",
    tags: ["Payments", "Subscriptions"],
    keywords: [
      "RevenueCat vs Paddle",
      "mobile subscriptions",
      "merchant of record",
      "in-app purchase billing",
    ],
    content: (
      <>
        <p>
          People pit these two against each other, but they&apos;re not really
          competitors — they solve different problems. Picking wrong means either
          fighting Apple&apos;s rules or paying for tax infrastructure you
          don&apos;t need.
        </p>

        <h2>RevenueCat — for mobile in-app subscriptions</h2>
        <p>
          If your app charges through the App Store or Google Play, you&apos;re
          bound by their in-app purchase systems. <strong>RevenueCat</strong> sits
          on top and manages entitlements, receipts and analytics across both
          stores.
        </p>
        <ul>
          <li>Free under $2,500/mo of tracked revenue, then 1%.</li>
          <li>
            That 1% is on <em>gross</em> revenue and stacks{" "}
            <strong>on top of</strong> Apple/Google&apos;s 15–30% cut — don&apos;t
            forget it in your margins.
          </li>
          <li>Works fine from countries where Stripe doesn&apos;t onboard.</li>
        </ul>

        <h2>Paddle — for web SaaS billing</h2>
        <p>
          <strong>Paddle</strong> is a Merchant of Record: it becomes the seller,
          handles global card processing and — the real value — worldwide VAT/tax
          compliance. No monthly fee; it takes a revenue share per sale.
        </p>
        <ul>
          <li>Best when you sell a web product/subscription to customers globally.</li>
          <li>Handles tax so you never register in dozens of jurisdictions.</li>
          <li>Onboards businesses in regions Stripe won&apos;t, e.g. Pakistan.</li>
        </ul>

        <h2>The one-line answer</h2>
        <blockquote>
          Mobile app with subscriptions → <strong>RevenueCat</strong>. Web
          app/SaaS → <strong>Paddle</strong> (or Lemon Squeezy). Both →
          you&apos;ll likely use each for its own surface.
        </blockquote>
        <p>
          Not sure which surface you&apos;re even on yet? Describe the app and
          let the finder sort the platform and payment logic out for you.
        </p>
        <TryTool />
      </>
    ),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allPostSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
