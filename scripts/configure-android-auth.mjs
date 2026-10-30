import fs from "node:fs";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

function legacyRole(key) {
  if (key.split(".").length !== 3) return "";
  try {
    const part = key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(part, "base64").toString("utf8")).role || "";
  } catch { return ""; }
}

function safePublishableKey(value) {
  const key = String(value || "").trim().replace(/^["']|["']$/g, "");
  if (!key) return "";
  if (key.startsWith("sb_secret_") || legacyRole(key) === "service_role") {
    throw new Error("Refusing to place a Supabase server/service-role key in the Android bundle.");
  }
  if (!key.startsWith("sb_publishable_") && legacyRole(key) !== "anon") {
    throw new Error("Android auth requires a Supabase publishable key or legacy anon JWT.");
  }
  return key;
}

loadLocalEnv();
const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const url = rawUrl.trim().replace(/^["']|["']$/g, "").replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = safePublishableKey(
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
);
if (url && !/^https:\/\/[^/]+$/.test(url)) throw new Error("SUPABASE_URL must be an HTTPS origin.");
if (!url || !key) {
  throw new Error("Android auth requires SUPABASE_URL and a client-safe SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY).");
}

const config = {
  supabaseUrl: url,
  publishableKey: key,
};
fs.writeFileSync(
  "native-app/android-auth-config.js",
  `window.__BAS_ANDROID_AUTH_CONFIG__ = Object.freeze(${JSON.stringify(config, null, 2)});\n`
);
console.log("Configured Android Supabase authentication with a client-safe key.");
