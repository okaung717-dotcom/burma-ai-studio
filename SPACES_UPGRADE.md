# Burma AI Studio Spaces

Spaces is the primary private-beta application at `/studio/spaces`. The root route
now sends invited, authenticated users to Spaces and sends everyone else to the
private-beta login at `/login`; the former public marketing experience is no
longer routed.

## Server configuration

- `BAS_BETA_EMAILS`: comma-separated invited account emails (maximum five operationally).
- `BAS_ADMIN_EMAILS`: comma-separated administrator emails.
- `BAS_ALLOW_PUBLIC_SIGNUP`: set to `true` only to reopen public website registration.
- `BAS_DISABLE_DEV_SPACES`: set to `true` to require the invite list in development.
- `BAS_ENABLE_PAID_GENERATION`: remains `false` until the durable queue and atomic budget reservation are deployed.
- `BAS_WORKER_SECRET`: random server-only value of at least 32 characters for the durable worker endpoint.
- `GEMINI_API_KEY`: server-only Gemini credential; never prefix with `NEXT_PUBLIC_`.
- `RUNWAY_API_KEY`: server-only Runway credential; never prefix with `NEXT_PUBLIC_`.

Without paid generation enabled, the generation endpoint returns a clearly labeled demo workflow result and does not contact a provider. The current canvas and project persistence uses browser local storage for workflow evaluation. It must be migrated to the supplied RLS schema before multi-device production use.

## Database

Review and manually apply `supabase/migrations/20261029_spaces_private_beta.sql`. It is additive and leaves the global budget policy disabled with emergency stop enabled.

The migration includes an idempotent atomic reservation RPC, serialized daily global/per-user budget enforcement, provider-model allowlisting, a usage ledger, lease-based `SKIP LOCKED` job claiming, atomic completion/release, and a private `studio-media` bucket. `/api/studio/worker` requires a constant-time checked bearer secret. Provider adapters remain deliberately fail-closed, so applying the schema alone cannot spend provider funds.

## Demo workflow test

`npm run test:spaces` launches the installed Chrome browser against a development-only header-gated test identity. That identity is unavailable in production and requires an explicit test token of at least 24 characters.

## Rollback

The verified, secret-free pre-removal source archive is stored outside the
repository at `/private/tmp/burma-ai-studio-pre-legacy-removal.a9vwwi`. Verify its
recorded SHA-256 digest before extracting it. The original Android-authentication
backup remains at `/private/tmp/burma-ai-studio-pre-spaces.B4K7rb`.

To roll back the UI replacement, restore tracked source files from the pre-removal
archive while preserving the current `.env.local`, `.git`, database, and generated
build directories. Do not drop migrated tables; disabling access is the safe
rollback for database features and any table removal requires a separately reviewed
migration.

The pre-upgrade Android authentication backup is stored outside the repository in `/private/tmp/burma-ai-studio-pre-spaces.B4K7rb` with SHA-256 verification data.
