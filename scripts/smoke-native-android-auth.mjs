import fs from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const authSource = fs.readFileSync("native-app/android-auth.js", "utf8");
const sourceHtml = fs.readFileSync("native-app/index.html", "utf8");
for (const retired of ["data-auth-google", "Continue with Google", "data-auth-name-field", "bas-auth-divider"]) {
  if (sourceHtml.includes(retired) || authSource.includes(retired)) throw new Error(`Retired Android auth marker remains: ${retired}`);
}

const configuredHtml = sourceHtml
  .replace('<link rel="stylesheet" href="android-auth.css">', "")
  .replace('<script src="android-auth-config.js"></script>', '<script>window.__BAS_ANDROID_AUTH_CONFIG__={supabaseUrl:"https://example.supabase.co",publishableKey:"sb_publishable_test"}</script>')
  .replace('<script src="android-auth.js"></script>', `<script>${authSource}</script>`);
const wait = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

function runtime(html, fetchImpl) {
  let secureValue = "";
  const requests = [];
  const plugin = {
    async saveSession({ value }) { secureValue = value; },
    async loadSession() { return { value: secureValue }; },
    async clearSession() { secureValue = ""; },
  };
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error));
  const dom = new JSDOM(html, {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    url: "https://localhost/", virtualConsole,
    beforeParse(window) {
      window.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => "android",
        isPluginAvailable: (name) => name === "AndroidAuth",
        Plugins: { AndroidAuth: plugin },
      };
      window.fetch = async (url, options) => {
        requests.push({ url, options });
        return fetchImpl(url, options);
      };
    },
  });
  return { dom, errors, requests, getSecureValue: () => secureValue };
}

const responses = [];
const app = runtime(configuredHtml, async () => responses.shift() || ({ ok: false, status: 401, json: async () => ({ message: "Invalid login credentials" }) }));
await wait(100);
const doc = app.dom.window.document;
const gate = doc.getElementById("basAndroidAuth");
if (!gate?.classList.contains("is-active") || !doc.documentElement.classList.contains("bas-android-auth-pending")) throw new Error("Android startup was not fail-closed");
if (doc.querySelector("[data-auth-view]")?.hidden) throw new Error("Unauthenticated Sign In form did not appear");
if (doc.querySelector("[data-auth-confirm-field]")?.hidden !== true) throw new Error("Confirm Password appeared in Sign In mode");
if (gate.querySelectorAll('input:not([hidden])').length !== 3) throw new Error("Unexpected Android authentication input markup");
if (gate.textContent.includes("Display Name") || gate.textContent.includes("Google") || gate.textContent.includes("OR")) throw new Error("Removed authentication UI is still visible");

doc.getElementById("basAuthEmail").value = "bad";
doc.getElementById("basAuthPassword").value = "12345678";
doc.querySelector(".bas-auth-form").dispatchEvent(new app.dom.window.Event("submit", { bubbles: true, cancelable: true }));
await wait();
if (!doc.querySelector("[data-auth-error]")?.textContent.includes("valid email")) throw new Error("Email validation was not shown");

doc.getElementById("basAuthEmail").value = "existing@example.com";
doc.getElementById("basAuthPassword").value = "short";
responses.push({ ok: false, status: 400, json: async () => ({ message: "Invalid login credentials" }) });
doc.querySelector(".bas-auth-form").dispatchEvent(new app.dom.window.Event("submit", { bubbles: true, cancelable: true }));
await wait();
if (!app.requests.at(-1)?.url.endsWith("/auth/v1/token?grant_type=password")) throw new Error("Sign In rejected an existing account password before contacting Supabase");
if (!doc.querySelector("[data-auth-error]")?.textContent.includes("Incorrect email or password")) throw new Error("Invalid credentials were mislabeled as a network failure");

