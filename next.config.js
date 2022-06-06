/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.WOO_HOST],
  }
}

module.exports = nextConfig
