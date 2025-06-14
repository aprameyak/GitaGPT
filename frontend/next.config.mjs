/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gitagpt-iyj1.onrender.com/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['gitagpt-iyj1.onrender.com'],
  },
  experimental: {
    appDir: true
  }
};

export default nextConfig;
