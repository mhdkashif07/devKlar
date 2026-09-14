// ── Copy-paste starter prompt for Claude Code / Cursor ─────────────────
// Turns the chosen stack into a ready scaffolding prompt. This is a headline
// feature: it converts advice into momentum for a "don't know where to start"
// user. Built entirely from the matcher's chosen tools — no new claims.

import { CAPABILITY_LABELS, type ExtractedTags, type MatchResult } from "./types";

export function buildStarterPrompt(
  tags: ExtractedTags,
  result: MatchResult,
): string {
  const lines: string[] = [];

  const platformLabel =
    tags.platform === "both"
      ? "web + mobile"
      : tags.platform === "mobile"
        ? "mobile"
        : "web";
  const fw =
    tags.platform !== "web" && tags.mobile_framework && tags.mobile_framework !== "unsure"
      ? ` (${tags.mobile_framework})`
      : "";

  const summary = (tags.summary || "an app").trim().replace(/[.\s]+$/, "");
  lines.push(`I'm building ${summary}. It's a ${platformLabel}${fw} app.`);
  lines.push("");
  lines.push("Scaffold a starter project using exactly this verified, free-first stack:");
  lines.push("");

  for (const block of result.stack) {
    const label = CAPABILITY_LABELS[block.capability];
    if (block.picks.length === 0) {
      lines.push(`- ${label}: (no verified pick yet — leave a TODO for me to choose)`);
      continue;
    }
    const primary = block.picks[0];
    const alt = block.picks[1] ? ` (alternative: ${block.picks[1].name})` : "";
    lines.push(`- ${label}: ${primary.name}${alt}`);
  }

  if (result.unmatched.length > 0) {
    lines.push("");
    lines.push(
      `The following needs aren't covered yet — add clearly-marked TODO placeholders for them: ${result.unmatched.join(", ")}.`,
    );
  }

  lines.push("");
  lines.push("Please:");
  lines.push("1. Set up the project structure and install the SDKs for each tool above.");
  lines.push("2. Add a .env.example listing every API key I'll need, with a comment per key.");
  lines.push("3. Wire up a minimal working example for each capability (not just boilerplate).");
  lines.push("4. Keep all API keys server-side; never expose them to the client.");

  if (result.warnings.length > 0) {
    lines.push("");
    lines.push("Important regional notes to respect:");
    for (const w of result.warnings) lines.push(`- ${w}`);
  }

  return lines.join("\n");
}
