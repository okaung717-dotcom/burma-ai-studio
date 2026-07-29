import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.burmaaistudio.app",
  appName: "Burma AI Studio",
  webDir: "public",
  server: {
    // APK v2 is intentionally isolated from burmaaistudio.com production.
    // Desktop, phone and tablet website releases remain on the main branch.
    url: "https://burma-ai-studio-git-apk-v2-masterpiece-okkar-s-projects.vercel.app/?source=native&apk=v2",
    cleartext: false,
    allowNavigation: [
      "burma-ai-studio-git-apk-v2-masterpiece-okkar-s-projects.vercel.app",
      "burmaaistudio.com",
      "*.youtube.com",
      "*.youtube-nocookie.com",
    ],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
