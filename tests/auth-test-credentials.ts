import { createHash } from "node:crypto";

export const testToken = "burma-ai-studio-spaces-local-test-token-2026";
const digest = createHash("sha256").update(`${testToken}:administrator`).digest("hex");
export const testAdminPassword = `T!${digest.slice(0, 16)}a9`;
