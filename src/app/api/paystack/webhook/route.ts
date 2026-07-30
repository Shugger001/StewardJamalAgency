import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { notifyUser } from "@/lib/notifications/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PaystackWebhook = {
  event?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    metadata?: {
      client_id?: string;
    };
  };
};

function isValidSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("[paystack.webhook] missing_secret");
    return NextResponse.json({ error: "Missing Paystack secret key." }, { status: 500 });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  if (!isValidSignature(raw, signature, secret)) {
    console.warn("[paystack.webhook] invalid_signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(raw) as PaystackWebhook;
  if (payload.event !== "charge.success" || payload.data?.status !== "success") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const reference = payload.data.reference?.trim();
  const amount = (payload.data.amount ?? 0) / 100;
  const clientId = payload.data.metadata?.client_id?.trim();

  if (!reference || !clientId || amount <= 0) {
    console.warn("[paystack.webhook] incomplete_payload", { reference, clientId, amount });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const supabase = createSupabaseServerClient();
  const existing = await supabase
    .from("payments")
    .select("id")
    .eq("reference", reference)
    .limit(1)
    .maybeSingle();

  if (existing.error) {
    console.error("[paystack.webhook] lookup_failed", {
      reference,
      clientId,
      message: existing.error.message,
    });
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  if (existing.data) {
    console.info("[paystack.webhook] duplicate_ignored", {
      reference,
      clientId,
      paymentId: existing.data.id,
    });
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  const insert = await supabase.from("payments").insert({
    client_id: clientId,
    amount,
    status: "success",
    reference,
  });

  if (insert.error) {
    // Unique reference race: treat as idempotent success.
    if (insert.error.message.toLowerCase().includes("duplicate") || insert.error.code === "23505") {
      console.info("[paystack.webhook] duplicate_race", { reference, clientId });
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }
    console.error("[paystack.webhook] insert_failed", {
      reference,
      clientId,
      message: insert.error.message,
    });
    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  console.info("[paystack.webhook] payment_recorded", { reference, clientId, amount });

  await notifyUser({
    userId: clientId,
    title: "Payment successful",
    message: "Your payment has been received and recorded successfully.",
    emailSubject: "Payment received · Steward Jamal Agency",
    emailHtml: `
      <p>Your payment has been received successfully.</p>
      <p>Reference: <strong>${reference}</strong></p>
      <p>Next step: check your client dashboard for the updated payment record.</p>
      <p>Questions? Email <a href="mailto:stewardjamalagency@gmail.com">stewardjamalagency@gmail.com</a>.</p>
    `,
  }).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 200 });
}
