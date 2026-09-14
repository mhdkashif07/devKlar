// ── POST /api/extract ──────────────────────────────────────────────────
// Server-only. Takes { idea } and returns validated tags. The Anthropic key
// lives here and never reaches the browser.

import { NextResponse } from "next/server";
import { extractTags } from "@/lib/extract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let idea = "";
  try {
    const body = (await req.json()) as { idea?: unknown };
    if (typeof body.idea === "string") idea = body.idea;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  try {
    const result = await extractTags(idea);
    return NextResponse.json(result);
  } catch (err) {
    // extractTags handles its own failure modes; this is a last-resort guard.
    console.error("[extract] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong extracting your idea." },
      { status: 500 },
    );
  }
}