doc.querySelector("[data-auth-switch]").click();
if (doc.querySelector("[data-auth-confirm-field]")?.hidden) throw new Error("Confirm Password did not appear in Create Account mode");
doc.getElementById("basAuthEmail").value = "new@example.com";
doc.getElementById("basAuthPassword").value = "12345678";
doc.getElementById("basAuthConfirm").value = "different";
doc.querySelector(".bas-auth-form").dispatchEvent(new app.dom.window.Event("submit", { bubbles: true, cancelable: true }));
await wait();
if (!doc.querySelector("[data-auth-error]")?.textContent.includes("do not match")) throw new Error("Password confirmation validation was not shown");
doc.getElementById("basAuthConfirm").value = "12345678";
responses.push({ ok: true, status: 200, json: async () => ({ user: { id: "user-new", identities: [{ id: "identity-1" }], email: "new@example.com" } }) });
doc.querySelector(".bas-auth-form").dispatchEvent(new app.dom.window.Event("submit", { bubbles: true, cancelable: true }));
await wait();
const signupRequest = app.requests.at(-1);
const signupBody = JSON.parse(signupRequest.options.body);
if (!signupRequest.url.endsWith("/auth/v1/signup") || Object.keys(signupBody).sort().join(",") !== "email,password") throw new Error("Create Account did not use unified public Supabase signup");
if (!doc.querySelector("[data-auth-success]")?.textContent.includes("Check your email")) throw new Error("Email confirmation state was not shown");

doc.getElementById("basAuthPassword").value = "12345678";
responses.push({ ok: true, status: 200, json: async () => ({ access_token: "access", refresh_token: "refresh", expires_in: 3600, user: { id: "same-supabase-user", email: "new@example.com" } }) });
doc.querySelector(".bas-auth-form").dispatchEvent(new app.dom.window.Event("submit", { bubbles: true, cancelable: true }));
await wait();
if (gate.classList.contains("is-active") || doc.documentElement.classList.contains("bas-android-auth-pending")) throw new Error("Successful Sign In did not unlock the app");
if (!app.getSecureValue().includes("same-supabase-user")) throw new Error("Supabase session was not stored securely");
await app.dom.window.__basAndroidAuth.signOut();
if (!gate.classList.contains("is-active") || !doc.documentElement.classList.contains("bas-android-auth-pending") || app.getSecureValue()) throw new Error("Sign Out did not restore the fail-closed gate");
if (app.errors.length) throw new AggregateError(app.errors, "Android auth emitted runtime errors");
app.dom.window.close();

const missing = runtime(configuredHtml.replace('publishableKey:"sb_publishable_test"', 'publishableKey:""'), async () => { throw new Error("Missing configuration must not make a request"); });
await wait(100);
const missingDoc = missing.dom.window.document;
if (!missingDoc.getElementById("basAndroidAuth")?.classList.contains("is-active") || !missingDoc.documentElement.classList.contains("bas-android-auth-pending")) throw new Error("Missing configuration bypassed the auth gate");
if (!missingDoc.querySelector("[data-auth-submit]")?.disabled || !missingDoc.querySelector("[data-auth-switch]")?.disabled) throw new Error("Missing configuration did not disable authentication actions");
missing.dom.window.close();

const css = fs.readFileSync("native-app/android-auth.css", "utf8");
if (!/\.bas-auth-brand\s*\{[^}]*justify-content:\s*center/.test(css)) throw new Error("Android branding lockup is not horizontally centered");
if (!/\.bas-auth-brand strong,\s*\.bas-auth-brand small\s*\{[^}]*white-space:\s*nowrap/.test(css)) throw new Error("Android branding lockup can wrap at supported phone widths");

const offline = runtime(configuredHtml, async () => { throw new TypeError("Failed to fetch"); });
await wait(100);
const offlineDoc = offline.dom.window.document;
offlineDoc.getElementById("basAuthEmail").value = "person@example.com";
offlineDoc.getElementById("basAuthPassword").value = "12345678";
offlineDoc.querySelector(".bas-auth-form").dispatchEvent(new offline.dom.window.Event("submit", { bubbles: true, cancelable: true }));
await wait();
if (!offlineDoc.querySelector("[data-auth-error]")?.textContent.includes("couldn't connect") || !offlineDoc.documentElement.classList.contains("bas-android-auth-pending")) throw new Error("Network failure did not remain fail-closed with a safe message");
offline.dom.window.close();

console.log("Android email/password auth, unified signup, mode isolation, session, logout and fail-closed smoke tests passed");
