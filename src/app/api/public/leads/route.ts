import { NextResponse } from "next/server";
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

  return NextResponse.json({ ok: true }, { status: 201 });
}
