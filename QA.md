# Production QA Checklist

## Setup

- Use deployed URL: `<your-production-url>`
- Prepare 3 accounts:
  - `admin`
  - `staff`
  - `client`
- Ensure:
  - Vercel env vars are set
  - Supabase migration is applied

---

## A) Auth + Role Routing

- [ ] Open `/dashboard` while logged out  
  Expected: redirect to `/login`

- [ ] Login as `admin`, open `/dashboard`  
  Expected: dashboard loads

- [ ] Login as `staff`, open `/dashboard`  
  Expected: dashboard loads

- [ ] Login as `client`, open `/dashboard`  
  Expected: redirected to `/client-dashboard`

- [ ] Login as `admin`, open `/client-dashboard`  
  Expected: redirected to `/dashboard`

---

## B) Payments (Paystack + Verification)

- [ ] Open `/dashboard/payments`
- [ ] Select client, enter valid email + amount
- [ ] Click **Pay now** and complete payment in Paystack popup  
  Expected:
  - success toast in UI
  - payment appears in history with `status=success`
  - unique `reference` stored

- [ ] Retry verify endpoint with same reference (idempotency check)  
  Expected: no duplicate payment row created

- [ ] Cancel payment from popup  
  Expected: failure/cancel feedback; no payment inserted

---

## C) Project Workflow

- [ ] Open `/dashboard/projects`
- [ ] Create project with title + description + client  
  Expected: project row appears with `pending`

- [ ] Change status to `in_progress`  
  Expected: status updates immediately

- [ ] Change status to `review` then `completed`  
  Expected: each transition persists and displays correct badge

- [ ] Try invalid status payload via API (manual test)  
  Expected: API returns 400

---

## D) Notifications (In-App)

- [ ] Trigger payment success and project status update  
  Expected:
  - notification bell unread count increases
  - dropdown shows new notifications

- [ ] Click unread notification item  
  Expected:
  - item marked as read
  - unread count decrements

- [ ] Refresh page  
  Expected: read/unread state persists

---

## E) Email Notifications (Resend)

- [ ] Complete successful payment  
  Expected: recipient gets "payment received" email

- [ ] Update project status  
  Expected: recipient gets project update email

- [ ] Check Resend dashboard logs  
  Expected: sends recorded, no auth errors

---

## F) CMS Editor + Public Rendering

- [ ] Open `/dashboard/websites/[id]/editor`
- [ ] Click text block, edit in side panel  
  Expected:
  - block updates instantly
  - autosave after debounce
  - "Saved" feedback appears

- [ ] Open public page `/sites/[id]`  
  Expected: new content visible without code changes

- [ ] Set `websites.domain` value and open `/sites/[domain]`  
  Expected: same site resolves by domain fallback

---

## G) Read-Only / Permission Behavior

- [ ] As `viewer` role (or read-only simulation), open editor  
  Expected:
  - read-only notice shown
  - fields non-editable

- [ ] Attempt edit/save anyway  
  Expected:
  - API returns 403
  - toast shows insufficient permission
  - value not persisted

---

## H) Stability + Logs

- [ ] Open browser network tab while using core flows  
  Expected: no repeated failing API loops

- [ ] Check Vercel function logs for:
  - `/api/verify-payment`
  - `/api/projects/[id]/status`
  - `/api/notifications*`  
  Expected: no unhandled exceptions

---

## Sign-off Criteria

Release is approved when:

- [ ] All A-H checks pass
- [ ] No blocker bugs
- [ ] No P1/P2 regressions
- [ ] Notification + email flows verified end-to-end
