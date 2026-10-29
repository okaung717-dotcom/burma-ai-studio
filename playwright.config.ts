import { defineConfig } from "@playwright/test";
import { randomBytes, scryptSync } from "node:crypto";
import { testAdminPassword, testToken } from "./tests/auth-test-credentials";

const salt = randomBytes(16);
const hash = scryptSync(testAdminPassword, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:3117",
    browserName: "chromium",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    extraHTTPHeaders: { "x-bas-spaces-test": testToken },
    launchOptions: { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" },
  },
  webServer: {
    command: "npm run dev -- --webpack --hostname 127.0.0.1 --port 3117",
    env: {
      BAS_SPACES_TEST_TOKEN: testToken,
      BAS_ADMIN_PASSWORD_HASH: `scrypt$N=32768,r=8,p=1$${salt.toString("base64url")}$${hash.toString("base64url")}`.replaceAll("$", "\\$"),
      BAS_SESSION_SECRET: randomBytes(48).toString("base64url"),
    },
    url: "http://127.0.0.1:3117/studio/spaces",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
