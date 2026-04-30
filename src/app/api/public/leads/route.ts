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
  website?: string; // honeypot
};

function sanitize(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json({ error: "Server is not configured yet." }, { status: 500 });
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

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

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

  await sendEmail({
    to: adminLeadEmail,
    subject: `New project request from ${name}`,
    html,
  }).catch(() => {
    // Keep lead capture successful even if email provider is unavailable.
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
