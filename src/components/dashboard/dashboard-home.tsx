"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrap,
} from "@/components/ui/table";
import { LeadStatusSelect } from "@/components/leads/lead-status-select";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type LeadItem = {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  status: string;
  message: string;
};

type ActivityItem = {
  client: string;
  project: string;
  status: string;
  date: string;
};

type DashboardStats = {
  clients: number;
  websites: number;
  activeProjects: number;
  revenueYtd: number;
  newLeads: number;
};

type DashboardHomeProps = {
  leads: LeadItem[];
  leadsLoadError?: string | null;
  stats: DashboardStats;
  activity: ActivityItem[];
};

function statusVariant(s: string): "default" | "success" | "warning" | "neutral" {
  const normalized = s.toLowerCase().replace("_", " ");
  if (normalized === "completed" || normalized === "complete" || normalized === "success") {
    return "success";
  }
  if (normalized === "review" || normalized === "pending" || normalized === "new") {
    return "warning";
  }
  if (normalized === "in progress" || normalized === "in_progress") return "default";
  return "neutral";
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function DashboardHome({
  leads,
  leadsLoadError = null,
  stats,
  activity,
}: DashboardHomeProps) {
  const statCards = [
    { title: "Total clients", value: String(stats.clients), hint: "In CRM" },
    { title: "Websites", value: String(stats.websites), hint: "Tracked sites" },
    {
      title: "Active projects",
      value: String(stats.activeProjects),
      hint: "Not completed",
    },
    {
      title: "Revenue (paid)",
      value: stats.revenueYtd.toLocaleString("en-GH", {
        style: "currency",
        currency: "GHS",
        maximumFractionDigits: 0,
      }),
      hint: `${stats.newLeads} new leads`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map((s) => (
          <motion.div key={s.title} variants={item}>
            <Card className="overflow-hidden transition-shadow hover:shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.06)]">
              <CardHeader className="pb-0">
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-2xl font-semibold tracking-tight text-zinc-900">{s.value}</p>
                <p className="mt-2 text-xs text-zinc-500">{s.hint}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Recent projects</h2>
          <Link href="/dashboard/projects" className="text-xs font-medium text-[#1860F0] hover:underline">
            View all
          </Link>
        </div>
        <TableWrap>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <EmptyState
                      title="No projects yet"
                      description="Create a project once a client is in the CRM—or convert an approved lead."
                      actionHref="/dashboard/projects"
                      actionLabel="Open projects"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                activity.map((row) => (
                  <TableRow key={row.client + row.project + row.date}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell className="text-zinc-600">{row.project}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(row.status)}>{row.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-zinc-500">{row.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrap>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Recent project requests</h2>
          <Link href="/dashboard/settings#leads-inbox" className="text-xs font-medium text-[#1860F0] hover:underline">
            Open inbox
          </Link>
        </div>
        {leadsLoadError ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Requests unavailable: {leadsLoadError}
          </p>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No project requests yet"
            description="Public quotes arrive from /contact. Share that link—visitors do not need an account."
            actionHref="/contact"
            actionLabel="View contact form"
          />
        ) : (
          <TableWrap>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      <div className="space-y-0.5">
                        <p className="text-zinc-900">{lead.name}</p>
                        <p className="text-xs text-zinc-500">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600">{lead.service}</TableCell>
                    <TableCell className="text-zinc-600">{lead.budget}</TableCell>
                    <TableCell>
                      <LeadStatusSelect leadId={lead.id} status={lead.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrap>
        )}
      </motion.div>
    </div>
  );
}

/** Kept for type compatibility with older imports. */
export function TrendBadge({ up, label }: { up: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
        up ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-600",
      )}
    >
      {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}
