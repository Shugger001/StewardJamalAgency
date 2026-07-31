import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardListToolbar, PaginationBar } from "@/components/dashboard/list-toolbar";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { ProjectStatusSelect } from "@/components/projects/project-status-select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrap,
} from "@/components/ui/table";
import {
  DASHBOARD_PAGE_SIZE,
  escapeIlike,
  parseListPage,
  parseListQuery,
  parseListStatus,
} from "@/lib/dashboard/list-params";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Projects",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

const PROJECT_STATUSES = ["all", "pending", "in_progress", "review", "completed"] as const;

function statusVariant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status === "completed") return "success";
  if (status === "review") return "warning";
  if (status === "in_progress") return "default";
  return "neutral";
}

type ProjectsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = (await searchParams) ?? {};
  const q = parseListQuery(params.q);
  const status = parseListStatus(params.status, [...PROJECT_STATUSES]);
  const page = parseListPage(params.page);
  const from = (page - 1) * DASHBOARD_PAGE_SIZE;
  const to = from + DASHBOARD_PAGE_SIZE - 1;

  const supabase = createSupabaseServerClient();
  let projectsQuery = supabase
    .from("projects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    projectsQuery = projectsQuery.ilike("title", `%${escapeIlike(q)}%`);
  }
  if (status !== "all") {
    projectsQuery = projectsQuery.eq("status", status);
  }

  const [{ data: clients, error: clientsError }, projectsResult] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    projectsQuery,
  ]);

  const loadError = projectsResult.error?.message ?? clientsError?.message ?? null;
  const safeClients = ((clients ?? []) as DbRow[]).map((client) => ({
    id: String(client.id ?? ""),
    name: String(client.business_name ?? "Unnamed client"),
  }));
  const clientsById = new Map(safeClients.map((client) => [client.id, client.name]));
  const safeProjects = (projectsResult.data ?? []) as DbRow[];
  const total = projectsResult.count ?? safeProjects.length;
  const hasFilters = Boolean(q || (status && status !== "all"));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Projects</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Submit project requests and move work through delivery stages.
        </p>
      </div>

      {loadError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Projects unavailable: {loadError}
        </p>
      ) : null}

      <CreateProjectForm clients={safeClients} />

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Project workflow</h2>
          <Suspense fallback={<div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-zinc-100" />}>
            <DashboardListToolbar
              searchPlaceholder="Search project title…"
              statusOptions={[
                { value: "all", label: "All statuses" },
                { value: "pending", label: "Pending" },
                { value: "in_progress", label: "In progress" },
                { value: "review", label: "Review" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </Suspense>
        </div>
        <TableWrap>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Change status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <EmptyState
                      title={hasFilters ? "No matching projects" : "No projects yet"}
                      description={
                        hasFilters
                          ? "Try a different search or clear filters."
                          : "Submit your first project request above."
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                safeProjects.map((project) => {
                  const projectStatus = String(project.status ?? "pending");
                  const projectId = String(project.id ?? "");
                  return (
                    <TableRow key={projectId}>
                      <TableCell className="text-zinc-600">
                        {clientsById.get(String(project.client_id ?? "")) ?? "Unknown client"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {String(project.title ?? "Untitled project")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(projectStatus)}>
                          {projectStatus.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ProjectStatusSelect
                          projectId={projectId}
                          initialStatus={
                            projectStatus === "in_progress" ||
                            projectStatus === "review" ||
                            projectStatus === "completed"
                              ? projectStatus
                              : "pending"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrap>
        <Suspense fallback={null}>
          <PaginationBar page={page} pageSize={DASHBOARD_PAGE_SIZE} total={total} />
        </Suspense>
      </section>
    </div>
  );
}
