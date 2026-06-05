import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ichattiesburg.org" },
    ],
  },
};

export default nextConfig;
