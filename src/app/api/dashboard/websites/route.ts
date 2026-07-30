import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Body = {
  name?: string;
  client_id?: string;
  domain?: string | null;
  status?: string;
};

function revalidateWebsitePaths(websiteId?: string) {
  revalidatePath("/dashboard/websites");
  revalidatePath("/site");
  revalidatePath("/portfolio");
  if (websiteId) {
    revalidatePath(`/dashboard/websites/${websiteId}/editor`);
    revalidatePath(`/sites/${websiteId}`);
  }
}

/**
 * Create a draft website and scaffold home page → hero + features → keyed blocks.
 */
export async function POST(request: Request) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(role === "admin" || role === "staff")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  const name = body?.name?.trim() ?? "";
  const clientId = body?.client_id?.trim() ?? "";
  const domainRaw = typeof body?.domain === "string" ? body.domain.trim().toLowerCase() : "";
  const domain = domainRaw || null;
  const status = body?.status === "published" ? "published" : "draft";

  if (!name || !clientId) {
    return NextResponse.json({ error: "Name and client are required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const clientCheck = await supabase.from("clients").select("id").eq("id", clientId).maybeSingle();
  if (clientCheck.error || !clientCheck.data) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  const websiteInsert = await supabase
    .from("websites")
    .insert({
      name,
      client_id: clientId,
      status,
      ...(domain ? { domain } : {}),
    })
    .select("id, name, client_id, status, domain")
    .single();

  if (websiteInsert.error || !websiteInsert.data) {
    return NextResponse.json(
      { error: websiteInsert.error?.message ?? "Failed to create website." },
      { status: 400 },
    );
  }

  const websiteId = String(websiteInsert.data.id);

  const pageInsert = await supabase
    .from("pages")
    .insert({ website_id: websiteId })
    .select("id")
    .single();

  if (pageInsert.error || !pageInsert.data) {
    await supabase.from("websites").delete().eq("id", websiteId);
    return NextResponse.json(
      { error: pageInsert.error?.message ?? "Failed to create page." },
      { status: 500 },
    );
  }

  const pageId = String(pageInsert.data.id);

  const sectionsInsert = await supabase
    .from("sections")
    .insert([
      { page_id: pageId, type: "hero", position: 0 },
      { page_id: pageId, type: "features", position: 1 },
    ])
    .select("id, type");

  if (sectionsInsert.error || !sectionsInsert.data?.length) {
    await supabase.from("websites").delete().eq("id", websiteId);
    return NextResponse.json(
      { error: sectionsInsert.error?.message ?? "Failed to create sections." },
      { status: 500 },
    );
  }

  const hero = sectionsInsert.data.find((row) => row.type === "hero");
  const features = sectionsInsert.data.find((row) => row.type === "features");
  if (!hero?.id || !features?.id) {
    await supabase.from("websites").delete().eq("id", websiteId);
    return NextResponse.json({ error: "Failed to map sections." }, { status: 500 });
  }

  const blocksInsert = await supabase.from("content_blocks").insert([
    {
      section_id: hero.id,
      type: "text",
      key: "title",
      value: name,
    },
    {
      section_id: hero.id,
      type: "text",
      key: "subtitle",
      value: "A clear message that explains what this business offers.",
    },
    {
      section_id: features.id,
      type: "text",
      key: "title",
      value: "What we deliver",
    },
    {
      section_id: features.id,
      type: "text",
      key: "description",
      value: "Add the services, offers, or proof points that matter most.",
    },
  ]);

  if (blocksInsert.error) {
    // Website/sections still usable; warn so admin can run key migration if needed.
    revalidateWebsitePaths(websiteId);
    return NextResponse.json(
      {
        ok: true,
        website: websiteInsert.data,
        warning:
          blocksInsert.error.message.includes("key")
            ? "Website created, but content block keys failed. Run supabase/migrations/20260730_content_blocks_key.sql then recreate or edit blocks."
            : `Website created with a content warning: ${blocksInsert.error.message}`,
      },
      { status: 201 },
    );
  }

  revalidateWebsitePaths(websiteId);
  return NextResponse.json({ ok: true, website: websiteInsert.data }, { status: 201 });
}
