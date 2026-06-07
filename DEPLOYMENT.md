# Production Deployment Checklist

## Vercel Environment Variables

Set these in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL_ALLOWLIST` (optional comma-separated trusted emails promoted to admin on signup/login)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (optional, defaults to `no-reply@stewardjamal.agency`)
- `NEXT_PUBLIC_CONTACT_EMAIL` (footer and contact sections; defaults to `stewardjamalagency@gmail.com`)
- `NEXT_PUBLIC_CONTACT_PHONE` (optional; shown in header, hero, and footer)
- `NEXT_PUBLIC_CONTACT_ADDRESS` (optional; defaults to `Accra, Ghana`)
- `NEXT_PUBLIC_APP_URL` (canonical site URL for auth redirects and OG tags)
- `NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL`, `NEXT_PUBLIC_SOCIAL_LINKEDIN_URL`, `NEXT_PUBLIC_SOCIAL_X_URL` (optional footer links)

## Auth Troubleshooting

If signup or login shows a connection error:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and confirm the project is **active** (not paused or deleted).
2. Copy the project **URL**, **anon key**, and **service role key** from Project Settings → API.
3. Update Vercel env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and redeploy.
4. Run the SQL migrations listed below in the Supabase SQL editor.
5. Verify health at `/api/auth/health` — all checks should return `true`.

Current production health endpoint: `https://steward-jamal-agency-eidc.vercel.app/api/auth/health`

## Database Migration

**Fastest path:** open Supabase → SQL Editor and run the full file `supabase/setup_all.sql` (creates all tables, RLS, and demo portfolio seed).

Or, with a Postgres URI in `SUPABASE_DB_URL`:

```bash
npm run db:migrate
```

Or call once (with `SUPABASE_DB_URL` set on the server):

```bash
curl -X POST https://steward-jamal-agency-eidc.vercel.app/api/admin/bootstrap-db \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

Individual migration files (also included in `setup_all.sql`):

- `supabase/migrations/20260415_final_phase_notifications_domains.sql`
- `supabase/migrations/20260415_auth_signup_trigger_fix.sql` (required for reliable email/password signup)
- `supabase/migrations/20260415_client_bookings.sql` (client booking features)
- `supabase/migrations/20260415_public_leads.sql` (public proposal/lead capture)

Optional env vars:

- `LEADS_ALERT_EMAIL` — inbox for new contact form submissions (defaults to contact email)
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — email alerts for leads and notifications
- `ADMIN_EMAIL_ALLOWLIST` — comma-separated emails promoted to admin on signup/login
- `SUPABASE_DB_URL` — Postgres URI for `npm run db:migrate` or `/api/admin/bootstrap-db`

This creates:

- `notifications` table
- `websites.domain` column + unique index
- resilient `auth.users -> public.profiles` new-user trigger that does not block signup
- `bookings` table + RLS policies for client self-service booking
- `leads` table for website proposal request submissions

## Security Notes

- Paystack verification is server-side in `src/app/api/verify-payment/route.ts`
- Payment success is recorded only after Paystack verify returns success + amount match
- Dashboard routes are protected by `middleware.ts`
- Role routing:
  - `admin/staff` -> `/dashboard`
  - `client` -> `/client-dashboard`

## Performance Notes

- Heavy admin/editor data paths use server components
- Editor page remains lazy-loaded by route segment
- Public rendering route (`/sites/[id]`) uses dynamic Supabase fetch with minimal section mapping
