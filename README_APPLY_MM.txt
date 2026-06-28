Burma AI Studio — Redis to Supabase patch

I could inspect the GitHub repo, but the GitHub write action was blocked by the tool safety layer, so I could not push these files directly.

Apply these replacement files into your repo:

1) Create:
   app/lib/supabase.ts

2) Replace:
   app/lib/redis.ts
   app/api/leads/route.ts
   app/api/inbox/route.ts

3) Create:
   supabase/schema.sql
   .env.example

4) In Supabase:
   - Open SQL Editor.
   - Paste and run supabase/schema.sql.

5) In Vercel -> Project -> Settings -> Environment Variables, add:
   SUPABASE_URL
   SUPABASE_SERVER_KEY

Use your Supabase Project URL for SUPABASE_URL.
Use the private service role value from Supabase Project Settings -> API for SUPABASE_SERVER_KEY.
Do not put this value in frontend code and do not commit it to GitHub.

6) Redeploy Vercel.

After this patch:
- leads go to Supabase public.leads
- lead statuses go to public.lead_statuses
- chat logs go to public.chat_logs
- chat states go to public.chat_states
- portfolio items go to public.portfolio_items
- analytics events go to public.analytics_events
- content CMS goes to public.content_settings
- rate limiting goes to public.rate_limits

The existing API response shapes are kept compatible with your admin UI.
