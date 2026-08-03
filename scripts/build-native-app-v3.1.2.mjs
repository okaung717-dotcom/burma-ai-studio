import fs from "node:fs";

const path = "native-app/index.html";
let html = fs.readFileSync(path, "utf8");

function mustReplace(from, to, label) {
  if (!html.includes(from)) throw new Error(`Missing ${label}`);
  html = html.replace(from, to);
}

html = html
  .replaceAll("Burma AI Studio v3.1.0", "Burma AI Studio v3.1.2")
  .replaceAll("Burma AI Studio v3.1.1", "Burma AI Studio v3.1.2")
  .replaceAll("Native App · v3.1.0", "Native App · v3.1.2")
  .replaceAll("Native App · v3.1.1", "Native App · v3.1.2")
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

  const page = `<section class="page chatpage" data-page="chat"><section class="chat" aria-label="Burma AI Studio conversation"><header class="ch"><div class="chtop"><div><div class="ey"><span class="sp"></span>STUDIO CONVERSATION</div><h2 data-t="chatTitle">Let’s Build Something Remarkable.</h2></div><div class="on">ONLINE</div></div><p data-t="chatDesc">Discuss your AI video, campaign, script, visual direction, delivery or pricing in one focused conversation.</p><div class="prompts" id="prompts"></div></header><div class="msgs" id="msgs"></div><div class="att" id="att"></div><div class="emoji" id="emoji"></div><div class="composer"><div class="cr"><button class="tb" id="attach" aria-label="Attach files"><svg class="i"><use href="#clip"/></svg></button><button class="tb" id="smile" aria-label="Choose emoji"><svg class="i"><use href="#smile"/></svg></button><textarea id="input" rows="1" placeholder="Write a message about your project…"></textarea><button class="send" id="send" aria-label="Send message"><svg class="i"><use href="#send"/></svg></button></div><input id="file" type="file" multiple hidden></div></section></section>`;
  html = html.slice(0, pageStart) + page + html.slice(pageClose + "</section>".length);
}

const originalState = "const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],state={page:localStorage.basPage||'home',lang:localStorage.basLang==='MM'?'MM':'EN',theme:localStorage.basTheme||'light',files:[],messages:[]};";
const resilientState = "const safeGet=(k,f)=>{try{return localStorage.getItem(k)||f}catch{return f}},safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}},$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],savedPage=safeGet('basPage','home'),state={page:['home','services','stories','work','chat'].includes(savedPage)?savedPage:'home',lang:safeGet('basLang','EN')==='MM'?'MM':'EN',theme:safeGet('basTheme','light'),files:[],messages:[]};";
if (html.includes(originalState)) html = html.replace(originalState, resilientState);
if (!html.includes("const safeGet=")) throw new Error("Resilient storage bootstrap was not installed");

const oldGo = "function go(p){state.page=p;localStorage.basPage=p;$$('.page').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.nav===p));$('#title').textContent=title[p][state.lang==='MM'?1:0];$('#main').scrollTop=0}";
const previousGo = "function go(p){state.page=p;localStorage.basPage=p;$$('.page').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.nav===p));$('#title').textContent=title[p][state.lang==='MM'?1:0];$('#main').classList.toggle('chatmode',p==='chat');if(p!=='chat')$('#main').scrollTop=0;else requestAnimationFrame(()=>$('#msgs').scrollTop=$('#msgs').scrollHeight)}";
const resilientGo = "function go(p){if(!title[p])p='home';state.page=p;safeSet('basPage',p);$$('.page').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.nav===p));const pageTitle=$('#title'),main=$('#main'),messageList=$('#msgs');if(pageTitle)pageTitle.textContent=title[p][state.lang==='MM'?1:0];if(main){main.classList.toggle('chatmode',p==='chat');if(p!=='chat')main.scrollTop=0}if(p==='chat'&&messageList)requestAnimationFrame(()=>messageList.scrollTop=messageList.scrollHeight)}";
if (html.includes(oldGo)) html = html.replace(oldGo, resilientGo);
else if (html.includes(previousGo)) html = html.replace(previousGo, resilientGo);
if (!html.includes("if(!title[p])p='home'")) throw new Error("Resilient navigation was not installed");

