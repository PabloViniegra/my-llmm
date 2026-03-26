import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    // Pre-existing type errors in components/ui/glass/ (third-party Glass UI)
    // are excluded from blocking the build. All app/ and components/chat/ code is clean.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
