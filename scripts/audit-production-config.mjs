import process from "node:process";
import fs from "node:fs";

if (fs.existsSync(".env.local") && typeof process.loadEnvFile === "function") process.loadEnvFile(".env.local");

const ownerOnly = process.env.BAS_OWNER_ONLY_BETA === "true";
const required = ownerOnly ? [
  "SUPABASE_URL",
  "SUPABASE_SERVER_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "BAS_SESSION_SECRET",
  "BAS_ADMIN_USER_ID",
] : [
  "SUPABASE_URL",
  "SUPABASE_SERVER_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "BAS_ADMIN_PASSWORD_HASH",
  "BAS_SESSION_SECRET",
  "BAS_ADMIN_USER_ID",
  "BAS_WORKER_SECRET",
];

const optionalDisabled = ["GEMINI_API_KEY", "RUNWAY_API_KEY"];
let failed = false;

for (const name of required) {
  const present = Boolean((process.env[name] || "").trim());
  console.log(`${name}: ${present ? "present" : "missing"}`);
  if (!present) failed = true;
}

console.log(`BAS_OWNER_ONLY_BETA: ${ownerOnly ? "enabled" : "disabled"}`);
if (ownerOnly && process.env.BAS_EMAIL_AUTH_ENABLED !== "true") {
  console.error("BAS_EMAIL_AUTH_ENABLED must be true for owner-only release.");
  failed = true;
}
const ownerUuid = process.env.BAS_ADMIN_USER_ID || "";
if (ownerOnly && !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(ownerUuid)) {
  console.error("BAS_ADMIN_USER_ID must be a valid UUID.");
  failed = true;
}
const prodUrl = process.env.SUPABASE_URL || "";
if (ownerOnly && prodUrl.replace(/\/+$/, "") !== "https://lfucxtlbbzanybvdxdkr.supabase.co") {
  console.error("Owner-only release must point to the correct production Supabase project (not staging).");
  failed = true;
}
const hash = process.env.BAS_ADMIN_PASSWORD_HASH || "";
const strongScrypt = /^scrypt\$N=65536,r=8,p=1\$[^$]+\$[^$]+$/.test(hash.replaceAll("\\$", "$"));
console.log(`BAS_ADMIN_PASSWORD_HASH_STRENGTH: ${ownerOnly ? "not-required-owner-only" : strongScrypt ? "current" : "upgrade-required"}`);
if (!ownerOnly && !strongScrypt) failed = true;

const sessionSecretStrong = (process.env.BAS_SESSION_SECRET || "").length >= 32;
console.log(`BAS_SESSION_SECRET_STRENGTH: ${sessionSecretStrong ? "valid" : "invalid-or-missing"}`);
if (!sessionSecretStrong) failed = true;

const durable = process.env.BAS_AUTH_STORE_MODE === "supabase";
console.log(`BAS_AUTH_STORE_MODE: ${ownerOnly ? "not-required-owner-only" : durable ? "supabase" : "missing-or-invalid"}`);
if (!ownerOnly && !durable) failed = true;

const paidDisabled = process.env.BAS_ENABLE_PAID_GENERATION !== "true";
console.log(`BAS_ENABLE_PAID_GENERATION: ${paidDisabled ? "disabled" : "enabled-blocker"}`);
if (!paidDisabled) failed = true;

for (const name of optionalDisabled) console.log(`${name}: ${process.env[name] ? "present-but-unused" : "missing"}`);

if (failed) {
  console.error("Production configuration is not ready. Values were intentionally not displayed.");
  process.exitCode = 1;
} else {
  console.log("Production configuration names and security constraints are ready. Values were not displayed.");
}
