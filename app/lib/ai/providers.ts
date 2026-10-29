import "server-only";

export type ProviderKind = "image" | "video" | "director";

export const providerCapabilities = {
  image: {
    provider: "google",
    envKey: "GEMINI_API_KEY",
    enabled: process.env.BAS_ENABLE_PAID_GENERATION === "true" && Boolean(process.env.GEMINI_API_KEY),
    models: ["gemini-2.5-flash-image"],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
  },
  video: {
    provider: "runway",
    envKey: "RUNWAY_API_KEY",
    enabled: process.env.BAS_ENABLE_PAID_GENERATION === "true" && Boolean(process.env.RUNWAY_API_KEY),
    models: ["runway-config-required"],
    aspectRatios: ["16:9", "9:16", "1:1"],
  },
  director: {
    provider: "google",
    envKey: "GEMINI_API_KEY",
    enabled: process.env.BAS_ENABLE_PAID_GENERATION === "true" && Boolean(process.env.GEMINI_API_KEY),
    models: ["gemini-config-required"],
    aspectRatios: [],
  },
} as const;

export function publicCapabilities() {
  return Object.fromEntries(
    Object.entries(providerCapabilities).map(([kind, capability]) => [
      kind,
      { provider: capability.provider, enabled: capability.enabled, models: capability.models, aspectRatios: capability.aspectRatios },
    ])
  );
}
