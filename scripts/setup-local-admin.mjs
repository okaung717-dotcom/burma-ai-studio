import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";
import process from "node:process";

const envPath = new URL("../.env.local", import.meta.url);

function hiddenPrompt(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal so the password can remain hidden.");
  }
  return new Promise((resolve, reject) => {
    let value = "";
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const finish = (error) => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
      if (error) reject(error); else resolve(value);
    };
    const onData = (character) => {
      if (character === "\u0003") return finish(new Error("Setup cancelled."));
      if (character === "\r" || character === "\n") return finish();
      if (character === "\u007f" || character === "\b") { value = value.slice(0, -1); return; }
      if (character >= " ") value += character;
    };
    process.stdin.on("data", onData);
  });
}

function setVariable(source, name, value) {
  const line = `${name}=${value}`;
  const expression = new RegExp(`^${name}=.*$`, "m");
  if (expression.test(source)) return source.replace(expression, line);
  return `${source.trimEnd()}${source.trim() ? "\n" : ""}${line}\n`;
}

try {
  const password = await hiddenPrompt("Enter the owner's four-digit password: ");
  if (!/^\d{4}$/.test(password)) throw new Error("Password must contain exactly four digits.");
  const confirmation = await hiddenPrompt("Confirm the password: ");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const encodedHash = `scrypt$N=32768,r=8,p=1$${salt.toString("base64url")}$${hash.toString("base64url")}`;
  const dotenvSafeHash = encodedHash.replaceAll("$", "\\$");
  let source = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  source = setVariable(source, "BAS_ADMIN_PASSWORD_HASH", dotenvSafeHash);
  if (!/^BAS_SESSION_SECRET=.{32,}$/m.test(source)) {
    source = setVariable(source, "BAS_SESSION_SECRET", randomBytes(48).toString("base64url"));
  }
  fs.writeFileSync(envPath, source, { encoding: "utf8", mode: 0o600 });
  fs.chmodSync(envPath, 0o600);
  console.log("Local administrator credentials configured. Restart the development server.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Setup failed.");
  process.exitCode = 1;
}
