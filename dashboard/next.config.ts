// dashboard/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    // keep only what you actually optimize
    optimizePackageImports: ["react-plotly.js"],
  },
  webpack: (config) => {
    // no Vega aliases
    return config;
  },
};

export default nextConfig;
