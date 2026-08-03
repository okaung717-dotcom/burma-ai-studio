import fs from "node:fs";

const path = "native-app/index.html";
let html = fs.readFileSync(path, "utf8");

html = html
  .replaceAll("Burma AI Studio v3.1.0", "Burma AI Studio v3.1.1")
  .replaceAll("Native App · v3.1.0", "Native App · v3.1.1")
  .replace(".app{height:100%;display:flex;", ".app{height:100dvh;display:flex;")
  .replace(".app {height:100%;display:flex;", ".app {height:100dvh;display:flex;");

const alreadyPatched = /class=["'][^"']*\bchat-page\b/.test(html) && /\bchat-mode\b/.test(html);

if (!alreadyPatched) {
  const cssMatch = /\.chat-intro\s*\{/.exec(html);
  if (!cssMatch) throw new Error("Chat CSS start anchor was not found");
  const cssStart = cssMatch.index;
  const attachmentMatch = /\.attachment-preview\s*\{/.exec(html.slice(cssStart));
  if (!attachmentMatch) throw new Error("Chat CSS end anchor was not found");
  const cssEnd = cssStart + attachmentMatch.index;

  const chatCss = `.main.chat-mode{overflow:hidden;padding:12px 14px calc(96px + env(safe-area-inset-bottom,0px))}.chat-page.active{display:flex;height:100%;min-height:0;flex-direction:column}.chat-shell{margin:0;display:flex;min-height:0;flex:1;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:30px;background:var(--surface);box-shadow:0 18px 52px rgba(39,13,17,.12)}
    .chat-shell-head{flex:0 0 auto;padding:15px 15px 12px;border-bottom:1px solid rgba(228,209,182,.72);background:radial-gradient(circle at 92% 0,rgba(234,199,112,.18),transparent 32%),linear-gradient(145deg,#190a0d,#35111a);color:#fff}.chat-shell-head-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.chat-shell-head .eyebrow{font-size:8px;letter-spacing:.18em}.chat-shell-head h2{margin:8px 0 0;max-width:270px;font-size:21px;line-height:1.02;letter-spacing:-.04em}.chat-shell-head p{margin:8px 0 0;color:#d8c4ad;font-size:10px;font-weight:650;line-height:1.45}.online{display:flex;flex:0 0 auto;align-items:center;gap:6px;margin-top:2px;color:#f0d483;font-size:8px;font-weight:950;text-transform:uppercase;letter-spacing:.11em}.online:before{content:"";width:7px;height:7px;border-radius:50%;background:#5bdf8a;box-shadow:0 0 0 4px rgba(91,223,138,.12)}
    .quick-prompts{display:flex;gap:7px;overflow-x:auto;margin-top:11px;padding:1px 0 2px;scrollbar-width:none}.quick-prompts::-webkit-scrollbar{display:none}.quick-prompt{flex:0 0 auto;max-width:245px;min-height:34px;padding:8px 11px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.075);color:#fff;text-align:left;font-size:9px;font-weight:850;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.quick-prompt:active{background:rgba(255,255,255,.15)}
    .messages{display:grid;min-height:0;flex:1;align-content:start;gap:12px;overflow-y:auto;padding:16px 14px;background:linear-gradient(180deg,var(--surface-strong),var(--bg));overscroll-behavior:contain}.message{display:flex;gap:9px;align-items:flex-end}.message.user{justify-content:flex-end}.avatar{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:11px;background:var(--wine);color:#fff;font:800 11px Georgia,serif}.bubble{max-width:84%;padding:12px 13px;border-radius:18px 18px 18px 6px;background:var(--soft);font-size:12px;line-height:1.5}.message.user .bubble{border-radius:18px 18px 6px 18px;background:var(--wine);color:#fff}.bubble time{display:block;margin-top:6px;color:var(--muted);font-size:8px;font-weight:800}.message.user .bubble time{color:rgba(255,255,255,.67)}
    `;
  html = html.slice(0, cssStart) + chatCss + html.slice(cssEnd);

  const pageAttr = html.indexOf('data-page="chat"');
  if (pageAttr < 0) throw new Error("Chat page attribute was not found");
  const pageStart = html.lastIndexOf("<section", pageAttr);
  const mainEnd = html.indexOf("</main>", pageAttr);
  const pageCloseStart = html.lastIndexOf("</section>", mainEnd);
  if (pageStart < 0 || mainEnd < 0 || pageCloseStart < pageStart) throw new Error("Chat page boundaries were not found");
  const pageEnd = pageCloseStart + "</section>".length;

  const chatPage = `<section class="page chat-page" data-page="chat">
        <section class="chat-shell" aria-label="Burma AI Studio conversation">
          <header class="chat-shell-head">
            <div class="chat-shell-head-top">
              <div>
                <div class="eyebrow"><span class="spark"></span><span data-t="chatEyebrow">STUDIO CONVERSATION</span></div>
                <h2 data-t="chatTitle">Let’s Build Something Remarkable.</h2>
              </div>
              <div class="online" data-t="online">Online</div>
            </div>
            <p data-t="chatDesc">Discuss your AI video, campaign, script, visual direction, delivery or pricing in one focused conversation.</p>
            <div class="quick-prompts" id="quickPrompts" aria-label="Quick project prompts"></div>
          </header>
          <div class="messages" id="messages"></div>
          <div class="attachment-preview" id="attachmentPreview"></div>
          <div class="emoji-row" id="emojiRow"></div>
          <div class="composer">
            <div class="composer-row">
              <div class="composer-tools">
                <button class="tool-btn" id="attachBtn" aria-label="Attach file"><svg class="icon"><use href="#i-paperclip"/></svg></button>
                <button class="tool-btn" id="emojiBtn" aria-label="Emoji"><svg class="icon"><use href="#i-smile"/></svg></button>
              </div>
              <textarea id="chatInput" rows="1" data-placeholder="chatPlaceholder" placeholder="Write a message about your project…"></textarea>
              <button class="send-btn" id="sendBtn" aria-label="Send"><svg class="icon"><use href="#i-send"/></svg></button>
            </div>
            <input id="fileInput" type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" hidden />
          </div>
        </section>
      </section>`;
  html = html.slice(0, pageStart) + chatPage + html.slice(pageEnd);

  const navigationPattern = /(\$\("#screenTitle"\)\.textContent=titles\[page\]\[state\.lang==="MM"\?1:0\];\s*)if\(scroll\)\$\("#main"\)\.scrollTo\(\{top:0,behavior:"smooth"\}\);/;
  if (!navigationPattern.test(html)) throw new Error("Navigation layout anchor was not found");
  html = html.replace(
    navigationPattern,
    `$1$("#main").classList.toggle("chat-mode",page==="chat");\n      if(scroll&&!$("#main").classList.contains("chat-mode"))$("#main").scrollTo({top:0,behavior:"smooth"});\n      if(page==="chat")requestAnimationFrame(()=>{$("#messages").scrollTop=$("#messages").scrollHeight});`
  );
}

for (const required of ["Burma AI Studio v3.1.1", "chat-page", "chat-shell-head", "chat-mode"]) {
  if (!html.includes(required)) throw new Error(`Missing required native chat marker: ${required}`);
}
for (const retired of ['class="chat-intro"', 'class="direct-grid"']) {
  if (html.includes(retired)) throw new Error(`Retired chat block remains: ${retired}`);
}

fs.writeFileSync(path, html);
console.log("Patched native app chat to full-screen single-panel v3.1.1");
