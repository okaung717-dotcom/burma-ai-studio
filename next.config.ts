import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/chat",
          destination: "/api/chat-customer",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
