import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.burmaaistudio.app",
  appName: "Burma AI Studio",
  webDir: "public",
  server: {
    url: "https://burmaaistudio.com",
    cleartext: false,
  },
};

export default config;