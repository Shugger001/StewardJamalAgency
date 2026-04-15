import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { EditableBlock } from "@/components/editor/use-editor-store";
import { FeaturesSection } from "@/components/sections/features";
import { HeroSection } from "@/components/sections/hero";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

type DbRow = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

async function loadWebsiteData(id: string) {
  const supabase = createSupabaseServerClient();

  const byId = await supabase.from("websites").select("*").eq("id", id).maybeSingle();
  const byDomain =
    byId.data || byId.error
      ? null
      : await supabase.from("websites").select("*").eq("domain", id).maybeSingle();
  const websiteData = byId.data ?? byDomain?.data ?? null;
  if (!websiteData) return null;

  const website = websiteData as DbRow;
  const websiteName = asString(website.name, "Website");
  const websiteId = String(website.id);

  const pagesQuery = await supabase
    .from("pages")
    .select("*")
    .eq("website_id", websiteId)
    .order("created_at", { ascending: true });
  if (pagesQuery.error) return null;

  const pageIds = ((pagesQuery.data ?? []) as DbRow[]).map((page) => String(page.id));

  const sectionsQuery = pageIds.length
    ? await supabase
        .from("sections")
        .select("*")
        .in("page_id", pageIds)
        .order("position", { ascending: true })
    : { data: [], error: null };
  if (sectionsQuery.error) return null;

  const sections = ((sectionsQuery.data ?? []) as DbRow[]).map((section) => ({
    id: String(section.id),
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
  if (blocksQuery.error) return null;

  const blocks = ((blocksQuery.data ?? []) as DbRow[]).map(
    (block): EditableBlock => ({
      id: String(block.id),
      key: asString(block.key),
      type: asString(block.type) === "image" ? "image" : "text",
      value: asString(block.value),
      sectionId: String(block.section_id),
    }),
  );

  return { websiteName, sections, blocks };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await loadWebsiteData(id);
  if (!data) {
    return {
      title: "Site not found",
      description: "Requested website could not be found.",
    };
  }

  const heroTitle = data.blocks.find((block) => block.key === "title")?.value;
  const heroSubtitle =
    data.blocks.find((block) => block.key === "subtitle")?.value ??
    data.blocks.find((block) => block.key === "description")?.value;

  return {
    title: heroTitle || data.websiteName,
    description: heroSubtitle || `Public website for ${data.websiteName}`,
  };
}

export default async function PublicWebsitePage({ params }: Props) {
  const { id } = await params;
  const data = await loadWebsiteData(id);
  if (!data) notFound();

  const blocksBySection = data.blocks.reduce<Map<string, EditableBlock[]>>((acc, block) => {
    const current = acc.get(block.sectionId) ?? [];
    current.push(block);
    acc.set(block.sectionId, current);
    return acc;
  }, new Map());

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {data.sections.map((section) => {
          const sectionBlocks = blocksBySection.get(section.id) ?? [];

          if (section.type === "hero") {
            return (
              <HeroSection
                key={section.id}
                sectionId={section.id}
                blocks={sectionBlocks}
                selectedBlockId={null}
                dirtyBlockIds={new Set()}
                onSelectBlock={() => {}}
                canEdit={false}
              />
            );
          }

          if (section.type === "features") {
            return (
              <FeaturesSection
                key={section.id}
                sectionId={section.id}
                blocks={sectionBlocks}
                selectedBlockId={null}
                dirtyBlockIds={new Set()}
                onSelectBlock={() => {}}
                canEdit={false}
              />
            );
          }

          return (
            <section
              key={section.id}
              className="rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-500"
            >
              Section type {section.type} is not publicly mapped yet.
            </section>
          );
        })}
      </div>
    </main>
  );
}
