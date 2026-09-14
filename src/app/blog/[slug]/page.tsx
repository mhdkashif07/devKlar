import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadCTA from "@/components/LeadCTA";
import { allPostSlugs, getPost } from "@/lib/blog";
import { SITE, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return allPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Guide not found" };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: SITE.parent, url: SITE.agencyUrl },
    publisher: { "@type": "Organization", name: SITE.parent },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
      >
        <span aria-hidden>←</span> All guides
      </Link>

      <article className="mt-6 animate-rise">
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
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-[13px] text-[var(--color-muted)]">
          {formatDate(post.date)} · {post.readingTime} · by {SITE.parent}
        </p>

        <div className="prose mt-8">{post.content}</div>
      </article>

      <div className="mt-14">
        <LeadCTA
          heading="Want this built, not just planned?"
          sub={`${SITE.parent} builds production apps on exactly these stacks — regional payments included. Share your idea and get a plan and a quote.`}
        />
      </div>
    </main>
  );
}
