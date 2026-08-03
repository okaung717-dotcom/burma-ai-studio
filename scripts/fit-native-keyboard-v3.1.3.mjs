import fs from "node:fs";

const path = "native-app/index.html";
let html = fs.readFileSync(path, "utf8");

function replaceRequired(from, to, label) {
  if (!html.includes(from)) throw new Error(`Missing ${label}`);
  html = html.replace(from, () => to);
}

html = html
  .replaceAll("Burma AI Studio v3.1.2", "Burma AI Studio v3.1.3")
  .replaceAll("Native App · v3.1.2", "Native App · v3.1.3");

const oldComposer = `<div class="composer"><div class="cr"><button class="tb" id="attach" aria-label="Attach files"><svg class="i"><use href="#clip"/></svg></button><button class="tb" id="emojiToggle" aria-label="Choose emoji"><svg class="i"><use href="#smile"/></svg></button><textarea id="input" rows="1" placeholder="Write a message about your project…"></textarea><button class="send" id="sendMessage" aria-label="Send message"><svg class="i"><use href="#send"/></svg></button></div><input id="file" type="file" multiple hidden></div>`;
const newComposer = `<div class="composer"><div class="cr"><div class="composeField"><button class="composeIcon" id="emojiToggle" aria-label="Choose emoji"><svg class="i"><use href="#smile"/></svg></button><textarea id="input" rows="1" enterkeyhint="send" inputmode="text" placeholder="Message"></textarea><button class="composeIcon" id="attach" aria-label="Attach files"><svg class="i"><use href="#clip"/></svg></button></div><button class="send" id="sendMessage" aria-label="Send message"><svg class="i"><use href="#send"/></svg></button></div><input id="file" type="file" multiple hidden></div>`;
replaceRequired(oldComposer, newComposer, "single-row Chat composer");

replaceRequired(
  "$('#input').placeholder=state.lang==='MM'?'သင့် Project အကြောင်းရေးပါ…':'Write a message about your project…';",
  "$('#input').placeholder=state.lang==='MM'?'စာရေးပါ…':'Message';",
  "compact localized Chat placeholder",
);

const keyboardCss = `
/* Native keyboard-fit layout v3.1.3 */
:root{--app-height:100dvh}
.app{height:var(--app-height)!important;min-height:0}
.main.chatmode{padding:12px 14px calc(112px + env(safe-area-inset-bottom,0px))!important}
.chatpage.active,.chat{min-height:0}
.composer{flex:0 0 auto;padding:10px 10px 11px;background:var(--s)}
.cr{display:grid!important;grid-template-columns:minmax(0,1fr) 50px;gap:8px;align-items:end}
.composeField{display:grid;min-width:0;grid-template-columns:42px minmax(0,1fr) 42px;align-items:end;overflow:hidden;border:1px solid var(--line);border-radius:22px;background:var(--bg);transition:border-color .18s ease,box-shadow .18s ease}
.composeField:focus-within{border-color:var(--gold);box-shadow:0 0 0 2px color-mix(in srgb,var(--gold) 18%,transparent)}
.composeIcon{width:42px;height:48px;display:grid;place-items:center;border:0;background:transparent;color:var(--muted)}
.composeField textarea{width:100%;min-width:0;min-height:48px!important;max-height:96px!important;margin:0;padding:12px 3px!important;overflow-y:auto;border:0!important;border-radius:0!important;outline:0;background:transparent!important;color:var(--ink);line-height:22px;box-shadow:none!important}
.composeField textarea::placeholder{color:var(--muted);opacity:.82}
.send{width:50px;height:50px;flex:0 0 50px;border-radius:18px;box-shadow:0 10px 24px color-mix(in srgb,var(--wine) 28%,transparent)}
.bottom{transition:opacity .18s ease,transform .22s ease,visibility .18s ease}
body.keyboard-open .bottom{opacity:0;visibility:hidden;pointer-events:none;transform:translateY(calc(100% + 28px))}
body.keyboard-open .main.chatmode{padding:6px 8px 0!important}
body.keyboard-open .chat{border-radius:22px 22px 0 0;box-shadow:none}
body.keyboard-open .ch{display:none}
body.keyboard-open .composer{padding:8px 8px max(8px,env(safe-area-inset-bottom,0px))}
body.keyboard-open .msgs{padding:12px 12px 16px}
body.keyboard-open .emoji.show,body.keyboard-open .att.show{max-height:92px;overflow:auto}
`;
if (!html.includes("Native keyboard-fit layout v3.1.3")) {
  replaceRequired("</style>", `${keyboardCss}\n</style>`, "style closing tag");
}

const keyboardScript = `<script>
(()=>{
  const root=document.documentElement;
  const body=document.body;
  const input=document.getElementById('input');
  const messages=document.getElementById('msgs');
  const viewport=window.visualViewport;
  let widest=viewport?.width||window.innerWidth||0;
  let maximumHeight=Math.max(window.innerHeight||0,viewport?.height||0);

  const scrollMessages=()=>{
    if(messages)messages.scrollTop=messages.scrollHeight;
  };

  const sync=(forcedState)=>{
    const width=viewport?.width||window.innerWidth||widest;
    const height=viewport?.height||window.innerHeight||maximumHeight;
    if(Math.abs(width-widest)>80){
      widest=width;
      maximumHeight=height;
    }
    if(height>maximumHeight)maximumHeight=height;
    root.style.setProperty('--app-height',Math.max(320,Math.round(height))+'px');
    const focused=document.activeElement===input;
    const keyboardOpen=typeof forcedState==='boolean'
      ? forcedState
      : focused&&(maximumHeight-height>Math.max(120,maximumHeight*.16));
    body.classList.toggle('keyboard-open',keyboardOpen);
    if(keyboardOpen)requestAnimationFrame(scrollMessages);
    return keyboardOpen;
  };

  window.__basSyncKeyboardLayout=sync;
  window.__basSetKeyboardState=(open)=>sync(Boolean(open));

  const schedule=()=>{
    requestAnimationFrame(()=>sync());
    window.setTimeout(()=>sync(),80);
    window.setTimeout(()=>sync(),260);
  };

  viewport?.addEventListener('resize',schedule);
  viewport?.addEventListener('scroll',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',()=>window.setTimeout(()=>{
    maximumHeight=viewport?.height||window.innerHeight||maximumHeight;
    widest=viewport?.width||window.innerWidth||widest;
    sync(false);
  },320));

  input?.addEventListener('focus',schedule);
  input?.addEventListener('input',()=>requestAnimationFrame(scrollMessages));
  input?.addEventListener('blur',()=>window.setTimeout(()=>{
    body.classList.remove('keyboard-open');
    sync(false);
  },160));

  sync(false);
})();
</script>`;
if (!html.includes("window.__basSyncKeyboardLayout")) {
  replaceRequired("</body>", `${keyboardScript}\n</body>`, "body closing tag");
}

for (const required of [
  "Burma AI Studio v3.1.3",
  "Native keyboard-fit layout v3.1.3",
  'class="composeField"',
  "window.__basSyncKeyboardLayout",
  "keyboard-open",
  "calc(112px + env(safe-area-inset-bottom,0px))",
]) {
  if (!html.includes(required)) throw new Error(`Missing v3.1.3 marker: ${required}`);
}

fs.writeFileSync(path, html);
console.log("Applied native Chat spacing and Telegram-style keyboard layout for v3.1.3");
