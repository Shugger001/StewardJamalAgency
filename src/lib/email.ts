import { Resend } from "resend";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const senderEmail = process.env.RESEND_FROM_EMAIL ?? "no-reply@stewardjamal.agency";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function isResendConfigured() {
  return Boolean(resendApiKey);
}

export function getResendFromEmail() {
  return senderEmail;
}

/**
 * Send transactional email via Resend. Returns skipped when API key is missing
 * so callers can distinguish config gaps from provider failures.
 */
export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (!resend) {
    console.info("[email] skipped", { reason: "missing_resend_api_key", to, subject });
    return { skipped: true as const, reason: "Missing RESEND_API_KEY." };
  }

  const result = await resend.emails.send({
    from: senderEmail,
    to,
    subject,
    html,
  });

  if (result.error) {
    console.error("[email] send_failed", {
      to,
      subject,
      from: senderEmail,
      message: result.error.message,
    });
    throw new Error(result.error.message);
  }

  console.info("[email] sent", { to, subject, id: result.data?.id ?? null });
  return { skipped: false as const, data: result.data };
}
