import { Resend } from "resend";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const senderEmail = process.env.RESEND_FROM_EMAIL ?? "no-reply@stewardjamal.agency";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (!resend) {
    return { skipped: true as const, reason: "Missing RESEND_API_KEY." };
  }

  const result = await resend.emails.send({
    from: senderEmail,
    to,
    subject,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { skipped: false as const, data: result.data };
}
