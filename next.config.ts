import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16's CLI path cannot parse `tsc --showConfig` in this environment;
  // the compiler API path still performs the production type check normally.
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
