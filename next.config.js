/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // ← Add this
    },
  }

module.exports = nextConfig;
