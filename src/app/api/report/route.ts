// ── POST /api/report ────────────────────────────────────────────────────
// "Report outdated" + "no verified pick" miss logging. For the MVP this just
// logs server-side (visible in your hosting logs) — the honest mechanism that
// tells you what to re-verify or add next. Swap console for a DB/webhook later.

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      type?: string;
      toolId?: string;
      capability?: string;
      note?: string;
    };
    console.log("[report]", {
      type: body.type ?? "unknown",
      toolId: body.toolId ?? null,
      capability: body.capability ?? null,
      note: (body.note ?? "").slice(0, 500),
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
