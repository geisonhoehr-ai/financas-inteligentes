/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações otimizadas para produção
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
