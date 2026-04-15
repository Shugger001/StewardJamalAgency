import { sendEmail } from "@/lib/email";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CreateNotificationArgs = {
  userId: string;
  title: string;
  message: string;
};

export async function createInAppNotification({
  userId,
  title,
  message,
}: CreateNotificationArgs) {
  const supabase = createSupabaseServerClient();
  const insert = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    read: false,
  });
  if (insert.error) {
    throw new Error(insert.error.message);
  }
}

async function resolveRecipientEmail(userId: string) {
  const supabase = createSupabaseServerClient();

  // Prefer profile email if available.
  const profile = await supabase.from("profiles").select("email").eq("id", userId).maybeSingle();
  if (!profile.error && profile.data && typeof profile.data.email === "string") {
    return profile.data.email;
  }

  // Fallback: clients.email if schema has it.
  const client = await supabase.from("clients").select("email").eq("id", userId).maybeSingle();
  if (!client.error && client.data && typeof client.data.email === "string") {
    return client.data.email;
  }

  return null;
}

export async function notifyUser({
  userId,
  title,
  message,
  emailSubject,
  emailHtml,
}: CreateNotificationArgs & {
  emailSubject: string;
  emailHtml: string;
}) {
  await createInAppNotification({ userId, title, message });

  const email = await resolveRecipientEmail(userId);
  if (!email) return;

  await sendEmail({
    to: email,
    subject: emailSubject,
    html: emailHtml,
  });
}
