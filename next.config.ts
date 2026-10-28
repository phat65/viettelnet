import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  distDir: process.env.CATALOG_TEST_MODE === '1' ? '.next-catalog-test' : '.next',
  poweredByHeader: false,
  output: 'standalone',
  async redirects() {
    return [{ source: '/goi-cuoc/:slug', destination: '/internet/:slug', permanent: true }]
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
}

export default withPayload(nextConfig)
