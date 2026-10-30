# Burma AI Studio — Owner-only official beta release

This release exists to launch the redesigned studio sooner **without depending on invitation email delivery**. It does **not** replace Supabase Auth with a home-grown password service.

## Behavior when BAS_OWNER_ONLY_BETA=true
- Server verifies Supabase Auth tokens against /auth/v1/user.
- Access requires a confirmed email, active membership with role=admin, and UUID equal to BAS_ADMIN_USER_ID. Missing UUID fails closed.
- Member invitations return HTTP 403; the Owner Control page shows a disabled-invitations notice.
- Account activation returns HTTP 403.
- Legacy /admin6996 is hidden while the owner-only flag is enabled.
- Paid AI generation remains disabled.

## Mandatory production launch gates
1. Run and verify an **off-site Production database backup** on the original project (Supabase Free has no scheduled backups). Record counts, safely store roles/schema/data dumps, and test restore in a separate environment before migration. Backups don't include Storage objects.
2. Review all older admin/API paths, authenticated media access, rate limiting, session refresh/revocation, and browser/Android implications. Owner-only guards here are not a complete security audit.
3. Review and apply additive migrations in order: 20261029_spaces_private_beta, 20261029_studio_durability, 20261031_member_access_foundation to the PRODUCTION Supabase project only after backup/review.
4. Map the existing verified production Owner Auth UUID to admin membership and account (never select admin by email string alone).
5. Configure PRODUCTION Vercel variables using **production** Supabase URL and server key (NEVER staging credentials): SUPABASE_URL, SUPABASE_SERVER_KEY, SUPABASE_PUBLISHABLE_KEY, BAS_ADMIN_USER_ID, BAS_SESSION_SECRET; BAS_EMAIL_AUTH_ENABLED=true, BAS_OWNER_ONLY_BETA=true, BAS_ENABLE_PAID_GENERATION=false. Keep all secrets server-only. Set production Login URL and Redirect URLs in production Supabase.
6. Test an Owner login, /studio/spaces, /admin/members, sign out, invalid password, anonymous API denial, member denial, session expiration, browser data sync, and build/E2E.
7. Confirm deployment rollback and then promote reviewed production deployment to burmaaistudio.com. The legacy production site must remain intact until the release checks pass.

## Out of scope for initial launch
- Customer invitations: blocked until reliable SMTP, correct official-domain redirects, activation tests and member isolation checks.
- Payments, chargeable generation: disabled.
- Mobile APK session upgrade: requires separate regression review.

## Security warning from production baseline
The legacy public.leads table has RLS disabled. Before enabling RLS, identify callers and add appropriate policies, since enabling without policies can break existing behavior. Never open this table to anon/authenticated indiscriminately.
