import { createHash } from "node:crypto";

export const testToken = "burma-ai-studio-spaces-local-test-token-2026";
const value = createHash("sha256").update(`${testToken}:administrator`).digest().readUInt32BE(0);
export const testAdminPassword = String(1000 + (value % 9000));
