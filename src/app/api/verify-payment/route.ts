import { NextResponse } from "next/server";
import { notifyUser } from "@/lib/notifications/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type VerifyBody = {
  reference?: string;
  client_id?: string;
  amount?: number;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as VerifyBody | null;
  const reference = body?.reference?.trim();
  const clientId = body?.client_id?.trim();
  const amount = body?.amount;

  if (!reference || !clientId || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Missing Paystack secret key." }, { status: 500 });
  }

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const verifyPayload = (await verifyRes.json().catch(() => null)) as
    | {
        status?: boolean;
        data?: {
          status?: string;
          reference?: string;
          amount?: number;
        };
      }
    | null;

  if (!verifyRes.ok || !verifyPayload?.status || verifyPayload.data?.status !== "success") {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const verifiedAmount = (verifyPayload.data?.amount ?? 0) / 100;
  if (verifiedAmount !== amount) {
    return NextResponse.json({ error: "Amount mismatch." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  // Idempotency: avoid duplicate writes for same reference.
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
    }).catch(() => {
      // Keep payment success path stable even if notification/email fails.
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
