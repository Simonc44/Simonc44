import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Allow Next.js / Turbopack to bundle ESM modules served from
   * framerusercontent.com (the WavyTicker Framer component).
   * Without this, the dynamic import of an https:// URL fails at
   * build time with "Module not found" in Webpack mode, or is
   * rejected by Turbopack's module resolver.
   *
   * The component is already guarded by `dynamic({ ssr: false })`
   * so this only runs in the browser bundle.
   */
  transpilePackages: [],

  webpack(config) {
    // Treat framerusercontent.com URLs as external modules resolved
    // at runtime rather than bundled at build time.
    config.externals = config.externals ?? [];
    if (Array.isArray(config.externals)) {
      config.externals.push(({ request }: { request: string }, callback: Function) => {
        if (request?.startsWith("https://framerusercontent.com/")) {
          // Mark as a browser-side external — the browser will fetch it
          return callback(null, `import ${JSON.stringify(request)}`);
        }
        callback();
      });
    }
    return config;
  },
};

export default nextConfig;
