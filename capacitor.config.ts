import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.burmaaistudio.app",
  appName: "Burma AI Studio",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    url: "https://burmaaistudio.com",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
  },
};

export default config;
