import fs from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = fs.readFileSync("native-app/index.html", "utf8");
const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => errors.push(error));
virtualConsole.on("error", (...args) => errors.push(new Error(args.map(String).join(" "))));

const viewportListeners = new Map();
const visualViewport = {
  width: 390,
  height: 800,
  offsetTop: 0,
  addEventListener(type, listener) {
    const listeners = viewportListeners.get(type) || [];
    listeners.push(listener);
    viewportListeners.set(type, listeners);
  },
  removeEventListener(type, listener) {
    viewportListeners.set(type, (viewportListeners.get(type) || []).filter((item) => item !== listener));
  },
  dispatch(type) {
    for (const listener of viewportListeners.get(type) || []) listener(new Event(type));
  },
};

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "https://native.burmaaistudio.local/",
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
    Object.defineProperty(window, "visualViewport", { value: visualViewport, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
    Object.defineProperty(window, "innerWidth", { value: 390, writable: true, configurable: true });
    window.localStorage.setItem("basPage", "project");
    window.localStorage.setItem("basChat", JSON.stringify({ corrupted: true }));
  },
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await wait(2100);

const { document } = dom.window;
const splash = document.getElementById("splash");
if (!splash || (!splash.classList.contains("hide") && splash.style.display !== "none")) {
  throw new Error("Splash did not dismiss during startup");
}

const appIcon = document.querySelector(".logo.appIcon img");
if (!appIcon?.getAttribute("src")?.startsWith("data:image/png;base64,")) {
  throw new Error("Header does not use the packaged Android app icon");
}

const activePage = document.querySelector(".page.active");
if (!activePage || activePage.getAttribute("data-page") !== "home") {
  throw new Error("Invalid saved navigation state was not recovered to Home");
}

const chatButton = document.querySelector('[data-nav="chat"]');
chatButton?.click();
await wait(60);
const input = document.getElementById("input");
const send = document.getElementById("sendMessage");
if (!input || !send || !document.querySelector(".composeField")) {
  throw new Error("Telegram-style Chat composer is incomplete");
}
input.focus();
visualViewport.height = 480;
visualViewport.dispatch("resize");
await wait(350);
if (!document.body.classList.contains("keyboard-open")) throw new Error("Keyboard layout did not activate");
input.value = "Native v3.1.4 smoke test";
send.click();
await wait(60);
if (!document.querySelector(".msg.user")) throw new Error("Chat send interaction failed");
visualViewport.height = 800;
input.blur();
visualViewport.dispatch("resize");
await wait(400);
if (document.body.classList.contains("keyboard-open")) throw new Error("Keyboard layout did not restore");

const settingsButton = document.getElementById("settings");
settingsButton?.click();
await wait(30);
const settingsDrawer = document.getElementById("drawer");
if (!settingsDrawer?.classList.contains("open")) throw new Error("Settings drawer did not open");
for (const view of ["profile", "projects", "personalization", "support", "privacy"]) {
  if (!document.querySelector(`[data-settings-view="${view}"]`)) throw new Error(`Missing settings row: ${view}`);
}
if (!document.getElementById("logout")) throw new Error("Logout setting is missing");

document.querySelector('[data-settings-view="profile"]')?.click();
await wait(20);
if (!document.getElementById("settingsDetail")?.classList.contains("open")) throw new Error("Profile detail did not open");
const name = document.getElementById("name");
const email = document.getElementById("email");
const company = document.getElementById("company");
if (!name || !email || !company) throw new Error("Profile fields are incomplete");
name.value = "Okkar";
email.value = "okkar@example.com";
company.value = "Burma AI Studio";
document.getElementById("save")?.click();
await wait(20);
const storedProfile = JSON.parse(dom.window.localStorage.getItem("basProfile") || "{}");
if (storedProfile.email !== "okkar@example.com" || document.getElementById("profileDisplay")?.textContent !== "Okkar") {
  throw new Error("Profile settings did not save or refresh");
}
document.getElementById("settingsBack")?.click();
if (document.getElementById("settingsRoot")?.classList.contains("hidden")) throw new Error("Settings root did not restore");
document.getElementById("close")?.click();

const notificationButton = document.getElementById("notifications");
notificationButton?.click();
await wait(20);
if (!document.getElementById("notificationDrawer")?.classList.contains("open")) {
  throw new Error("Notification drawer did not open");
}
if (document.querySelector(".notifyDot")) throw new Error("Notification unread dot did not clear");
document.getElementById("closeNotifications")?.click();

if (errors.length) throw new AggregateError(errors, "Native app emitted runtime errors");
console.log("Native startup, keyboard, app-icon header, settings and notification smoke test passed");
dom.window.close();
