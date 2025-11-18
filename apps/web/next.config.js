/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@abc-summit/shared'],
  images: {
    domains: ['supabase.co'], // Add your Supabase storage domain
  },
}

module.exports = nextConfig