html = html
  .replaceAll("localStorage.basTheme=state.theme", "safeSet('basTheme',state.theme)")
  .replaceAll("localStorage.basLang=state.lang", "safeSet('basLang',state.lang)")
  .replaceAll("localStorage.basChat=JSON.stringify(state.messages.slice(-40))", "safeSet('basChat',JSON.stringify(state.messages.slice(-40)))")
  .replaceAll("localStorage.basProfile=JSON.stringify({name:$('#name').value,company:$('#company').value})", "safeSet('basProfile',JSON.stringify({name:$('#name').value,company:$('#company').value}))")
  .replaceAll("JSON.parse(localStorage.basChat||'[]')", "JSON.parse(safeGet('basChat','[]'))")
  .replaceAll("JSON.parse(localStorage.basProfile||'{}')", "JSON.parse(safeGet('basProfile','{}'))");

const startupGuard = `<script>
(()=>{
  const hide=()=>{
    const splash=document.getElementById('splash');
    if(!splash)return;
    splash.classList.add('hide');
    splash.setAttribute('aria-hidden','true');
    window.setTimeout(()=>{splash.style.display='none'},520);
  };
  window.__basHideSplash=hide;
  try{
    const allowed=['home','services','stories','work','chat'];
    const saved=localStorage.getItem('basPage');
    if(!allowed.includes(saved||''))localStorage.setItem('basPage','home');
    const rawChat=localStorage.getItem('basChat');
    if(rawChat){const parsed=JSON.parse(rawChat);if(!Array.isArray(parsed))localStorage.removeItem('basChat')}
  }catch(error){console.warn('Native app storage recovery',error)}
  window.addEventListener('DOMContentLoaded',()=>window.setTimeout(hide,900),{once:true});
  window.addEventListener('load',()=>window.setTimeout(hide,650),{once:true});
  window.addEventListener('error',hide);
  window.addEventListener('unhandledrejection',hide);
  window.setTimeout(hide,1700);
})();
</script>`;
if (!html.includes("window.__basHideSplash")) {
  mustReplace("<body>\n", `<body>\n${startupGuard}\n`, "body startup anchor");
}

if (!html.includes("@keyframes basSplashFailsafe")) {
  mustReplace("</style>", `.splash{animation:basSplashFailsafe .01s linear 2.2s forwards}@keyframes basSplashFailsafe{to{opacity:0;visibility:hidden;pointer-events:none}}\n</style>`, "style closing anchor");
}

const oldFinish = "load();theme();lang();setTimeout(()=>$('#splash').classList.add('hide'),900);";
const newFinish = "try{load();theme();lang()}catch(error){console.error('Burma AI Studio startup recovery',error);state.page='home';safeSet('basPage','home');try{go('home')}catch(recoveryError){console.error('Home recovery failed',recoveryError)}}setTimeout(()=>{if(window.__basHideSplash)window.__basHideSplash();else{const splash=$('#splash');if(splash)splash.classList.add('hide')}},700);";
if (html.includes(oldFinish)) html = html.replace(oldFinish, newFinish);
if (!html.includes("Burma AI Studio startup recovery")) throw new Error("Startup recovery block was not installed");

for (const required of [
  "Burma AI Studio v3.1.2",
  'class="page chatpage"',
  'class="ch"',
  "chatmode",
  "window.__basHideSplash",
  "@keyframes basSplashFailsafe",
  "const safeGet=",
]) {
  if (!html.includes(required)) throw new Error(`Missing required native marker: ${required}`);
}
for (const retired of ['class="chatintro"', 'class="direct"']) {
  if (html.includes(retired)) throw new Error(`Retired Chat block remains: ${retired}`);
}

fs.writeFileSync(path, html);
console.log("Built resilient bundled native app v3.1.2 with startup recovery");
