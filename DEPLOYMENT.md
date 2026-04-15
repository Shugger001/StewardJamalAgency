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

## Database Migration

Run migration:

- `supabase/migrations/20260415_final_phase_notifications_domains.sql`
- `supabase/migrations/20260415_auth_signup_trigger_fix.sql` (required for reliable email/password signup)

This creates:

- `notifications` table
- `websites.domain` column + unique index
- resilient `auth.users -> public.profiles` new-user trigger that does not block signup

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
