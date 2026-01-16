// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["geist", "lucide-react"],
    typedRoutes: true,
    experimental: {
      serverActions: { bodySizeLimit: "10mb" },
    },
  };
  
  export default nextConfig;