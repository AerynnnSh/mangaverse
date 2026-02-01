import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Izinkan semua gambar
      },
    ],
  },
  // 👇 INI KUNCINYA: Kita bikin Tunnel di dalam Next.js
  async rewrites() {
    return [
      {
        source: "/api/proxy-comick/:path*", // Kalau frontend panggil ini...
        destination: "https://api.comick.io/:path*", // ...arahkan ke Comick
      },
    ];
  },
};

export default nextConfig;
