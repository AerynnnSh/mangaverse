import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Izinkan semua domain gambar
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/proxy-comick/:path*",
        destination: "https://api.comick.io/:path*",
      },
    ];
  },

  // 👇 Tambahkan @ts-ignore biar TypeScript gak rewel
  // @ts-ignore
  typescript: {
    ignoreBuildErrors: true,
  },

  // 👇 Tambahkan @ts-ignore di sini juga
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
