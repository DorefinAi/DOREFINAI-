import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The homepage is the static redesign in public/site. Other routes (privacy, terms,
  // admin, api) are still served by the Next.js app.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/site/index.html" }],
    };
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
