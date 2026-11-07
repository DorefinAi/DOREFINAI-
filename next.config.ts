import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Home, products, how it works and contact are static pages in public/site. Other routes (privacy, terms,
  // admin, api) are still served by the Next.js app.
  // Pages folded into the homepage, and the retired careers page.
  async redirects() {
    return [
      { source: "/products/:id", destination: "/products", permanent: true },
      { source: "/careers", destination: "/about", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/site/index.html" },
        { source: "/products", destination: "/site/products.html" },
        { source: "/how-it-works", destination: "/site/how-it-works.html" },
        { source: "/contact", destination: "/site/contact.html" },
      ],
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
