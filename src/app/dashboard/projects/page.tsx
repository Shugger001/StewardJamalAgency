import type { Metadata } from "next";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { ProjectStatusSelect } from "@/components/projects/project-status-select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrap,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Projects",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

function statusVariant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status === "completed") return "success";
  if (status === "review") return "warning";
  if (status === "in_progress") return "default";
  return "neutral";
}

export default async function ProjectsPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: clients }, { data: projects, error: projectsError }] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
  ]);

  if (projectsError) {
    throw new Error(`Failed to load projects: ${projectsError.message}`);
  }

  const safeClients = ((clients ?? []) as DbRow[]).map((client) => ({
    id: String(client.id ?? ""),
    name: String(client.business_name ?? "Unnamed client"),
  }));
  const clientsById = new Map(safeClients.map((client) => [client.id, client.name]));
  const safeProjects = (projects ?? []) as DbRow[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Projects</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Submit project requests and move work through delivery stages.
        </p>
      </div>

      <CreateProjectForm clients={safeClients} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">Project workflow</h2>
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
                  <TableCell colSpan={4} className="py-10 text-center text-zinc-500">
                    No projects yet. Submit your first project request above.
                  </TableCell>
                </TableRow>
              ) : (
                safeProjects.map((project) => {
                  const status = String(project.status ?? "pending");
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
                        <Badge variant={statusVariant(status)}>
                          {status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ProjectStatusSelect
                          projectId={projectId}
                          initialStatus={
                            status === "in_progress" ||
                            status === "review" ||
                            status === "completed"
                              ? status
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
      </section>
    </div>
  );
}
