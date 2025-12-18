/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  env: {
    NOTION_PAGE_ID: process.env.NOTION_PAGE_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    APPSTORE_REGIONS: process.env.APPSTORE_REGIONS,
  },
}

export default nextConfig
