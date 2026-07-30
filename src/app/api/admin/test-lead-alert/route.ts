import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { getResendFromEmail, isResendConfigured, sendEmail } from "@/lib/email";

export async function POST() {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(role === "admin" || role === "staff")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!isResendConfigured()) {
    return NextResponse.json(
      {
        error:
          "RESEND_API_KEY is not set on this deployment. Add it in Vercel (and verify RESEND_FROM_EMAIL domain), then redeploy.",
        code: "missing_resend_api_key",
      },
      { status: 503 },
    );
  }

  const to = process.env.LEADS_ALERT_EMAIL ?? "stewardjamalagency@gmail.com";
  const support = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "stewardjamalagency@gmail.com";
  const sentAt = new Date().toLocaleString("en-GH", { timeZone: "Africa/Accra" });

  try {
    const result = await sendEmail({
      to,
      subject: "Test lead-alert email · Steward Jamal Agency",
      html: `
        <h2>Lead alert test</h2>
        <p>This confirms Resend delivery for project-request alerts.</p>
        <p><strong>Sent at:</strong> ${sentAt}</p>
        <p><strong>From:</strong> ${getResendFromEmail()}</p>
        <p>Next step: submit the public contact form and confirm a live lead arrives in this inbox.</p>
        <p>Support: <a href="mailto:${support}">${support}</a></p>
      `,
    });

    if ("skipped" in result && result.skipped) {
      return NextResponse.json({ error: result.reason, code: "skipped" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, to }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send test lead-alert email.",
        code: "send_failed",
      },
      { status: 500 },
    );
  }
}
