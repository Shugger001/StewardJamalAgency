import { createClient } from "@supabase/supabase-js";
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

async function resolveAuthUserIdFromClientId(clientId: string): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const client = await supabase
    .from("clients")
    .select("id, user_id, email")
    .eq("id", clientId)
    .maybeSingle();

  if (client.error || !client.data) return null;

  const linkedUserId =
    typeof client.data.user_id === "string" && client.data.user_id ? client.data.user_id : null;
  if (linkedUserId) return linkedUserId;

  const email = typeof client.data.email === "string" ? client.data.email.trim().toLowerCase() : "";
  if (!email) return null;

  const byProfile = await supabase.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (!byProfile.error && byProfile.data?.id) return String(byProfile.data.id);

  const { resolveAuthUserIdByEmail } = await import("@/lib/clients/link");
  return resolveAuthUserIdByEmail(email);
}

async function resolveRecipientEmail(userId: string) {
  const supabase = createSupabaseServerClient();

  const profile = await supabase.from("profiles").select("email").eq("id", userId).maybeSingle();
  if (!profile.error && profile.data && typeof profile.data.email === "string" && profile.data.email) {
    return profile.data.email;
  }

  const clientByUser = await supabase.from("clients").select("email").eq("user_id", userId).maybeSingle();
  if (
    !clientByUser.error &&
    clientByUser.data &&
    typeof clientByUser.data.email === "string" &&
    clientByUser.data.email
  ) {
    return clientByUser.data.email;
  }

  const clientById = await supabase.from("clients").select("email").eq("id", userId).maybeSingle();
  if (
    !clientById.error &&
    clientById.data &&
    typeof clientById.data.email === "string" &&
    clientById.data.email
  ) {
    return clientById.data.email;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceRole) {
    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const user = await admin.auth.admin.getUserById(userId);
    if (user.data.user?.email) return user.data.user.email;
  }

  return null;
}

/**
 * Notify a recipient. `userId` may be an auth user id OR a clients.id (admin form).
 */
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
  const authUserId = (await resolveAuthUserIdFromClientId(userId)) ?? userId;

  try {
    await createInAppNotification({ userId: authUserId, title, message });
  } catch {
    // Still attempt email if in-app write fails (e.g. missing notifications table).
  }

  const email = await resolveRecipientEmail(authUserId);
  if (!email) {
    const fallback = await resolveRecipientEmail(userId);
    if (!fallback) return;
    await sendEmail({
      to: fallback,
      subject: emailSubject,
      html: emailHtml,
    }).catch(() => undefined);
    return;
  }

  await sendEmail({
    to: email,
    subject: emailSubject,
    html: emailHtml,
  }).catch(() => {
    // Notification path stays resilient when Resend is unset.
  });
}
