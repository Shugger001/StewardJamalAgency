import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardListToolbar, PaginationBar } from "@/components/dashboard/list-toolbar";
import { AdminMessageForm } from "@/components/messages/admin-message-form";
import { LeadStatusSelect } from "@/components/leads/lead-status-select";
import { TestLeadAlertButton } from "@/components/settings/test-lead-alert-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { checkDbSetup } from "@/lib/check-db-setup";
import {
  DASHBOARD_PAGE_SIZE,
  escapeIlike,
  parseListPage,
  parseListQuery,
  parseListStatus,
} from "@/lib/dashboard/list-params";
import { getResendFromEmail, isResendConfigured } from "@/lib/email";
import { createSupabaseServerClient, hasSupabaseServerEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

type DbRow = Record<string, unknown>;

const LEAD_STATUSES = ["all", "new", "contacted", "closed"] as const;

function resolveLeadsLoadError(message: string | null) {
  if (!message) return null;
  const isMissingLeadsTable =
    message.includes("Could not find the table 'public.leads'") ||
    message.includes('relation "leads" does not exist');

  if (isMissingLeadsTable) {
    return "Leads inbox is not initialized yet. Run the leads table migration to enable dashboard storage. Lead emails can still be delivered.";
  }

  return message;
}

function isOnboardingFromAddress(from: string) {
  return from.includes("resend.dev") || from.includes("onboarding@");
}

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  if (!hasSupabaseServerEnv()) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Supabase is not configured. Add{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          (or <code className="rounded bg-amber-100 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)
          to continue.
        </p>
      </div>
    );
  }

  const params = (await searchParams) ?? {};
  const q = parseListQuery(params.q);
  const status = parseListStatus(params.status, [...LEAD_STATUSES]);
  const page = parseListPage(params.page);
  const from = (page - 1) * DASHBOARD_PAGE_SIZE;
  const to = from + DASHBOARD_PAGE_SIZE - 1;

  const supabase = createSupabaseServerClient();
  const dbSetup = await checkDbSetup();

  let leadsQuery = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    const term = `%${escapeIlike(q)}%`;
    const fields = ["name", "email", "company", "message", "service"];
    if (dbSetup.leadsPhoneReady) fields.push("phone");
    leadsQuery = leadsQuery.or(fields.map((field) => `${field}.ilike.${term}`).join(","));
  }
  if (status !== "all") {
    leadsQuery = leadsQuery.eq("status", status);
  }

  const [clientsQuery, leadsResult] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    leadsQuery,
  ]);

  const clientsLoadError = clientsQuery.error?.message ?? null;
  const clients = clientsQuery.error
    ? []
    : ((clientsQuery.data ?? []) as DbRow[]).map((client) => ({
        id: String(client.id ?? ""),
        name: String(client.business_name ?? "Unnamed client"),
      }));
  const leads = (leadsResult.data ?? []) as DbRow[];
  const leadsTotal = leadsResult.count ?? leads.length;
  const leadsLoadError = resolveLeadsLoadError(leadsResult.error?.message ?? null);
  const hasLeadFilters = Boolean(q || (status && status !== "all"));
  const resendReady = isResendConfigured();
  const fromEmail = getResendFromEmail();
  const needsCustomSendingDomain = resendReady && isOnboardingFromAddress(fromEmail);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const isCustomAppHost =
    Boolean(appUrl) &&
    !appUrl.includes("vercel.app") &&
    !appUrl.includes("localhost");
  const paystackReady = Boolean(
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && process.env.PAYSTACK_SECRET_KEY,
  );
  const paystackMode = (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "").startsWith("pk_live_")
    ? "live"
    : "test";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage communication and workspace-level controls.
        </p>
      </div>

      {!dbSetup.ready ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Database setup required</p>
          <p className="mt-1 text-amber-800">
            Missing tables: {dbSetup.missing.join(", ")}. Open the Supabase SQL editor, paste{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5">supabase/setup_all.sql</code>, and run it once.
          </p>
          <Link
            href={dbSetup.sqlEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-[#1860F0] hover:underline"
          >
            Open Supabase SQL editor →
          </Link>
        </div>
      ) : null}

      {dbSetup.ready && !dbSetup.leadsPhoneReady ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Add phone column for contact form</p>
          <p className="mt-1 text-amber-800">
            Run this once in the SQL editor so phone numbers save as their own field:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-amber-100/80 px-3 py-2 text-xs text-amber-950">
            {`alter table public.leads\n  add column if not exists phone text;`}
          </pre>
          <Link
            href={dbSetup.sqlEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-[#1860F0] hover:underline"
          >
            Open Supabase SQL editor →
          </Link>
        </div>
      ) : null}

      {clientsLoadError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Clients unavailable until database setup is complete.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">How you receive project requests</CardTitle>
          <p className="text-sm text-zinc-500">
            When someone submits Tell us about your project on the website, you get it here and by email.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ol className="list-decimal space-y-2 pl-5 text-zinc-700">
            <li>
              <span className="font-medium text-zinc-900">Leads inbox</span> (this page) stores every submission with
              name, email, phone, service, and message.
            </li>
            <li>
              <span className="font-medium text-zinc-900">Email alert</span> goes to{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
                {process.env.LEADS_ALERT_EMAIL ?? "stewardjamalagency@gmail.com"}
              </code>{" "}
              when Resend is configured.
            </li>
          </ol>
          <div
            className={`rounded-lg border px-3 py-2 ${
              resendReady ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {resendReady ? (
              <p>
                Email alerts are ready. From: <strong>{fromEmail}</strong>. Use the test button below to
                confirm delivery.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">Email alerts are not configured yet.</p>
                <p>
                  In Vercel → Project → Settings → Environment Variables, add{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">RESEND_API_KEY</code> and{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">RESEND_FROM_EMAIL</code> (must use a domain
                  verified in Resend), set{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">LEADS_ALERT_EMAIL</code> to your inbox, then
                  redeploy.
                </p>
                <p>
                  Until then, leads still appear in the inbox below. They will not email you automatically.
                </p>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Lead alert test</p>
            <p className="mt-1 text-xs text-zinc-500">
              Send a test project-request email to confirm inbox delivery.
            </p>
            <div className="mt-3">
              <TestLeadAlertButton />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">Custom domain and sending domain</CardTitle>
          <p className="text-sm text-zinc-500">
            Point your public site and lead emails at your own hostname.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-700">
          <div
            className={`rounded-lg border px-3 py-2 ${
              isCustomAppHost
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <p className="font-medium text-inherit">Website domain</p>
            <p className="mt-1">
              {isCustomAppHost
                ? `Canonical URL is set to ${appUrl}.`
                : appUrl
                  ? `Still on a preview host (${appUrl}). Add your domain in Vercel → Domains, then set NEXT_PUBLIC_APP_URL to https://your-domain.`
                  : "NEXT_PUBLIC_APP_URL is not set. After DNS is live, set it to https://your-domain and redeploy."}
            </p>
            <p className="mt-2 text-xs opacity-90">
              Reply in chat with the exact hostname (for example stewardjamal.agency) when you are ready for DNS cutover help.
            </p>
          </div>
          <div
            className={`rounded-lg border px-3 py-2 ${
              resendReady && !needsCustomSendingDomain
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <p className="font-medium text-inherit">Resend sending domain</p>
            {needsCustomSendingDomain ? (
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>In Resend → Domains, add the same domain you use for the site.</li>
                <li>Add the DNS records Resend shows (SPF, DKIM, and any MX if requested).</li>
                <li>
                  Set <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">RESEND_FROM_EMAIL</code> to something
                  like <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">no-reply@your-domain</code>.
                </li>
                <li>Redeploy on Vercel, then use the lead alert test above.</li>
              </ol>
            ) : resendReady ? (
              <p className="mt-1">
                Using a custom from address: <strong>{fromEmail}</strong>.
              </p>
            ) : (
              <p className="mt-1">
                Configure Resend first, then verify your domain so mail is not limited to test recipients.
              </p>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            Full steps live in <code className="rounded bg-zinc-100 px-1 py-0.5">DEPLOYMENT.md</code> (Custom domain +
            Email sections).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">Public portfolio</CardTitle>
          <p className="text-sm text-zinc-500">
            Showcase live websites you have built or worked on.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-700">
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Open{" "}
              <Link href="/dashboard/portfolio" className="font-medium text-[#1860F0] hover:underline">
                Dashboard → Portfolio
              </Link>
              .
            </li>
            <li>Add the project title, client/brand, and live URL.</li>
            <li>Keep Show on public portfolio checked to publish immediately.</li>
          </ol>
          <p className="text-xs text-zinc-500">
            Published portfolio items replace sample case studies on Home and /portfolio. Use Dashboard →
            Websites only when you are building a site inside this CMS.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">Integrations</CardTitle>
          <p className="text-sm text-zinc-500">
            Email and payment providers used by leads, notifications, and billing.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="font-medium text-zinc-900">Resend</p>
            <p className="mt-1 text-zinc-600">
              {resendReady
                ? `Configured. From address: ${fromEmail}`
                : "Not configured. Add RESEND_API_KEY and a verified RESEND_FROM_EMAIL in Vercel, then redeploy."}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="font-medium text-zinc-900">Paystack</p>
            <p className="mt-1 text-zinc-600">
              {paystackReady
                ? `Configured (${paystackMode} keys). Switch to live keys in Vercel when ready to charge real customers.`
                : "Not configured. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY and PAYSTACK_SECRET_KEY in Vercel."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">Admin message</CardTitle>
          <p className="text-sm text-zinc-500">
            Send an in-app notification and email to a selected client.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminMessageForm clients={clients} />
        </CardContent>
      </Card>

      <Card id="leads-inbox">
        <CardHeader>
          <CardTitle className="text-zinc-900">Leads inbox</CardTitle>
          <p className="text-sm text-zinc-500">
            Proposal requests submitted from the public website.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Suspense fallback={<div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-zinc-100" />}>
            <DashboardListToolbar
              searchPlaceholder="Search name, email, phone, message…"
              statusOptions={[
                { value: "all", label: "All statuses" },
                { value: "new", label: "New" },
                { value: "contacted", label: "Contacted" },
                { value: "closed", label: "Closed" },
              ]}
            />
          </Suspense>
          {leadsLoadError ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Leads unavailable: {leadsLoadError}
            </p>
          ) : leads.length === 0 ? (
            <EmptyState
              title={hasLeadFilters ? "No matching leads" : "No leads yet"}
              description={
                hasLeadFilters
                  ? "Try a different search or clear filters."
                  : "When someone submits the contact form, their request appears here."
              }
              actionHref={hasLeadFilters ? undefined : "/contact"}
              actionLabel={hasLeadFilters ? undefined : "Open contact form"}
            />
          ) : (
            leads.map((lead) => (
              <div
                key={String(lead.id)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900">{String(lead.name ?? "Lead")}</p>
                  <LeadStatusSelect
                    leadId={String(lead.id ?? "")}
                    status={String(lead.status ?? "new")}
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {String(lead.email ?? "-")}
                  {lead.phone ? ` • ${String(lead.phone)}` : ""}
                  {lead.company ? ` • ${String(lead.company)}` : ""}
                  {lead.service ? ` • ${String(lead.service)}` : ""}
                </p>
                <p className="mt-2 text-sm text-zinc-700">{String(lead.message ?? "")}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  Budget: {String(lead.budget ?? "Not specified")} • Timeline:{" "}
                  {String(lead.timeline ?? "Not specified")}
                </p>
              </div>
            ))
          )}
          <Suspense fallback={null}>
            <PaginationBar page={page} pageSize={DASHBOARD_PAGE_SIZE} total={leadsTotal} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
