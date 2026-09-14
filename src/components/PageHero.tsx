export default function PageHero({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="animate-rise">
      {eyebrow && (
        <p className="text-sm font-medium text-[var(--color-accent)]">{eyebrow}</p>
      )}
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
        {title}
      </h1>
      {sub && (
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-2)]">
          {sub}
        </p>
      )}
    </div>
  );
}
