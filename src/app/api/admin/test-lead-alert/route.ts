import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { sendEmail } from "@/lib/email";

export async function POST() {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(role === "admin" || role === "staff")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const to = process.env.LEADS_ALERT_EMAIL ?? "stewardjamalagency@gmail.com";
  const sentAt = new Date().toLocaleString("en-GH", { timeZone: "Africa/Accra" });

  try {
    await sendEmail({
      to,
      subject: "Test lead-alert email",
      html: `
        <h2>Lead Alert Test</h2>
        <p>This is a test lead-alert email from your admin dashboard.</p>
        <p><strong>Sent at:</strong> ${sentAt}</p>
        <p>If you received this email, lead notifications are configured correctly.</p>
      `,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send test lead-alert email.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
