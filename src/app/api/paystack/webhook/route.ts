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
    return NextResponse.json({ error: "Missing Paystack secret key." }, { status: 500 });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  if (!isValidSignature(raw, signature, secret)) {
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
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  if (!existing.data) {
    const insert = await supabase.from("payments").insert({
      client_id: clientId,
      amount,
      status: "success",
      reference,
    });

    if (insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }

    await notifyUser({
      userId: clientId,
      title: "Payment successful",
      message: "Your payment has been received and recorded successfully.",
      emailSubject: "Payment received",
      emailHtml:
        "<p>Your payment has been received successfully.</p><p>Thank you for choosing Steward Jamal Agency.</p>",
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
