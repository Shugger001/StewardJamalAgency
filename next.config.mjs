import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/service/best-web-development-and-design-in-accra-ghana",
        destination: "/services/web-development",
        permanent: true,
      },
      {
        source: "/service/web-development",
        destination: "/services/web-development",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
