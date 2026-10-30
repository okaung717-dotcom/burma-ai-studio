# Burma AI Studio production readiness

This checklist is intentionally value-free. Never paste secret values into issues, pull requests, logs, or chat.

## GitHub Actions Android authentication

The Android job requires these repository Actions secrets:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Configure them at **GitHub → okaung717-dotcom/burma-ai-studio → Settings → Secrets and variables → Actions → New repository secret**. Add each exact name separately. Use the client-safe Supabase publishable key; never use `SUPABASE_SERVER_KEY`, a secret key, or a service-role key in Android. Re-run the failed **Build Native APK v3.1.4** job after both names show in the repository secrets list.

GitHub CLI alternative (run locally and enter each value privately when prompted):

```sh
gh secret set SUPABASE_URL --repo okaung717-dotcom/burma-ai-studio
gh secret set SUPABASE_PUBLISHABLE_KEY --repo okaung717-dotcom/burma-ai-studio
```

## Vercel Preview and Production variables

Configure the following server-side variables for both Preview and Production unless noted:

| Name | Scope | Requirement |
| --- | --- | --- |
| `SUPABASE_URL` | Preview + Production | Required |
| `SUPABASE_SERVER_KEY` | Preview + Production | Required; server-only secret/service key |
| `SUPABASE_PUBLISHABLE_KEY` | Preview + Production | Required for client-safe Android configuration workflows |
| `BAS_ADMIN_PASSWORD_HASH` | Preview + Production | Required; current `scrypt` N=65536 hash only |
| `BAS_SESSION_SECRET` | Preview + Production | Required; random and at least 32 characters |
| `BAS_ADMIN_USER_ID` | Preview + Production | Required; UUID of the invited Supabase administrator |
| `BAS_AUTH_STORE_MODE` | Preview + Production | Must be `supabase` |
| `BAS_WORKER_SECRET` | Preview + Production | Required; random and at least 32 characters |
| `BAS_ENABLE_PAID_GENERATION` | Preview + Production | Must remain `false` or unset |
| `GEMINI_API_KEY` | Server only | Optional; ignored while paid generation is disabled |
| `RUNWAY_API_KEY` | Server only | Optional; ignored while paid generation is disabled |

After setting variables, run `npm run security:audit-config` in a matching environment. The command prints names and status only.

## Safe database rollout

1. Create or select a non-production Supabase staging project with no production records.
2. Configure a staging-only database connection locally. Do not point migration tooling at production during this step.
3. Apply `20261029_spaces_private_beta.sql`, then `20261029_studio_durability.sql` in filename order.
4. Verify tables, RLS enablement, policies, private `studio-media` bucket, disabled global budget policy, session revocation, atomic login throttling, workspace import/restore, and owner isolation with two staging users.
5. Back up production and record row counts before any production migration.
6. Apply the same reviewed files to production in filename order during a maintenance window.
7. Insert the invited administrator into `studio_memberships` and set `BAS_ADMIN_USER_ID` to that existing `auth.users.id` in Vercel.
8. Redeploy Preview first and run authentication, persistence, media, and protected-API tests. Production remains blocked until these checks pass.

The migrations are additive and do not delete production records. They are not run automatically by builds or deployments.

## Local browser data import

The Dashboard, Space editor, and Image Studio retain their existing localStorage copies. After the migrations and server variables are available, opening each authenticated view imports an empty remote workspace from the local copy and then uses Supabase as the durable source. Keep the browser profile until the UI reports **Securely synced** or **Saved securely**. Inline data-URL media remains local; reselect those files once to upload them to the private `studio-media` bucket.
