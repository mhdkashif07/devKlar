// ── POST /api/lead ──────────────────────────────────────────────────────
// Receives an agency lead from the contact form. For the MVP this validates
// and logs server-side (visible in your hosting logs). To actually get the
// lead in your inbox, wire an email provider (e.g. Resend) or a webhook where
// marked below — the shape is already here.

import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface LeadBody {
  name?: string;
  email?: string;
  idea?: string;
  budget?: string;
  timeline?: string;
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const idea = (body.idea ?? "").trim();

  if (!isEmail(email) || idea.length < 3) {
    return NextResponse.json(
      { ok: false, error: "A valid email and a short description are required." },
      { status: 422 },
    );
  }

  const lead = {
    name: (body.name ?? "").slice(0, 120),
    email: email.slice(0, 200),
    idea: idea.slice(0, 2000),
    budget: (body.budget ?? "").slice(0, 60),
    timeline: (body.timeline ?? "").slice(0, 120),
    at: new Date().toISOString(),
  };

  // TODO(devAge): forward this lead to your inbox. Examples:
  //   - Resend:   await fetch("https://api.resend.com/emails", { ... })
  //   - Webhook:  await fetch(process.env.LEAD_WEBHOOK_URL!, { method: "POST", body: JSON.stringify(lead) })
  // Until then, it's logged so nothing is lost during launch.
  console.log("[lead]", lead);

  return NextResponse.json({ ok: true });
}
