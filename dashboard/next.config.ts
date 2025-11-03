import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    // Let Next pre-optimize heavy ESM packages
    optimizePackageImports: ["react-plotly.js", "vega", "vega-lite", "vega-embed", "react-vega"],
  },
  transpilePackages: ["vega", "vega-lite", "vega-embed", "react-vega"],
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      vega: path.resolve(require.resolve("vega/build/vega.module.js")),
      "vega-canvas": path.resolve(
        require.resolve("vega-canvas/build/vega-canvas.browser.module.js")
      ),
      // keep vega-lite default export resolution
      "vega-lite": "vega-lite",
    };
    return config;
  },
};

export default nextConfig;
