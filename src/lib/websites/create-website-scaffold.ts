import type { SupabaseClient } from "@supabase/supabase-js";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Failed to create website.";
}

export type CreateWebsiteScaffoldInput = {
  name: string;
  clientId: string;
  status: "draft" | "published";
};

/**
 * Creates a website row plus homepage, default sections, and starter content blocks.
 * Rolls back the website row if a later step fails.
 */
export async function createWebsiteWithScaffold(
  supabase: SupabaseClient,
  input: CreateWebsiteScaffoldInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { name, clientId, status } = input;
  let websiteId: string | null = null;

  try {
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
      return { ok: false, message: errorMessage(websiteInsert.error) };
    }

    websiteId = websiteInsert.data.id;

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

    const homePageId = pageInsert.data.id;

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

    const heroSection = sectionInsert.data?.find((section) => section.type === "hero");
    const featuresSection = sectionInsert.data?.find(
      (section) => section.type === "features",
    );

    if (!heroSection || !featuresSection) {
      throw new Error("Failed to create default sections.");
    }

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

    return { ok: true };
  } catch (error) {
    if (websiteId) {
      await supabase.from("websites").delete().eq("id", websiteId);
    }
    return { ok: false, message: errorMessage(error) };
  }
}
