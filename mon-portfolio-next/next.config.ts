import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** ⚠️ Ignorer les erreurs TypeScript de @shadergradient/react */
  typescript: {
    ignoreBuildErrors: true,
  },

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
