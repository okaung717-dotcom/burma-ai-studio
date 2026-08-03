import fs from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = fs.readFileSync("native-app/index.html", "utf8");
const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => errors.push(error));
virtualConsole.on("error", (...args) => errors.push(new Error(args.map(String).join(" "))));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "https://native.burmaaistudio.local/",
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
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
await wait(50);

const activeChat = document.querySelector('.page.active[data-page="chat"]');
const main = document.getElementById("main");
if (!activeChat || !main?.classList.contains("chatmode")) {
  throw new Error("Chat screen did not activate after startup");
}

const input = document.getElementById("input");
const send = document.getElementById("send");
if (!(input instanceof dom.window.HTMLTextAreaElement) || !(send instanceof dom.window.HTMLButtonElement)) {
  throw new Error("Chat composer is not available");
}
input.value = "Native startup smoke test";
send.click();
await wait(50);
if (!document.querySelector(".msg.user")) throw new Error("Chat message interaction failed");

if (errors.length) {
  throw new AggregateError(errors, "Native app emitted runtime errors");
}

console.log("Native app startup, navigation and Chat smoke test passed");
dom.window.close();
