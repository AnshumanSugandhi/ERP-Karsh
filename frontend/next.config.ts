import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow connections from the local network IP
  experimental: {
    allowedDevOrigins: ['10.133.229.190'],
  },
};

export default nextConfig;
