"use client";

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
import { RevenueChart } from "@/components/dashboard/revenue-chart";
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

type DashboardHomeProps = {
  leads: LeadItem[];
  leadsLoadError?: string | null;
};

const stats = [
  {
    title: "Total clients",
    value: "48",
    trend: "+3",
    trendUp: true,
  },
  {
    title: "Total websites",
    value: "62",
    trend: "+5",
    trendUp: true,
  },
  {
    title: "Active projects",
    value: "14",
    trend: "−1",
    trendUp: false,
  },
  {
    title: "Revenue (YTD)",
    value: "GH₵189,400",
    trend: "+12.4%",
    trendUp: true,
  },
] as const;

const activity = [
  {
    client: "Northwind Collective",
    project: "Brand & web refresh",
    status: "In progress" as const,
    date: "Apr 12, 2026",
  },
  {
    client: "Harborline Realty",
    project: "Listing platform",
    status: "Review" as const,
    date: "Apr 10, 2026",
  },
  {
    client: "Studio Lumen",
    project: "Portfolio site",
    status: "Complete" as const,
    date: "Apr 8, 2026",
  },
  {
    client: "Cedar & Co.",
    project: "E‑commerce build",
    status: "In progress" as const,
    date: "Apr 5, 2026",
  },
];

function statusVariant(
  s: (typeof activity)[number]["status"],
): "default" | "success" | "warning" | "neutral" {
  if (s === "Complete") return "success";
  if (s === "Review") return "warning";
  if (s === "In progress") return "default";
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

export function DashboardHome({ leads, leadsLoadError = null }: DashboardHomeProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div key={s.title} variants={item}>
            <Card className="overflow-hidden transition-shadow hover:shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.06)]">
              <CardHeader className="pb-0">
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {s.value}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
                      s.trendUp
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-zinc-100 text-zinc-600",
                    )}
                  >
                    {s.trendUp ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {s.trend}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">vs. last period</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Revenue</CardTitle>
              <p className="text-sm text-zinc-500">Last 6 months</p>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <RevenueChart />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">
            Recent activity
          </h2>
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
              {activity.map((row) => (
                <TableRow key={row.client + row.project}>
                  <TableCell className="font-medium">{row.client}</TableCell>
                  <TableCell className="text-zinc-600">{row.project}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-zinc-500">
                    {row.date}
                  </TableCell>
                </TableRow>
              ))}
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
        </div>
        {leadsLoadError ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Requests unavailable: {leadsLoadError}
          </p>
        ) : leads.length === 0 ? (
          <p className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500">
            No project requests yet.
          </p>
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
                      <Badge variant={lead.status === "new" ? "warning" : "neutral"}>
                        {lead.status}
                      </Badge>
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
