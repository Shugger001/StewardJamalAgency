"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export type CreateWebsiteActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCreateWebsiteState: CreateWebsiteActionState = {
  status: "idle",
  message: "",
};

function asRequiredString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createWebsiteAction(
  _prevState: CreateWebsiteActionState,
  formData: FormData,
): Promise<CreateWebsiteActionState> {
  if (!hasSupabaseServerEnv()) {
    return {
      status: "error",
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const name = asRequiredString(formData.get("name"));
  const clientId = asRequiredString(formData.get("clientId"));
  const status = asRequiredString(formData.get("status"));

  if (!name || !clientId || !status) {
    return {
      status: "error",
      message: "Website name, client, and status are required.",
    };
  }

  if (status !== "draft" && status !== "published") {
    return {
      status: "error",
      message: "Status must be draft or published.",
    };
  }

  const supabase = createSupabaseServerClient();

  let websiteId: string | null = null;
  let homePageId: string | null = null;

  try {
    // STEP 1: Create website
    const websiteInsert = await supabase
      .from("websites")
      .insert({
        name,
        client_id: clientId,
        status,
      })
      .select("id")
      .single();

    if (websiteInsert.error) {
      throw websiteInsert.error;
    }

    websiteId = websiteInsert.data.id;

    // STEP 2: Create homepage
    const pageInsert = await supabase
      .from("pages")
      .insert({
        name: "Home",
        slug: "/",
        website_id: websiteId,
      })
      .select("id")
      .single();

    if (pageInsert.error) {
      throw pageInsert.error;
    }

    homePageId = pageInsert.data.id;

    // STEP 3: Create default sections
    const sectionInsert = await supabase
      .from("sections")
      .insert([
        { page_id: homePageId, type: "hero", position: 1 },
        { page_id: homePageId, type: "features", position: 2 },
      ])
      .select("id, type");

    if (sectionInsert.error) {
      throw sectionInsert.error;
    }

    const heroSection = sectionInsert.data.find((section) => section.type === "hero");
    const featuresSection = sectionInsert.data.find(
      (section) => section.type === "features",
    );

    if (!heroSection || !featuresSection) {
      throw new Error("Failed to create default sections.");
    }

    // STEP 4: Create content blocks
    const contentInsert = await supabase.from("content_blocks").insert([
      {
        section_id: heroSection.id,
        key: "title",
        value: "Welcome to your new website",
      },
      {
        section_id: heroSection.id,
        key: "subtitle",
        value: "We build powerful digital experiences",
      },
      {
        section_id: featuresSection.id,
        key: "title",
        value: "Our Services",
      },
      {
        section_id: featuresSection.id,
        key: "description",
        value: "We deliver high-quality solutions",
      },
    ]);

    if (contentInsert.error) {
      throw contentInsert.error;
    }

    revalidatePath("/dashboard/websites");

    return {
      status: "success",
      message: "Website created with homepage and starter content.",
    };
  } catch (error) {
    // Best-effort cleanup to avoid partial records when a later step fails.
    if (websiteId) {
      await supabase.from("websites").delete().eq("id", websiteId);
    }

    const message =
      error instanceof Error ? error.message : "Failed to create website.";
    return {
      status: "error",
      message,
    };
  }
}
