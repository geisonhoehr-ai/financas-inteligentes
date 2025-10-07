/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now stable in Next.js 14
  typescript: {
    // Temporariamente ignorar erros de tipo durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporariamente ignorar erros de lint durante o build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
