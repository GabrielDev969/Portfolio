import type { NextConfig } from 'next'
import { basePath } from './src/lib/site'

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: `${basePath}/`,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
}

export default nextConfig
