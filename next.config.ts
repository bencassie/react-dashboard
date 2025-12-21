// dashboard/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // keep only what you actually optimize
    optimizePackageImports: ["react-plotly.js"],
  },
  turbopack: {},
};

export default nextConfig;
