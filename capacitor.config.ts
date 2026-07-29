import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.burmaaistudio.app",
  appName: "Burma AI Studio",
  // The APK ships its own interface. It no longer opens a Vercel preview URL,
  // so app startup cannot be blocked by Vercel deployment authentication.
  webDir: "apk-web",
  android: {
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
