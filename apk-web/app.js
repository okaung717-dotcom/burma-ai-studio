(() => {
  const app = document.getElementById('app');
  const state = {
    lang: localStorage.getItem('bas_apk_lang') === 'MM' ? 'MM' : 'EN',
    theme: localStorage.getItem('bas_apk_theme') === 'dark' ? 'dark' : 'light',
    screen: 'home',
    intro: localStorage.getItem('bas_apk_v201_intro') !== 'done'
  };

  const copy = {
    EN: {
      studio:'Mobile Creative Studio',home:'Home',services:'Services',work:'Work',plans:'Plans',chat:'Chat',
      eyebrow:'BURMA AI STUDIO · CINEMATIC AI PRODUCTION',hero1:'Make every frame',hero2:'feel expensive.',
      heroText:'Premium AI films, cinematic campaigns and original stories — shaped with human creative direction for brands that want to be remembered.',
      start:'Start a project',watch:'Watch our work',metrics:['Videos crafted','Fast turnaround','Creative direction'],
      creative:'Creative system',creativeTitle:'One studio. Four powerful ways to make your brand move.',
      serviceNames:['Cinematic brand films','AI presenter campaigns','Architecture & process films','TikTok / Reels performance shorts'],
      serviceDescriptions:['High-impact brand stories with dramatic visual direction, premium product framing and cinematic pacing.','Natural Burmese and English presenters for launches, explainers, offers and trust-building campaigns.','Clear visual storytelling for property, engineering, factories, systems and complex processes.','Fast hooks, sharp scripts and vertical-first creative direction designed to stop the scroll.'],
      flow:'Production flow',flowTitle:'Fast enough for social. Polished enough for a flagship campaign.',
      flowItems:[['Brief','Share the goal, audience, platform and product.'],['Build','Script, visual language, AI production and cinematic polish are developed together.'],['Launch','Review, refine and receive the final campaign-ready video.']],
      workTitle:'Selected cinematic directions',plansTitle:'Choose how you want to work with the studio.',
      contactTitle:'Bring us the brief. We’ll build the visual world.',contactText:'Send your product, platform, duration, style and deadline. The studio will guide the next step clearly.',
      introTitle:'Enter your creative studio.',introText:'Your premium mobile workspace for AI films, brand campaigns, original stories and direct studio communication.',
      signIn:'Sign in',signUp:'Create account',continue:'Continue to studio',name:'Your name',email:'Email address',password:'Password',
      appearance:'Appearance',language:'Language',settings:'Studio settings',light:'Light',dark:'Dark'
    },
    MM: {
      studio:'Mobile Creative Studio',home:'ပင်မ',services:'ဝန်ဆောင်မှု',work:'လက်ရာ',plans:'Plans',chat:'Chat',
      eyebrow:'BURMA AI STUDIO · CINEMATIC AI PRODUCTION',hero1:'Brand ကို မြင်တာနဲ့',hero2:'မှတ်မိသွားစေမယ့် AI Video.',
      heroText:'Cinematic direction၊ premium visual language နဲ့ AI production ကိုပေါင်းစပ်ပြီး Brand ကို ပိုကြီး၊ ပိုခိုင်မာ၊ ပိုမှတ်မိလွယ်အောင် ဖန်တီးပေးပါတယ်။',
      start:'Project စတင်ရန်',watch:'လက်ရာများကြည့်ရန်',metrics:['ဖန်တီးပြီး Video','Fast turnaround','Creative direction'],
      creative:'Creative system',creativeTitle:'Studio တစ်ခုတည်းနဲ့ Brand ကို လှုပ်ရှားစေမယ့် powerful direction လေးမျိုး။',
      serviceNames:['Cinematic brand films','AI presenter campaigns','Architecture & process films','TikTok / Reels performance shorts'],
      serviceDescriptions:['Brand ad နဲ့ product campaign တွေအတွက် cinematic visual direction ဖန်တီးပေးပါတယ်။','မြန်မာနဲ့ English presenter campaigns တွေအတွက် polished commercial finish ဖန်တီးပေးပါတယ်။','Property၊ engineering၊ factory နဲ့ complex process တွေအတွက် ရှင်းလင်းတဲ့ visual storytelling ဖန်တီးပေးပါတယ်။','Hook ကောင်း၊ script တိုနဲ့ vertical-first short videos တွေဖန်တီးပေးပါတယ်။'],
      flow:'Production flow',flowTitle:'Social အတွက်မြန်ပြီး flagship campaign အတွက် premium ဖြစ်တဲ့ workflow.',
      flowItems:[['Brief','Goal၊ audience၊ platform နဲ့ product ကိုပြောပါ။'],['Build','Script၊ visual language၊ AI production နဲ့ cinematic polish ကို တစ်ခုတည်းအဖြစ်တည်ဆောက်မယ်။'],['Launch','Review၊ refine ပြီး final campaign video ကိုရယူပါ။']],
      workTitle:'ရွေးချယ်နိုင်တဲ့ Cinematic Direction များ',plansTitle:'Studio နဲ့ လက်တွဲမယ့် ပုံစံကိုရွေးပါ။',
      contactTitle:'Brief ကိုပေးပါ။ Visual world တစ်ခုလုံး ဖန်တီးပေးမယ်။',contactText:'Product၊ platform၊ duration၊ style နဲ့ deadline ကိုပို့ပါ။ နောက်တစ်ဆင့်ကို Studio က ရှင်းရှင်းလင်းလင်းလမ်းညွှန်ပေးမယ်။',
      introTitle:'Creative Studio ထဲဝင်ပါ။',introText:'AI films၊ brand campaigns၊ original stories နဲ့ studio communication အားလုံးအတွက် premium mobile workspace ဖြစ်ပါတယ်။',
      signIn:'Sign in',signUp:'Account ဖွင့်ရန်',continue:'Studio ထဲဝင်ရန်',name:'အမည်',email:'Email လိပ်စာ',password:'Password',
      appearance:'Theme',language:'ဘာသာစကား',settings:'Studio settings',light:'Light',dark:'Dark'
    }
  };

  const works = [
    ['DVM3o2Wqcys','Cinematic Trailer','Human-directed AI film'],
    ['IrukbYGHhQs','Architecture Film','Premium process storytelling'],
    ['T9p2lqcETCE','Cinematic Commercial','High-end brand campaign'],
    ['wJjyMQ3bjt4','AI Presenter Campaign','Natural presenter production']
  ];

  function esc(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function setTheme(){document.documentElement.classList.toggle('dark',state.theme==='dark');document.querySelector('meta[name="theme-color"]').setAttribute('content',state.theme==='dark'?'#0e0708':'#fff8f0');}
  function t(){return copy[state.lang];}
  function title(){const x=t();return state.screen==='services'?x.services:state.screen==='work'?x.work:state.screen==='plans'?x.plans:state.screen==='chat'?x.chat:x.home;}

  function home(){const x=t();return `<div class="stack">
    <section class="hero"><div class="hero-media"></div><div class="hero-content"><p class="eyebrow">✦ ${x.eyebrow}</p><h1>${x.hero1}<em>${x.hero2}</em></h1><p>${x.heroText}</p><div class="actions"><a class="primary" data-screen="chat" href="#">◯ ${x.start} →</a><a class="secondary" data-screen="work" href="#">▶ ${x.watch}</a></div></div></section>
    <section class="metrics"><article class="metric"><strong>100+</strong><span>${x.metrics[0]}</span></article><article class="metric"><strong>48h</strong><span>${x.metrics[1]}</span></article><article class="metric"><strong>Pro</strong><span>${x.metrics[2]}</span></article></section>
    <section class="panel"><p class="kicker">${x.creative}</p><h2>${x.creativeTitle}</h2><div class="service-list">${x.serviceNames.map((n,i)=>`<div class="service-row"><b>${String(i+1).padStart(2,'0')}</b><span>${n}</span><span>›</span></div>`).join('')}</div></section>
    <section class="panel"><p class="kicker">${x.flow}</p><h2>${x.flowTitle}</h2><div class="flow">${x.flowItems.map((f,i)=>`<article><i>${i+1}</i><div><strong>${f[0]}</strong><p>${f[1]}</p></div></article>`).join('')}</div></section>
    <a class="cta" data-screen="chat" href="#"><span>${x.contactTitle}</span><span>→</span></a>
  </div>`;}

  function services(){const x=t(),cats=['BRAND FILM','PRESENTER','PROCESS','SHORT FORM'],icons=['▣','◉','▤','▰'];return `<div class="stack"><section class="page-hero"><p>CREATIVE CAPABILITIES</p><h1>${x.creativeTitle}</h1></section>${x.serviceNames.map((n,i)=>`<article class="service-card"><div class="card-top"><span class="card-icon">${icons[i]}</span><span class="pill">${cats[i]}</span></div><h2>${n}</h2><p>${x.serviceDescriptions[i]}</p><footer class="card-footer"><span class="ready">✓ Production ready</span><a class="card-link" data-screen="work" href="#">Explore →</a></footer></article>`).join('')}</div>`;}

  function work(){const x=t();return `<div class="stack"><section class="page-hero"><p>SELECTED WORK</p><h1>${x.workTitle}</h1></section>${works.map((w,i)=>`<article class="video-card"><iframe src="https://www.youtube-nocookie.com/embed/${w[0]}?playsinline=1&rel=0&modestbranding=1" title="${esc(w[1])}" allowfullscreen></iframe><div class="video-copy"><small>${String(i+1).padStart(2,'0')}</small><h2>${w[1]}</h2><p>${w[2]}</p></div></article>`).join('')}</div>`;}

  function plans(){const x=t(),names=['Project Start','Studio Pro','Brand Partner'],labels=['Project-based','Ongoing production','Custom partnership'],texts=state.lang==='MM'?['Campaign တစ်ခု သို့မဟုတ် launch တစ်ခုအတွက်။','Content ကိုပုံမှန်ထုတ်လုပ်နေတဲ့ Brand တွေအတွက်။','Campaign မျိုးစုံလုပ်နေတဲ့ Business တွေအတွက်။']:['For one focused campaign or launch.','For brands creating content regularly.','For businesses managing multiple campaigns.'];return `<div class="stack"><section class="page-hero"><p>STUDIO PLANS</p><h1>${x.plansTitle}</h1></section>${names.map((n,i)=>`<article class="plan ${i===1?'featured':''}"><div class="card-top"><span class="card-icon">${['◇','✦','▦'][i]}</span><span class="pill">${labels[i]}</span></div><h2>${n}</h2><p>${texts[i]}</p><ul><li>Creative direction</li><li>Production planning</li><li>Direct studio communication</li></ul><a data-screen="chat" href="#">Choose plan →</a></article>`).join('')}</div>`;}

  function chat(){const x=t();return `<div class="stack"><section class="page-hero"><p>DIRECT STUDIO LINE</p><h1>${x.contactTitle}</h1><span>${x.contactText}</span></section><a class="contact-card" href="tg://resolve?phone=959671010011"><span class="contact-icon">➤</span><div><strong>Telegram</strong><span>+95 9 671 010 011</span></div></a><a class="contact-card" href="mailto:okaung717@gmail.com"><span class="contact-icon">✉</span><div><strong>Email</strong><span>okaung717@gmail.com</span></div></a><article class="story-card"><div class="story-icon">✦</div><h2>Burma AI Studio AI</h2><p>Send your brief through Telegram or email. The studio will guide the production direction clearly.</p></article></div>`;}

  function intro(){const x=t();return `<section class="intro ${state.intro?'':'hidden'}" id="intro"><div class="intro-brand"><span class="brand-mark">BA</span><span>BURMA AI STUDIO</span></div><div class="intro-copy"><p>✦ ${x.eyebrow}</p><h1>${x.introTitle}</h1><span>${x.introText}</span></div><form class="auth" id="introForm"><div class="auth-tabs"><button type="button" class="active" id="signinTab">${x.signIn}</button><button type="button" id="signupTab">${x.signUp}</button></div><div class="field hidden-name" id="nameField" style="display:none"><span>◉</span><input id="nameInput" placeholder="${x.name}"></div><div class="field"><span>✉</span><input type="email" id="emailInput" placeholder="${x.email}" required></div><div class="field"><span>●</span><input type="password" id="passwordInput" placeholder="${x.password}" minlength="8" required></div><button class="auth-submit">${x.continue}</button><p class="auth-note">Secure local app access. Your email and password are not sent to Vercel.</p></form></section>`;}

  function sheet(){const x=t();return `<div class="sheet-backdrop" id="sheetBackdrop"><div class="sheet"><div class="sheet-head"><h2>${x.settings}</h2><button class="icon-btn" id="closeSheet">×</button></div><div class="setting-row"><span>${x.appearance}</span><button class="toggle" id="themeToggle">${state.theme==='dark'?x.dark:x.light}</button></div><div class="setting-row"><span>${x.language}</span><button class="toggle" id="langToggle">${state.lang}</button></div><div class="setting-row"><span>APK Version</span><strong>2.0.1</strong></div></div></div>`;}

  function render(){setTheme();const x=t();const content=state.screen==='services'?services():state.screen==='work'?work():state.screen==='plans'?plans():state.screen==='chat'?chat():home();app.innerHTML=`<div class="app"><header class="topbar"><div class="brand"><span class="brand-mark">BA</span><div class="brand-copy"><strong>Burma AI Studio</strong><span>${title()}</span></div></div><button class="icon-btn" id="settingsBtn">⌘</button></header><main class="screen active">${content}</main><nav class="bottom-nav">${[['home','⌂',x.home],['services','▦',x.services],['ai','✦','AI'],['work','▣',x.work],['chat','◯',x.chat]].map(([id,ico,label])=>`<button class="nav-btn ${id==='ai'?'ai':''} ${state.screen===id?'active':''}" data-screen="${id==='ai'?'chat':id}"><span class="nav-ico">${ico}</span><span>${label}</span></button>`).join('')}</nav>${sheet()}${intro()}</div>`;bind();}

  function bind(){document.querySelectorAll('[data-screen]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();state.screen=el.dataset.screen;window.scrollTo(0,0);render();}));document.getElementById('settingsBtn')?.addEventListener('click',()=>document.getElementById('sheetBackdrop').classList.add('open'));document.getElementById('closeSheet')?.addEventListener('click',()=>document.getElementById('sheetBackdrop').classList.remove('open'));document.getElementById('sheetBackdrop')?.addEventListener('click',e=>{if(e.target.id==='sheetBackdrop')e.currentTarget.classList.remove('open')});document.getElementById('themeToggle')?.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';localStorage.setItem('bas_apk_theme',state.theme);render();});document.getElementById('langToggle')?.addEventListener('click',()=>{state.lang=state.lang==='MM'?'EN':'MM';localStorage.setItem('bas_apk_lang',state.lang);render();});let signup=false;const sign=document.getElementById('signinTab'),up=document.getElementById('signupTab'),name=document.getElementById('nameField');sign?.addEventListener('click',()=>{signup=false;sign.classList.add('active');up.classList.remove('active');name.style.display='none'});up?.addEventListener('click',()=>{signup=true;up.classList.add('active');sign.classList.remove('active');name.style.display='flex'});document.getElementById('introForm')?.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('bas_apk_v201_intro','done');localStorage.setItem('bas_apk_profile',JSON.stringify({name:document.getElementById('nameInput')?.value||'Burma AI Studio Client',email:document.getElementById('emailInput')?.value||''}));state.intro=false;document.getElementById('intro')?.classList.add('hidden');});}

  render();
})();
