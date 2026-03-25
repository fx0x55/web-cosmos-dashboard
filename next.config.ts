import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist", "lucide-react"],
  typedRoutes: true,
  reactCompiler: true,
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "::1",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
