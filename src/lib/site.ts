// ── Central site configuration ─────────────────────────────────────────
// One place for brand, URLs, nav, and the devAge lead-gen contact points.
// Everything user-facing (metadata, sitemap, header, footer) reads from here.

export const SITE = {
  name: "Devklar",
  parent: "devAge",
  // Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the environment for deploys.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://devklar.devage.dev").replace(
    /\/$/,
    "",
  ),
  tagline: "The right stack for your app idea — verified, region-aware, free-first.",
  description:
    "Describe your app idea and get a verified, region-aware, free-first tech stack in seconds. Devklar knows which payment gateways, databases, and AI APIs actually work in Pakistan, India, Bangladesh, Nigeria and beyond — and exactly when each free tier runs out.",
  // Agency lead-gen (the monetization model): where "get it built" CTAs point.
  contactEmail: "hello@devage.dev",
  agencyName: "devAge",
  agencyUrl: "https://devage.dev",
  agencyCtaText: "Get this built by devAge",

  // Primary navigation (header).
  nav: [
    { href: "/", label: "Stack finder" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/blog", label: "Guides" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ] as { href: string; label: string }[],

  // Footer link groups.
  footer: [
    {
      title: "Product",
      links: [
        { href: "/", label: "Stack finder" },
        { href: "/how-it-works", label: "How it works" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Guides",
      links: [
        { href: "/blog", label: "All guides" },
        {
          href: "/blog/best-payment-gateway-saas-pakistan",
          label: "Payments in Pakistan",
        },
        { href: "/blog/free-tier-ai-app-stack", label: "Free-tier AI stack" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Devklar" },
        { href: "/contact", label: "Work with devAge" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ] as { title: string; links: { href: string; label: string }[] }[],
} as const;

export const SITE_URL = SITE.url;
