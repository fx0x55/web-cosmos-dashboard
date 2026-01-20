import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist", "lucide-react"],
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
    reactCompiler: true,
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
