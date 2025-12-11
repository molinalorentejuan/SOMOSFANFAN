/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'www.google.es',
      },
    ],
  },
  // Silenciar warning de múltiples lockfiles
  experimental: {
    turbo: {
      root: './web',
    },
  },
};

export default nextConfig;
