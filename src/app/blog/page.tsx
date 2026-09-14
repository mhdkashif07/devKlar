import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import LeadCTA from "@/components/LeadCTA";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical, region-aware guides on building apps: payment gateways that work in Pakistan, free-tier AI stacks, and choosing between tools.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <PageHero
        eyebrow="Guides"
        title="Straight answers on building apps"
        sub="No fluff — practical, verified guidance on stacks, payments, and free tiers, with a focus on the regions most lists ignore."
      />

      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 transition hover:border-[var(--color-border-2)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--color-ink)] transition group-hover:text-[var(--color-accent)]">
              {post.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              {post.description}
            </p>
            <p className="mt-3 text-[12px] text-[var(--color-muted)]">
              {formatDate(post.date)} · {post.readingTime}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <LeadCTA />
      </div>
    </main>
  );
}
