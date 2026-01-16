// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["geist", "lucide-react"],
    experimental: {
      typedRoutes: true,
      serverActions: { bodySizeLimit: "10mb" },
    },
  };
  
  export default nextConfig;