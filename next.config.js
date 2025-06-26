/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore test files during server-side build
      config.externals = config.externals || [];
      config.externals.push({
        fs: "commonjs fs",
        path: "commonjs path",
      });
    }

    // Ignore problematic modules during build
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
  serverExternalPackages: ["pdf-parse"],
};

module.exports = nextConfig;
