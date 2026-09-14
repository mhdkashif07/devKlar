#!/usr/bin/env node
// ── API key checker ─────────────────────────────────────────────────────
// Validates the API keys this project (and friends) might use, WITHOUT
// spending tokens — each check is a cheap "list models" GET.
//
//   node scripts/check-keys.mjs        # or: npm run check-keys
//
// Keys are read from the environment, falling back to .env.local. Nothing is
// sent anywhere except the provider's own API. Keys are masked in output.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── tiny .env.local loader (no dependency) — never overrides real env vars ──
function loadEnvFile(name) {
  try {
    const raw = readFileSync(join(ROOT, name), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue; // skip blanks / comments
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* file absent — that's fine */
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

// ── presentation helpers ────────────────────────────────────────────────
const useColor = process.stdout.isTTY;
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const green = (s) => c("32", s);
const red = (s) => c("31", s);
const yellow = (s) => c("33", s);
const dim = (s) => c("2", s);

function mask(key) {
  if (!key) return "";
  if (key.length <= 12) return "••••";
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

// Map an HTTP status to a verdict.
function verdict(status) {
  if (status === 200) return { ok: true, label: green("✓ valid") };
  if (status === 401)
    return { ok: false, label: red("✗ invalid / revoked key (401)") };
  if (status === 403)
    return { ok: false, label: red("✗ forbidden — key lacks permission (403)") };
  if (status === 429)
    return {
      ok: true,
      label: yellow("⚠ valid but rate-limited / no quota (429)"),
    };
  return { ok: false, label: red(`✗ unexpected status ${status}`) };
}

// ── provider definitions ─────────────────────────────────────────────────
const PROVIDERS = [
  {
    name: "Gemini (Google AI Studio)",
    env: "GEMINI_API_KEY",
    check: (key) =>
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
      ),
  },
  {
    name: "OpenAI",
    env: "OPENAI_API_KEY",
    check: (key) =>
      fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      }),
  },
  {
    name: "Anthropic (Claude)",
    env: "ANTHROPIC_API_KEY",
    check: (key) =>
      fetch("https://api.anthropic.com/v1/models", {
        headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
      }),
  },
];

async function main() {
  console.log(dim("Checking API keys (no tokens spent)…\n"));
  let anyChecked = false;
  let anyFailed = false;

  for (const p of PROVIDERS) {
    const key = process.env[p.env];
    const nameCol = p.name.padEnd(28);

    if (!key) {
      console.log(`${nameCol} ${dim(`— not set (${p.env})`)}`);
      continue;
    }
    anyChecked = true;

    let line;
    try {
      const res = await Promise.race([
        p.check(key),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error("timeout")), 15000),
        ),
      ]);
      const v = verdict(res.status);
      if (!v.ok) anyFailed = true;
      line = `${v.label}  ${dim(mask(key))}`;
    } catch (err) {
      anyFailed = true;
      line = red(`✗ request failed (${err.message})`);
    }
    console.log(`${nameCol} ${line}`);
  }

  if (!anyChecked) {
    console.log(
      yellow(
        "\nNo keys found. Set them in your environment or .env.local, e.g. GEMINI_API_KEY=…",
      ),
    );
  }
  console.log();
  // Non-zero exit if any present key failed — handy in CI / pre-deploy checks.
  process.exit(anyFailed ? 1 : 0);
}

main();
