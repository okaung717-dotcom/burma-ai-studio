import fs from "node:fs";

const path = "native-app/index.html";
let html = fs.readFileSync(path, "utf8");

html = html
  .replaceAll("Burma AI Studio v3.1.0", "Burma AI Studio v3.1.1")
  .replaceAll("Native App · v3.1.0", "Native App · v3.1.1")
  .replace(".app{height:100%;display:flex;", ".app{height:100dvh;display:flex;");

if (!html.includes('class="page chatpage"')) {
  const cssStart = html.indexOf(".chatintro{");
  const cssEnd = html.indexOf(".att{", cssStart);
  if (cssStart < 0 || cssEnd < 0) throw new Error("Compact Chat CSS anchors were not found");

  const css = `.main.chatmode{overflow:hidden;padding:12px 14px calc(96px + env(safe-area-inset-bottom,0px))}.chatpage.active{display:flex;height:100%;min-height:0;flex-direction:column}.chat{margin:0;display:flex;min-height:0;flex:1;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:30px;background:var(--s);box-shadow:0 18px 52px #270d111f}.ch{flex:0 0 auto;padding:15px 15px 12px;border-bottom:1px solid var(--line);background:radial-gradient(circle at 92% 0,#eac7702e,transparent 32%),linear-gradient(145deg,#190a0d,#35111a);color:#fff}.chtop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.ch .ey{font-size:8px;letter-spacing:.18em}.ch h2{margin:8px 0 0;max-width:270px;font-size:21px;line-height:1.02}.ch p{margin:8px 0 0;color:#d8c4ad;font-size:10px;font-weight:650;line-height:1.45}.on{display:flex;flex:0 0 auto;align-items:center;gap:6px;margin-top:2px;color:#f0d483;font-size:8px;font-weight:950}.on:before{content:"";display:block;width:7px;height:7px;margin:0;border-radius:50%;background:#5bdf8a;box-shadow:0 0 0 4px #5bdf8a1f}.prompts{display:flex;gap:7px;overflow-x:auto;margin-top:11px;padding:1px 0 2px;scrollbar-width:none}.prompts::-webkit-scrollbar{display:none}.prompt{flex:0 0 auto;max-width:245px;min-height:34px;padding:8px 11px;border:1px solid #ffffff24;border-radius:999px;background:#ffffff13;color:#fff;text-align:left;font-size:9px;font-weight:850;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.msgs{display:grid;min-height:0;flex:1;align-content:start;gap:12px;overflow-y:auto;padding:16px 14px;background:linear-gradient(180deg,var(--s2),var(--bg));overscroll-behavior:contain}.msg{display:flex;gap:9px;align-items:flex-end}.msg.user{justify-content:flex-end}.av{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:11px;background:var(--wine);color:#fff;font:800 11px Georgia}.bubble{max-width:84%;padding:12px 13px;border-radius:18px 18px 18px 6px;background:var(--soft);font-size:12px;line-height:1.5}.user .bubble{border-radius:18px 18px 6px 18px;background:var(--wine);color:#fff}.bubble time{display:block;margin-top:6px;color:var(--muted);font-size:8px}`;
  html = html.slice(0, cssStart) + css + html.slice(cssEnd);

  const pageStart = html.indexOf('<section class="page" data-page="chat">');
  const mainEnd = html.indexOf("</main>", pageStart);
  const pageClose = html.lastIndexOf("</section>", mainEnd);
  if (pageStart < 0 || mainEnd < 0 || pageClose < pageStart) throw new Error("Compact Chat page anchors were not found");

  const page = `<section class="page chatpage" data-page="chat"><section class="chat" aria-label="Burma AI Studio conversation"><header class="ch"><div class="chtop"><div><div class="ey"><span class="sp"></span>STUDIO CONVERSATION</div><h2 data-t="chatTitle">Let’s Build Something Remarkable.</h2></div><div class="on">ONLINE</div></div><p data-t="chatDesc">Discuss your AI video, campaign, script, visual direction, delivery or pricing in one focused conversation.</p><div class="prompts" id="prompts"></div></header><div class="msgs" id="msgs"></div><div class="att" id="att"></div><div class="emoji" id="emoji"></div><div class="composer"><div class="cr"><button class="tb" id="attach"><svg class="i"><use href="#clip"/></svg></button><button class="tb" id="smile"><svg class="i"><use href="#smile"/></svg></button><textarea id="input" rows="1" placeholder="Write a message about your project…"></textarea><button class="send" id="send"><svg class="i"><use href="#send"/></svg></button></div><input id="file" type="file" multiple hidden></div></section></section>`;
  html = html.slice(0, pageStart) + page + html.slice(pageClose + "</section>".length);

  const oldGo = "function go(p){state.page=p;localStorage.basPage=p;$$('.page').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.nav===p));$('#title').textContent=title[p][state.lang==='MM'?1:0];$('#main').scrollTop=0}";
  const newGo = "function go(p){state.page=p;localStorage.basPage=p;$$('.page').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.nav===p));$('#title').textContent=title[p][state.lang==='MM'?1:0];$('#main').classList.toggle('chatmode',p==='chat');if(p!=='chat')$('#main').scrollTop=0;else requestAnimationFrame(()=>$('#msgs').scrollTop=$('#msgs').scrollHeight)}";
  if (!html.includes(oldGo)) throw new Error("Compact navigation function was not found");
  html = html.replace(oldGo, newGo);
}

for (const required of ["Burma AI Studio v3.1.1", 'class="page chatpage"', 'class="ch"', "chatmode"]) {
  if (!html.includes(required)) throw new Error(`Missing required Chat marker: ${required}`);
}
for (const retired of ['class="chatintro"', 'class="direct"']) {
  if (html.includes(retired)) throw new Error(`Retired Chat block remains: ${retired}`);
}

fs.writeFileSync(path, html);
console.log("Patched native Chat to a single full-screen panel for v3.1.1");
