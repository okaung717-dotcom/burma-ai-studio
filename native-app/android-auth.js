(() => {
  "use strict";
  const log = (event, details = {}) => console.info(`[BAS Auth] ${event}`, details);
  log("bootstrap started");
  const config = window.__BAS_ANDROID_AUTH_CONFIG__ || {};
  const capacitor = window.Capacitor;
  const nativePlatform = Boolean(capacitor?.isNativePlatform?.());
  const platform = capacitor?.getPlatform?.() || "unavailable";
  const nativeAndroid = nativePlatform && platform === "android";
  log("platform detected", { nativePlatform: nativePlatform ? "YES" : "NO", platform, android: nativeAndroid ? "YES" : "NO" });
  const gate = document.getElementById("basAndroidAuth");
  if (!gate || !nativeAndroid) { if (gate) gate.setAttribute("aria-hidden", "true"); return; }

  gate.classList.add("is-active");
  gate.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("bas-android-auth-locked", "bas-android-auth-pending");
  log("auth gate shown");
  const pluginAvailable = Boolean(capacitor.Plugins?.AndroidAuth && (typeof capacitor.isPluginAvailable !== "function" || capacitor.isPluginAvailable("AndroidAuth")));
  const AndroidAuth = pluginAvailable ? capacitor.Plugins.AndroidAuth : null;
  const configured = /^https:\/\//.test(config.supabaseUrl || "") && Boolean(config.publishableKey);
  log("plugin state", { AndroidAuth: pluginAvailable ? "AVAILABLE" : "MISSING" });
  log("configuration state", { supabaseUrl: /^https:\/\//.test(config.supabaseUrl || "") ? "SET" : "MISSING", publishableKey: config.publishableKey ? "SET" : "MISSING" });

  const $ = (selector) => gate.querySelector(selector);
  const state = { busy: false, mode: "signin", session: null };
  const ui = {
    check: $("[data-auth-check]"), view: $("[data-auth-view]"), form: $("form"), title: $("[data-auth-title]"),
    subtitle: $("[data-auth-subtitle]"), email: $("#basAuthEmail"), password: $("#basAuthPassword"),
    confirmField: $("[data-auth-confirm-field]"), confirm: $("#basAuthConfirm"), submit: $("[data-auth-submit]"),
    switchButton: $("[data-auth-switch]"), switchCopy: $("[data-auth-switch-copy]"), error: $("[data-auth-error]"),
    success: $("[data-auth-success]"), toggle: $("[data-auth-password-toggle]"),
  };

  function message(text, kind = "error") {
    ui.error.classList.toggle("is-visible", kind === "error" && Boolean(text));
    ui.success.classList.toggle("is-visible", kind === "success" && Boolean(text));
    ui.error.textContent = kind === "error" ? text : "";
    ui.success.textContent = kind === "success" ? text : "";
  }
  function friendlyError(error, status = 0) {
    const raw = String(error?.message || error?.error_description || error?.msg || error?.error || "").toLowerCase();
    if (!navigator.onLine || error instanceof TypeError || raw.includes("failed to fetch") || raw.includes("network")) return "We couldn't connect right now. Check your internet connection and try again.";
    if (raw.includes("abort") || raw.includes("timeout")) return "The connection took too long. Please try again.";
    if (raw.includes("invalid login") || raw.includes("invalid credentials")) return "Incorrect email or password.";
    if (raw.includes("email not confirmed")) return "Please confirm your email before signing in.";
    if (raw.includes("already registered") || raw.includes("already exists") || raw.includes("email_exists")) return "An account with this email already exists. Sign in instead.";
    if (raw.includes("invalid api key") || raw.includes("api key") || (status === 401 && raw.includes("key"))) return "Sign in is temporarily unavailable. Please try again shortly.";
    if (status === 429 || raw.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
    if (status >= 500) return "Sign in is temporarily unavailable. Please try again shortly.";
    return "We couldn't complete that request. Please try again.";
  }
  function setBusy(value, label = "") {
    state.busy = value; ui.submit.disabled = value; ui.switchButton.disabled = value;
    ui.submit.textContent = value ? label : state.mode === "signin" ? "Sign In" : "Create Account";
  }
  function showForm() { ui.check.classList.remove("is-visible"); ui.view.hidden = false; }
  function showUnavailable(text) { showForm(); for (const control of gate.querySelectorAll("input, button")) control.disabled = true; message(text); }
  function setMode(mode) {
    state.mode = mode; message("");
    const signup = mode === "signup";
    ui.confirmField.hidden = !signup; ui.confirm.required = signup; ui.confirm.value = "";
    ui.title.textContent = signup ? "Create your account" : "Welcome back";
    ui.subtitle.textContent = signup ? "Use your email to create your Burma AI Studio account." : "Sign in to continue to your studio workspace.";
    ui.submit.textContent = signup ? "Create Account" : "Sign In";
    ui.switchCopy.textContent = signup ? "Already have an account?" : "Don't have an account?";
    ui.switchButton.textContent = signup ? "Sign In" : "Create Account";
    ui.password.autocomplete = signup ? "new-password" : "current-password";
  }
  async function request(path, options = {}, timeout = 15000) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(`${String(config.supabaseUrl).replace(/\/+$/, "")}/auth/v1${path}`, {
        ...options, cache: "no-store", signal: controller.signal,
        headers: { apikey: config.publishableKey, "Content-Type": "application/json", ...(options.headers || {}) },
      });
      return { response, payload: await response.json().catch(() => ({})) };
    } finally { clearTimeout(timer); }
  }
  function syncLocalProfile(user) {
    if (!user) return;
    try {
      const current = JSON.parse(localStorage.getItem("basProfile") || "{}");
      localStorage.setItem("basProfile", JSON.stringify({ ...current, name: String(current.name || user.email?.split("@")[0] || "").slice(0, 80), email: String(user.email || current.email || "").slice(0, 254) }));
    } catch {}
  }
  async function saveSession(payload) {
    const expiresAt = Date.now() + Math.max(60, Number(payload.expires_in) || 3600) * 1000;
    state.session = { accessToken: payload.access_token, refreshToken: payload.refresh_token, expiresAt, user: payload.user || null };
    await AndroidAuth.saveSession({ value: JSON.stringify({ session: state.session }) });
    syncLocalProfile(state.session.user);
  }
  async function clearSecureSession() { state.session = null; await AndroidAuth.clearSession(); }
  async function validateAccess(accessToken) {
    if (!accessToken) return null;
    const { response, payload } = await request("/user", { headers: { Authorization: `Bearer ${accessToken}` } });
    return response.ok && payload?.id ? payload : null;
  }
  async function refreshSession(refreshToken) {
    if (!refreshToken) return false;
    const { response, payload } = await request("/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) });
    if (!response.ok || !payload?.access_token) return false;
    await saveSession(payload); return true;
  }
  function enterApp() {
    gate.classList.remove("is-active"); gate.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("bas-android-auth-locked", "bas-android-auth-pending");
    log("auth gate hidden", { reason: "VALID_SESSION" }); window.__basHideSplash?.();
  }
  async function restore() {
    if (!pluginAvailable) { log("session state", { state: "UNAVAILABLE_PLUGIN" }); showUnavailable("Secure Android authentication is unavailable in this build."); return; }
    if (!configured) { log("session state", { state: "UNAVAILABLE_CONFIGURATION" }); showUnavailable("Sign in is temporarily unavailable. Please install an official configured build."); return; }
    try {
      const stored = await AndroidAuth.loadSession();
      if (stored?.value) state.session = JSON.parse(stored.value).session || null;
      if (!state.session) { log("session state", { state: "NONE" }); showForm(); return; }
      if (state.session.expiresAt > Date.now() + 90000) {
        const user = await validateAccess(state.session.accessToken);
        if (user) { log("session state", { state: "VALID" }); state.session.user = user; enterApp(); return; }
      }
      if (await refreshSession(state.session.refreshToken)) { log("session state", { state: "REFRESHED" }); enterApp(); return; }
      await clearSecureSession(); showForm(); log("session state", { state: "EXPIRED" }); message("Your session has expired. Please sign in again.");
    } catch (error) {
      showForm(); log("session state", { state: "ERROR", category: error instanceof TypeError ? "NETWORK" : "AUTH" }); message(friendlyError(error));
    }
  }
  function validateForm() {
    const email = ui.email.value.trim().toLowerCase(); const password = ui.password.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
    if (!password) return { error: "Enter your password." };
    if (state.mode === "signup" && password.length < 8) return { error: "Password must be at least 8 characters." };
    if (password.length > 128) return { error: "Password is too long." };
    if (state.mode === "signup" && password !== ui.confirm.value) return { error: "Passwords do not match." };
    return { email, password };
  }
  async function submit(event) {
    event.preventDefault(); if (state.busy || !configured || !pluginAvailable) return; message("");
    const input = validateForm(); if (input.error) { message(input.error); return; }
    setBusy(true, state.mode === "signin" ? "Signing in…" : "Creating account…");
    try {
      const path = state.mode === "signin" ? "/token?grant_type=password" : "/signup";
      const { response, payload } = await request(path, { method: "POST", body: JSON.stringify({ email: input.email, password: input.password }) });
      if (!response.ok) throw Object.assign(new Error(payload?.message || payload?.error_description || payload?.msg || "Authentication failed"), { status: response.status });
      if (state.mode === "signup" && Array.isArray(payload?.user?.identities) && payload.user.identities.length === 0) {
        setMode("signin"); ui.email.value = input.email; message("An account with this email already exists. Sign in instead."); return;
      }
      if (!payload?.access_token) {
        if (state.mode === "signup") {
          setMode("signin"); ui.email.value = input.email;
          message(`Check your email. We've sent a confirmation link to ${input.email}. Confirm your email to continue.`, "success"); return;
        }
        throw new Error("Authentication failed");
      }
      await saveSession(payload); enterApp();
    } catch (error) {
      log("request failed", { category: error instanceof TypeError ? "NETWORK" : "AUTH", status: Number(error?.status) || 0 });
      message(friendlyError(error, error?.status || 0));
    } finally { setBusy(false); }
  }
  async function signOut() {
    const token = state.session?.accessToken;
    try { if (token && configured) await request("/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }, 7000); } catch {}
    await clearSecureSession();
    try { localStorage.removeItem("basProfile"); localStorage.removeItem("basChat"); } catch {}
    showForm(); setMode("signin"); gate.classList.add("is-active"); gate.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("bas-android-auth-locked", "bas-android-auth-pending");
    log("auth gate shown", { reason: "SIGNED_OUT" }); message("You have signed out.", "success");
  }

  ui.form.addEventListener("submit", submit);
  ui.switchButton.addEventListener("click", () => setMode(state.mode === "signin" ? "signup" : "signin"));
  ui.toggle.addEventListener("click", () => {
    const visible = ui.password.type === "text"; ui.password.type = visible ? "password" : "text";
    ui.confirm.type = visible ? "password" : "text"; ui.toggle.textContent = visible ? "Show" : "Hide";
  });
  const logout = document.getElementById("logout"); if (logout) logout.onclick = signOut;
  window.__basAndroidAuth = { signOut }; setMode("signin"); restore();
})();
