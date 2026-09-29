import type { NextConfig } from "next";

// Served at https://ai.jaseir.com/ai-lead-qualification/ — must match the
// path the production proxy routes to this app.
const basePath = "/ai-lead-qualification";

const nextConfig: NextConfig = {
  basePath,
  trailingSlash: true,
  env: {
    // fetch() doesn't add basePath automatically; client code reads this.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
