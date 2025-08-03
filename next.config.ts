// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // tells Next.js to statically export the site
  images: {
    domains: ['imgs.search.brave.com'],
  },
};

module.exports = nextConfig;
