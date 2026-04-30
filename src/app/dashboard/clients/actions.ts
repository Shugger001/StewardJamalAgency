"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export type CreateClientActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCreateClientState: CreateClientActionState = {
  status: "idle",
  message: "",
};

function asRequiredString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized : null;
}

export async function createClientAction(
  _prevState: CreateClientActionState,
  formData: FormData,
): Promise<CreateClientActionState> {
  if (!hasSupabaseServerEnv()) {
    return {
      status: "error",
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const businessName = asRequiredString(formData.get("businessName"));
  const email = asOptionalString(formData.get("email"));

  if (!businessName) {
    return {
      status: "error",
      message: "Business name is required.",
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const insertResult = await supabase.from("clients").insert({
      business_name: businessName,
      email,
    });

    if (insertResult.error) {
      throw insertResult.error;
    }

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/websites");
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/settings");

    return {
      status: "success",
      message: "Client added successfully.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add client.";
    return {
      status: "error",
      message,
    };
  }
}
