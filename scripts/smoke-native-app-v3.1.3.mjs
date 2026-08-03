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
if (!splash) throw new Error("Splash element is missing");
if (!splash.classList.contains("hide") && splash.style.display !== "none") {
  throw new Error("Splash did not dismiss during the startup smoke test");
}

const activePage = document.querySelector(".page.active");
if (!activePage || activePage.getAttribute("data-page") !== "home") {
  throw new Error("Invalid saved navigation state was not recovered to Home");
}

const chatButton = document.querySelector('[data-nav="chat"]');
if (!chatButton) throw new Error("Chat navigation button is missing");
chatButton.click();
await wait(60);

const activeChat = document.querySelector('.page.active[data-page="chat"]');
const main = document.getElementById("main");
const bottomNav = document.querySelector(".bottom");
if (!activeChat || !main?.classList.contains("chatmode") || !bottomNav) {
  throw new Error("Chat screen did not activate after startup");
}

const input = document.getElementById("input");
const send = document.getElementById("sendMessage");
const emojiToggle = document.getElementById("emojiToggle");
const attach = document.getElementById("attach");
const composeField = document.querySelector(".composeField");
if (!input || input.tagName !== "TEXTAREA" || !send || send.tagName !== "BUTTON" || !emojiToggle || !attach || !composeField) {
  throw new Error("Telegram-style Chat composer is incomplete");
}

input.focus();
visualViewport.height = 480;
visualViewport.dispatch("resize");
await wait(350);
if (!document.body.classList.contains("keyboard-open")) {
  throw new Error("Keyboard-open layout was not activated after viewport reduction");
}
if (typeof dom.window.__basSyncKeyboardLayout !== "function") {
  throw new Error("Keyboard viewport synchronizer is unavailable");
}
if (document.documentElement.style.getPropertyValue("--app-height") !== "480px") {
  throw new Error("Native app height did not follow the visual viewport");
}

input.value = "Native keyboard layout smoke test";
send.click();
await wait(60);
if (!document.querySelector(".msg.user")) throw new Error("Chat message interaction failed");

emojiToggle.click();
if (!document.getElementById("emoji")?.classList.contains("show")) {
  throw new Error("Chat emoji control failed");
}

visualViewport.height = 800;
input.blur();
visualViewport.dispatch("resize");
await wait(400);
if (document.body.classList.contains("keyboard-open")) {
  throw new Error("Keyboard-open layout did not restore after keyboard dismissal");
}

if (errors.length) {
  throw new AggregateError(errors, "Native app emitted runtime errors");
}

console.log("Native startup, Chat spacing, keyboard resize and composer smoke test passed");
dom.window.close();
