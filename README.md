# Devklar

**A free tool that recommends a verified, region-aware, free-first tech stack based on what you want to build.** Describe your app idea in one sentence and Devklar returns the tools to build it with — picks that are hand-verified, aware of which payment gateways and services actually work in your country, and free-first (with an honest note on exactly when each free tier ends).

## Live demo

👉 **[ADD LIVE URL HERE]**

## Why this exists

Plenty of developers know *how* to code but get stuck on *what to build with* — which tools are actually free to start, which ones are even available in their country (Stripe, for example, won't onboard merchants in Pakistan, Bangladesh, or Nigeria), and which are worth starting with. Most "best tools" lists are written from a Silicon Valley default and quietly ignore all three questions. Devklar is a free showcase project by **devAge** that answers them honestly: only verified tools, real regional rules, and free tiers with their expiry dates shown up front.

## How it works

The LLM only **extracts** structured tags from your free text; deterministic **code** does the matching against a hand-verified database. That separation keeps recommendations consistent and defensible — the same input always yields the same stack.

```
search box → extract (Claude) → confirm screen → match (pure code) → stack card
```

## Tech stack

- **[Next.js 15](https://nextjs.org/)** (App Router) + **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Anthropic SDK](https://docs.anthropic.com/)** — Claude reads app ideas into tags (server-side only)

No database or user accounts: the ~66-tool catalog is plain data in `src/lib/database.ts`, and matching is pure TypeScript.

## Getting started

```bash
# 1. Clone
git clone <your-fork-url>
cd devklar

# 2. Install
npm install

# 3. Configure — copy the example env and add your key
cp .env.example .env.local
#   then edit .env.local and set ANTHROPIC_API_KEY (from
#   https://console.anthropic.com/settings/keys). It's server-side only and
#   never exposed to the browser. .env.local is git-ignored.

# 4. Run locally
npm run dev
#   open http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint`, `npm run typecheck`, and `npm run check-keys` (validates whichever provider keys are set, with a no-cost call).

## The tools database

The recommendation engine is only as good as its data, so every tool in `src/lib/database.ts` is **manually verified and carries a `last_verified_at` date** — free-tier numbers and regional availability drift every quarter, and the date is the mechanism that keeps the tool honest. Nothing is ever guessed; when there's no verified pick for a need, Devklar says so rather than inventing one.

**Spotted something out of date or wrong?** Please [open an issue](../../issues/new?template=outdated-tool.md) using the "Outdated / incorrect tool" template — corrections with a source link are hugely appreciated and keep the database trustworthy.

## License

Released under the [MIT License](./LICENSE).

---

Built by **devAge** — [ADD DEVAGE URL HERE]
