import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

type DbRow = Record<string, unknown>;
type PortfolioItem = {
  id: string;
  name: string;
  status: string;
  domain: string | null;
  clientId: string | null;
  createdAt: string | null;
};

function firstString(row: DbRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

async function loadPortfolioItems(): Promise<Array<PortfolioItem & { clientName: string }>> {
  if (!hasSupabaseServerEnv()) return [];
  try {
    const supabase = createSupabaseServerClient();
    const [{ data: websites }, { data: clients }] = await Promise.all([
      supabase.from("websites").select("*").order("created_at", { ascending: false }).limit(24),
      supabase.from("clients").select("*"),
    ]);

    const clientMap = new Map(
      ((clients ?? []) as DbRow[]).map((row) => [
        String(row.id ?? ""),
        firstString(row, ["business_name", "name", "client_name", "company_name"]) || "Client",
      ]),
    );

    const normalized = ((websites ?? []) as DbRow[]).map((row): PortfolioItem => ({
      id: String(row.id ?? ""),
      name: firstString(row, ["name", "website_name", "title"]) || "Website Project",
      status: firstString(row, ["status", "state"]).toLowerCase() || "draft",
      domain: firstString(row, ["domain"]) || null,
      clientId: firstString(row, ["client_id", "clientId"]) || null,
      createdAt: firstString(row, ["created_at"]) || null,
    }));

    const preferred = normalized
      .sort((a, b) => {
        if (a.status === "published" && b.status !== "published") return -1;
        if (a.status !== "published" && b.status === "published") return 1;
        return 0;
      })
      .slice(0, 3)
      .map((item) => ({
        ...item,
        clientName: item.clientId ? clientMap.get(item.clientId) ?? "Client" : "Client",
      }));

    return preferred;
  } catch {
    return [];
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const role = cookieStore.get("steward_role")?.value;
  if (role === "admin" || role === "staff") {
    redirect("/dashboard");
  }
  if (role === "client") {
    redirect("/client-dashboard");
  }
  const portfolioItems = await loadPortfolioItems();

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 p-4 py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2200&q=80')",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(7,16,33,0.72),rgba(8,11,18,0.58),rgba(8,102,255,0.25))]"
      />

      <section className="relative z-10 mx-auto w-full max-w-5xl rounded-2xl border border-white/25 bg-white/88 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A66FF]">
          The Steward Jamal Agency
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          We build modern websites and digital experiences that grow your business.
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-zinc-600 sm:text-base">
          From strategy and design to development and launch, we help brands create
          high-performing websites that look premium and convert consistently.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white"
          >
            Book consultation
          </Link>
          <Link
            href="/site"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            View our work
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Client login
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Projects delivered</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">120+</p>
            <p className="mt-1 text-xs text-zinc-500">Marketing sites, e-commerce, and custom portals.</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Average launch time</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">3-6 weeks</p>
            <p className="mt-1 text-xs text-zinc-500">Fast process without sacrificing quality or performance.</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Client satisfaction</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">95%</p>
            <p className="mt-1 text-xs text-zinc-500">Built on transparent communication and measurable outcomes.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Services
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>- Website design and front-end development</li>
              <li>- Branding, content structure, and UX optimization</li>
              <li>- E-commerce and booking workflow implementation</li>
              <li>- Ongoing maintenance, updates, and support</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/90 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Our process
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>1. Discovery call to define goals, audience, and offer.</li>
              <li>2. Strategy + design direction tailored to your brand.</li>
              <li>3. Development, QA, and performance optimization.</li>
              <li>4. Launch, support, and continuous improvement.</li>
            </ol>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Portfolio Highlights
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
                Recent delivery wins
              </h2>
            </div>
            <Link href="/site" className="text-xs font-medium text-[#0A66FF] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.length > 0 ? (
              portfolioItems.map((item, idx) => {
                const liveTarget = item.domain || item.id;
                const label =
                  idx === 0
                    ? "Featured Project"
                    : idx === 1
                      ? "Recent Launch"
                      : "Case Study";
                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-zinc-200/70 bg-white/95 p-4"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {label}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-zinc-900">{item.name}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{item.clientName}</p>
                    <p className="mt-2 text-xs text-zinc-600">
                      {item.status === "published"
                        ? "Live and published. Explore the public website experience."
                        : "In progress and currently in active production workflow."}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/sites/${liveTarget}`}
                        className="text-xs font-medium text-[#0A66FF] hover:underline"
                      >
                        Open project preview
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              <>
                <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Real Estate Platform
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-zinc-900">Harborline Realty</h3>
                  <p className="mt-2 text-xs text-zinc-600">
                    Redesigned listing workflow and lead capture to increase qualified inquiries by 38%.
                  </p>
                </article>
                <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    E-commerce Build
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-zinc-900">Cedar & Co.</h3>
                  <p className="mt-2 text-xs text-zinc-600">
                    Launched conversion-focused storefront with checkout optimization and analytics.
                  </p>
                </article>
                <article className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Brand & Web Refresh
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-zinc-900">Northwind Collective</h3>
                  <p className="mt-2 text-xs text-zinc-600">
                    Unified brand voice and website messaging to improve positioning across channels.
                  </p>
                </article>
              </>
            )}
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Client Testimonials
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <blockquote className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-600">
              "They translated our ideas into a polished website that feels premium and performs."
              <footer className="mt-3 text-xs font-medium text-zinc-800">
                — Amina Yusuf, Operations Lead, Harborline
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-600">
              "From kickoff to launch, communication was sharp and every deliverable arrived on time."
              <footer className="mt-3 text-xs font-medium text-zinc-800">
                — Daniel Okafor, Founder, Cedar & Co.
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-600">
              "The quality of design and development gave our brand a serious credibility boost."
              <footer className="mt-3 text-xs font-medium text-zinc-800">
                — Ruth Mensah, Program Manager, Northwind Collective
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-[#0A66FF]/25 bg-[#0A66FF]/8 p-5">
          <p className="text-sm font-semibold text-zinc-900">Ready to build a website that drives results?</p>
          <p className="mt-1 text-sm text-zinc-600">
            Let’s map out your project goals and timeline in a focused discovery session.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-lg bg-[#0A66FF] px-5 text-sm font-medium text-white"
            >
              Book now
            </Link>
            <Link
              href="/site"
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              View sample work
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 rounded-xl border border-[#0A66FF]/35 bg-white/95 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.15)] backdrop-blur md:bottom-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#0A66FF]">
              Free discovery session
            </p>
            <p className="truncate text-sm text-zinc-700">
              Discuss your website goals and get a launch roadmap.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-9 shrink-0 items-center rounded-lg bg-[#0A66FF] px-4 text-sm font-medium text-white"
          >
            Let’s talk
          </Link>
        </div>
      </div>
    </main>
  );
}
