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
    throw new Error("Missing RESEND_API_KEY.");
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

  return result.data;
}
