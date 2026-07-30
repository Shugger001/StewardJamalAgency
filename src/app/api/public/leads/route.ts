import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type LeadPayload = {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  website?: string;
};

const rateBucket = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

function sanitize(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateBucket.get(key);
  if (!entry || entry.resetAt <= now) {
    rateBucket.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json({ error: "Server is not configured yet." }, { status: 500 });
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as LeadPayload;
  const name = sanitize(body.name);
  const email = sanitize(body.email).toLowerCase();
  const company = sanitize(body.company);
  const service = sanitize(body.service);
  const budget = sanitize(body.budget);
  const timeline = sanitize(body.timeline);
  const message = sanitize(body.message);
  const honeypot = sanitize(body.website);

  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !service || !message) {
    return NextResponse.json(
      { error: "Name, email, service and message are required." },
      { status: 400 },
    );
  }

  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const result = await supabase.from("leads").insert({
    name,
    email,
    company: company || null,
    service,
    budget: budget || null,
    timeline: timeline || null,
    message,
    status: "new",
  });
  const dbError = result.error?.message ?? null;

  const adminLeadEmail = process.env.LEADS_ALERT_EMAIL ?? "stewardjamalagency@gmail.com";
  const safe = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const submittedAt = new Date().toLocaleString("en-GH", { timeZone: "Africa/Accra" });
  const html = `
    <h2>New Project Request</h2>
    <p>A new lead was submitted from the public website.</p>
    <ul>
      <li><strong>Name:</strong> ${safe(name)}</li>
      <li><strong>Email:</strong> ${safe(email)}</li>
      <li><strong>Company:</strong> ${safe(company || "—")}</li>
      <li><strong>Service:</strong> ${safe(service)}</li>
      <li><strong>Budget:</strong> ${safe(budget || "Not specified")}</li>
      <li><strong>Timeline:</strong> ${safe(timeline || "Not specified")}</li>
      <li><strong>Submitted:</strong> ${safe(submittedAt)}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${safe(message)}</p>
  `;

  const emailResult = await sendEmail({
    to: adminLeadEmail,
    subject: `New project request from ${name}`,
    html,
  }).catch(() => ({ skipped: true as const, reason: "Email send failed." }));

  if (dbError) {
    const missingLeadsTable =
      dbError.includes("Could not find the table 'public.leads'") ||
      dbError.includes('relation "leads" does not exist');

    if (missingLeadsTable) {
      return NextResponse.json(
        {
          ok: true,
          warning:
            "Lead received, but database table is missing. Run supabase/setup_all.sql in the Supabase SQL editor.",
          emailSent: !("skipped" in emailResult && emailResult.skipped),
        },
        { status: 201 },
      );
    }

    return NextResponse.json({ error: dbError }, { status: 400 });
  }

  return NextResponse.json(
    { ok: true, emailSent: !("skipped" in emailResult && emailResult.skipped) },
    { status: 201 },
  );
}
