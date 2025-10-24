/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add webpack configuration to handle module resolution
  webpack: (config, { isServer }) => {
    // Handle missing modules gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
