// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = (phase: string) => ({
  // Keep a running development server independent from production exports.
  distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
  output: "export", // tells Next.js to statically export the site
  images: {
    domains: ["imgs.search.brave.com"],
  },
});

module.exports = nextConfig;
