# Burma AI Studio — Member Email Auth Foundation (STAGING / DRAFT)

This branch is an **opt-in foundation**, not a production-ready commercial billing release.
It is branched from `codex/burmaaistudio-dev` at commit `0cea7d4`; it does **not** replace `main`.
The existing username-based login remains unchanged unless `BAS_EMAIL_AUTH_ENABLED=true`.

## Implemented on this branch

- Invite-only Supabase email/password login as a separate server-verified path.
- Member-scoped Studio identity based on verified Supabase Auth token + database role and active account.
- Admin-only member list and invite form at `/admin/members`.
- Link-based onboarding at `/activate`, with password set by the member (never by owner).
- Additive membership, plan, credit-wallet, ledger and audit schema with RLS and service-only writes.
- No payment collection, paid generation, automatic credit purchase, or unreviewed production migration.

## IMPORTANT: manual tasks you must do on STAGING first

1. **Create/use a separate Supabase staging project.** Back up its database. Never use production keys for the staging preview.
2. Review and apply *in order*:
   - `supabase/migrations/20261029_spaces_private_beta.sql`
   - `supabase/migrations/20261029_studio_durability.sql`
   - `supabase/migrations/20261031_member_access_foundation.sql`
   Check existing migration history before applying: running a script twice can fail on duplicate policies.
3. Supabase Dashboard → Authentication → Users: create/invite **your own** verified owner email account. Confirm email and set password via a secure channel.
4. Copy that **Auth User UUID**, verify it is yours. Provision that UUID **manually in staging** with the two owner SQL statements at the bottom of `20261031_member_access_foundation.sql`. Replace placeholders with your real owner UUID/email. Never grant admin solely on matching email text.
5. Supabase Dashboard → Authentication → URL Configuration: allow the exact preview `https://...vercel.app/activate` redirect. Check invite email template supports `{{ .RedirectTo }}`. Configure reliable SMTP before inviting paying customers.
6. In Vercel **Preview scope only** set:
   - `SUPABASE_URL` = staging project URL
   - `BAS_STAGING_SUPABASE_SERVER_KEY` = staging secret key (server only, branch-scoped; NEVER `NEXT_PUBLIC_`). This unique name avoids Vercel duplicate-key conflict with shared Preview `SUPABASE_SERVER_KEY`. Never modify the shared Preview key.
   - `SUPABASE_PUBLISHABLE_KEY` = staging publishable client key
   - `BAS_SESSION_SECRET` = long random secret
   - `BAS_INVITE_REDIRECT_URL` = exact HTTPS preview URL ending in `/activate`
   - `BAS_EMAIL_AUTH_ENABLED` = `true` (**only once you approve Preview testing**)
   - `BAS_ENABLE_PAID_GENERATION` = `false`
7. Redeploy **Preview**, never Production, and test with a new test user. Verify:
   - Owner email/password login and `/admin/members`.
   - An uninvited email CANNOT use the Studio.
   - Owner invites a test email; invitee sets their own password and opens their own workspace.
   - Member cannot GET or POST `/api/admin/members` or access other users' records/media.
   - Suspending/expiring a test account blocks all Studio API access.
   - Logout, refresh, storage, RLS, rate limits and E2E regression tests.

## Unfinished work — blockers for production

- Existing legacy admin code routes still need a separate security audit and role unification.
- Token refresh/rotation, per-user durable sessions/revocation and comprehensive password recovery must be completed and tested; access tokens can expire and may require sign-in again.
- Invite acceptance must be tested against the current Supabase email template/PKCE setting; use the official `@supabase/ssr` flow if configured for PKCE rather than implicit invite token fragments.
- Owner must have real suspend/reactivate, plan/expiry controls with audit logs before paid launch.
- Credit ledger is **schema only**: no atomic reservation/settlement/refund RPC or verified payment provider is connected. Never enable paid AI calls or charge customers.
- Use separate preview/production Supabase projects and secrets, test database migrations and backups.
- Android sign-in changes and regression tests are NOT implemented in this branch.
- All TypeScript, security, E2E and build checks must pass before feature flag is enabled; do not assume GitHub file commits are tested.

## Credentials

Never post passwords, hashes, service-role/secret keys, cookies or invitation links into a chat, PR, issue or screenshot.
Secret-key access bypasses RLS. Only trusted server code may use it.

## Release strategy

1. Treat this as a **draft review branch** targeting `codex/burmaaistudio-dev`.
2. Inspect CI errors, make test fixes, then stage and test preview separately.
3. Do **not** merge the old PR #11 to `main`, alter production DNS, or deploy to `burmaaistudio.com` without the owner's explicit approval.
