import fs from "node:fs";

const files = [
  "supabase/migrations/20261029_spaces_private_beta.sql",
  "supabase/migrations/20261029_studio_durability.sql",
];
const required = [
  "enable row level security",
  "studio_projects",
  "studio_spaces",
  "studio_pages",
  "studio_nodes",
  "studio_connections",
  "studio_assets",
  "studio_image_records",
  "studio_admin_sessions",
  "consume_studio_login_attempt",
  "studio-media",
  "emergency_stop",
];

const sql = files.map((file) => fs.readFileSync(file, "utf8")).join("\n").toLowerCase();
for (const marker of required) {
  if (!sql.includes(marker)) throw new Error(`Migration validation failed: missing ${marker}.`);
}
for (const dangerous of [/drop\s+table/i, /truncate\s+/i, /delete\s+from/i]) {
  if (dangerous.test(sql)) throw new Error(`Migration validation failed: destructive statement ${dangerous}.`);
}
console.log("Static migration safety checks passed. A staging PostgreSQL execution is still required before production.");
