import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure API proxy for backend communication
  rewrites: async () => {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: "http://localhost:8080/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
