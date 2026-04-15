import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { WebsiteEditor } from "@/components/editor/website-editor";
import { resolveRoleFromRequest } from "@/lib/auth/role";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

type DbRecord = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBlockType(value: unknown): "text" | "image" {
  return value === "image" ? "image" : "text";
}

export default async function WebsiteEditorPage({ params }: Props) {
  const { id } = await params;
  const role = resolveRoleFromRequest(await cookies(), await headers());

  const supabase = createSupabaseServerClient();

  const websiteQuery = await supabase.from("websites").select("*").eq("id", id).single();
  if (websiteQuery.error || !websiteQuery.data) {
    notFound();
  }

  const website = websiteQuery.data as DbRecord;
  const websiteName =
    asString(website.name) || asString(website.website_name) || "Untitled website";

  const pagesQuery = await supabase
    .from("pages")
    .select("*")
    .eq("website_id", id)
    .order("created_at", { ascending: true });

  if (pagesQuery.error) {
    throw new Error(`Failed to load pages: ${pagesQuery.error.message}`);
  }

  const pages = (pagesQuery.data ?? []) as DbRecord[];
  const pageIds = pages.map((page) => String(page.id));

  const sectionsQuery = pageIds.length
    ? await supabase
        .from("sections")
        .select("*")
        .in("page_id", pageIds)
        .order("position", { ascending: true })
    : { data: [], error: null };

  if (sectionsQuery.error) {
    throw new Error(`Failed to load sections: ${sectionsQuery.error.message}`);
  }

  const sections = ((sectionsQuery.data ?? []) as DbRecord[]).map((section) => ({
    id: String(section.id),
    pageId: String(section.page_id),
    type: asString(section.type),
    position: typeof section.position === "number" ? section.position : 0,
  }));

  const sectionIds = sections.map((section) => section.id);

  const blocksQuery = sectionIds.length
    ? await supabase
        .from("content_blocks")
        .select("*")
        .in("section_id", sectionIds)
        .order("created_at", { ascending: true })
    : { data: [], error: null };

  if (blocksQuery.error) {
    throw new Error(`Failed to load content blocks: ${blocksQuery.error.message}`);
  }

  const blocks = ((blocksQuery.data ?? []) as DbRecord[]).map((block) => ({
    id: String(block.id),
    key: asString(block.key),
    type: asBlockType(block.type),
    value: asString(block.value),
    sectionId: String(block.section_id),
  }));

  return (
    <div className="mx-auto max-w-7xl px-1 py-2">
      <WebsiteEditor
        websiteId={id}
        websiteName={websiteName}
        role={role}
        enableDevRoleSwitcher={process.env.NODE_ENV === "development"}
        sections={sections}
        blocks={blocks}
      />
    </div>
  );
}
