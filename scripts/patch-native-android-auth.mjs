import fs from "node:fs";

const path = "native-app/index.html";
let html = fs.readFileSync(path, "utf8");

const preflight = `<style id="basAndroidAuthFailClosed">html.bas-android-auth-pending body>*:not(#basAndroidAuth):not(script){visibility:hidden!important;pointer-events:none!important}html.bas-android-auth-pending .bas-auth-gate{display:block!important}</style><script id="basAndroidAuthPreflight">(()=>{const c=window.Capacitor;const native=Boolean(c&&typeof c.isNativePlatform==="function"&&c.isNativePlatform());const android=Boolean(native&&typeof c.getPlatform==="function"&&c.getPlatform()==="android");console.info("[BAS Auth] preflight",{nativePlatform:native?"YES":"NO",android:android?"YES":"NO"});if(android)document.documentElement.classList.add("bas-android-auth-pending")})();</script>`;

const markup = `<section class="bas-auth-gate" id="basAndroidAuth" aria-hidden="false"><div class="bas-auth-scroll"><div class="bas-auth-shell"><header class="bas-auth-brand"><span class="bas-auth-brand-mark">BA</span><span><strong>Burma AI Studio</strong><small>Cinematic AI Production</small></span></header><section class="bas-auth-card"><div class="bas-auth-check is-visible" data-auth-check><div class="bas-auth-spinner" aria-hidden="true"></div><h1>Checking your session</h1><p>Preparing your secure studio workspace…</p></div><div class="bas-auth-view" data-auth-view hidden><p class="bas-auth-kicker">SECURE APP ACCESS</p><h1 data-auth-title>Welcome back</h1><p class="bas-auth-subtitle" data-auth-subtitle>Sign in to continue to your studio workspace.</p><form class="bas-auth-form" novalidate><label class="bas-auth-field"><span>Email address</span><div class="bas-auth-control"><input id="basAuthEmail" type="email" inputmode="email" autocomplete="email" maxlength="254" autocapitalize="none" spellcheck="false" placeholder="you@example.com"></div></label><label class="bas-auth-field"><span>Password</span><div class="bas-auth-control"><input id="basAuthPassword" type="password" autocomplete="current-password" maxlength="128" placeholder="Enter your password"><button class="bas-auth-password-toggle" type="button" data-auth-password-toggle>Show</button></div></label><label class="bas-auth-field" data-auth-confirm-field hidden><span>Confirm password</span><div class="bas-auth-control"><input id="basAuthConfirm" type="password" autocomplete="new-password" maxlength="128" placeholder="Repeat your password"></div></label><p class="bas-auth-error" data-auth-error role="alert"></p><p class="bas-auth-success" data-auth-success role="status"></p><button class="bas-auth-primary" type="submit" data-auth-submit>Sign In</button></form><p class="bas-auth-switch"><span data-auth-switch-copy>Don't have an account?</span> <button type="button" data-auth-switch>Create Account</button></p></div></section></div></section>`;

const gateStart = html.indexOf('<section class="bas-auth-gate" id="basAndroidAuth"');
if (gateStart >= 0) {
  const gateEnd = html.indexOf('<svg width="0" height="0">', gateStart);
  if (gateEnd < 0) throw new Error("Android auth gate end marker was not found");
  html = html.slice(0, gateStart) + markup + "\n" + html.slice(gateEnd);
} else {
  html = html.replace("<body>", `<body>\n${markup}`);
}
if (!html.includes('id="basAndroidAuthPreflight"')) html = html.replace("</head>", `${preflight}\n</head>`);
if (!html.includes('href="android-auth.css"')) html = html.replace("</head>", '<link rel="stylesheet" href="android-auth.css">\n</head>');
if (!html.includes('src="android-auth.js"')) html = html.replace("</body>", '<script src="android-auth-config.js"></script>\n<script src="android-auth.js"></script>\n</body>');

for (const marker of ['id="basAndroidAuthPreflight"', 'id="basAndroidAuthFailClosed"', 'id="basAndroidAuth"', 'id="basAuthEmail"', 'id="basAuthPassword"', 'id="basAuthConfirm"', 'src="android-auth-config.js"', 'src="android-auth.js"', 'href="android-auth.css"']) {
  if (!html.includes(marker)) throw new Error(`Missing Android auth marker: ${marker}`);
}
for (const retired of ['data-auth-google', 'Continue with Google', 'data-auth-name-field', 'bas-auth-divider']) {
  if (html.includes(retired)) throw new Error(`Retired Android auth marker remains: ${retired}`);
}
fs.writeFileSync(path, html);
console.log("Installed Android-only authentication gate in bundled native app");
