/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },
  async redirects() {
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    return [
      {
        source: '/',
        destination: 'https://thehire-iq.vercel.app',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
