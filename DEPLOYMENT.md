# Production Deployment Checklist

## Vercel Environment Variables

Set these in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL_ALLOWLIST` - set to `stewardjamalagency@gmail.com` (comma-separated for more admins)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (optional, defaults to `no-reply@stewardjamal.agency`)
- `NEXT_PUBLIC_CONTACT_EMAIL` (footer and contact sections; defaults to `stewardjamalagency@gmail.com`)
- `NEXT_PUBLIC_CONTACT_PHONE` (optional; shown in header, hero, and footer)
- `NEXT_PUBLIC_CONTACT_ADDRESS` (optional; defaults to `Accra, Ghana`)
- `NEXT_PUBLIC_APP_URL` (canonical site URL for auth redirects and OG tags)
- `NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL`, `NEXT_PUBLIC_SOCIAL_LINKEDIN_URL`, `NEXT_PUBLIC_SOCIAL_X_URL` (optional footer links)
- `LEADS_ALERT_EMAIL` - inbox for new contact form submissions (use `stewardjamalagency@gmail.com`)
- `SUPABASE_DB_URL` - Postgres URI for `npm run db:migrate` or `/api/admin/bootstrap-db`

## Auth Troubleshooting

If signup or login shows a connection error:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and confirm the project is **active** (not paused or deleted).
2. Copy the project **URL**, **anon key**, and **service role key** from Project Settings → API.
3. Update Vercel env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and redeploy.
4. Run the SQL migrations listed below in the Supabase SQL editor.
5. Verify health at `/api/auth/health` - all checks should return `true`.

If the project was paused or DNS fails, unpause/restore it in Supabase before redeploying - `/api/auth/health` must show `authReachable: true`.

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
- `supabase/migrations/20260730_clients_user_link.sql` (client portal scoping + profile email for notifications)
- `supabase/migrations/20260730_content_blocks_key.sql` (CMS block `key` for hero/features templates)

This creates:

- `notifications` table
- `websites.domain` column + unique index
- resilient `auth.users -> public.profiles` new-user trigger that does not block signup
- `bookings` table + RLS policies for client self-service booking
- `leads` table for website proposal request submissions
- `clients.user_id` + `profiles.email` for scoped client portal data and messaging
- `content_blocks.key` for the website CMS editor template

**Run once after deploy (if upgrading an existing project):** open Supabase → SQL Editor and run both:
1. `supabase/migrations/20260730_clients_user_link.sql`
2. `supabase/migrations/20260730_content_blocks_key.sql`

## Security Notes

- HTTP security headers: static ones in `next.config.mjs`; `Content-Security-Policy` is issued per-request from `middleware.ts` with a script nonce (no production `unsafe-inline` / `unsafe-eval` in `script-src`). Re-scan after deploy if you add third-party scripts - load them with the page nonce.
- Paystack verification is server-side in `src/app/api/verify-payment/route.ts`
- Payment success is recorded only after Paystack verify returns success + amount match
- Paystack webhooks are signature-checked and idempotent on `payments.reference`
- Dashboard routes are protected by `middleware.ts`
- Role routing:
  - `admin/staff` -> `/dashboard`
  - `client` -> `/client-dashboard`
- Client dashboard only loads projects/payments for linked `clients` rows (`user_id` / email), not the full agency dataset

## Email (Resend)

1. Create a Resend account and verify your sending domain.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (must use the verified domain) in Vercel.
3. Keep `LEADS_ALERT_EMAIL=stewardjamalagency@gmail.com`.
4. Redeploy, then use **Settings → Send test lead-alert email**.

Until keys are set, lead inserts still succeed; email alerts are skipped and logged.

## Paystack

1. Use test keys (`pk_test_` / `sk_test_`) while developing.
2. Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` in Vercel.
3. Point Paystack webhook to `https://YOUR_DOMAIN/api/paystack/webhook`.
4. Switch to live keys when ready; the payments page badge reflects test vs live from the public key prefix.

## Custom domain

1. In Vercel → Project → Settings → Domains, add your domain (apex and/or `www`).
2. At your registrar, add the DNS records Vercel shows (usually A for apex, CNAME for `www`).
3. Wait for SSL to become Valid.
4. Set `NEXT_PUBLIC_APP_URL` to the canonical URL (prefer apex **or** www, not both as canonical):
   - Example: `https://stewardjamal.agency`
5. Redeploy so sitemap, robots, OG tags, and password-reset links use the new origin.
6. Optional: enable a redirect from the non-canonical host (www ↔ apex) in the Vercel Domains UI.
7. Smoke: open `/`, `/contact`, `/api/auth/health`, and one password-reset request.

DNS cutover is blocked until you provide the domain string; the app already reads `NEXT_PUBLIC_APP_URL` everywhere that matters.

**When you have the domain:** send the exact hostname (e.g. `stewardjamal.agency`). Then we can finish Vercel Domains cutover against that string.

## Marketing content (no CMS required)

| Content | File |
|---------|------|
| Portfolio fallback case studies | `src/content/portfolio-showcase.ts` |
| Blog posts | `src/content/blog-posts.ts` |
| Service page copy | `src/content/services/*.ts` |
| Brand colors / contact defaults | `src/lib/public-site-config.ts` |
| Logo assets | `public/brand/*` |

Live portfolio also comes from published `websites` + `clients` (Dashboard → Websites). Prefer real client domains there when ready.

## Integrations status checklist

| Integration | Ready when… |
|-------------|-------------|
| Supabase Auth | `/api/auth/health` returns `authReachable: true` |
| Lead alerts | `RESEND_API_KEY` + verified `RESEND_FROM_EMAIL`; test from Dashboard → Settings |
| Paystack | Public + secret keys set; webhook → `/api/paystack/webhook` |
| CMS templates | Run `20260730_content_blocks_key.sql` on the **active** Supabase project (SQL Editor) |

> Cursor’s StewardJamalAgency Supabase MCP may still point at an old inactive project. Prefer the SQL Editor on the project whose URL matches `NEXT_PUBLIC_SUPABASE_URL` in Vercel.

## Performance Notes

- Heavy admin/editor data paths use server components
- Editor page remains lazy-loaded by route segment
- Public rendering route (`/sites/[id]`) uses dynamic Supabase fetch with minimal section mapping
- Contact and pricing pages do not load portfolio data
