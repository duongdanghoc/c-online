import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cpc1hn.com",
        port: "",
        pathname: "/**",
      },
    ],
    loader: "custom",
    loaderFile: "./loader/thumbor-loader.ts",
  },
  rewrites: async () => {
    return [
      {
        source: "/danh-muc/:slug*",
        destination: "/category/:slug*",
      },
      {
        source: "/tim-kiem",
        destination: "/search",
      },
      {
        source: "/san-pham/:slug*",
        destination: "/product/:slug*",
      },
      {
        source: "/khuyen-mai/:slug*",
        destination: "/promotion/:slug*",
      },
      {
        source: "/ve-chung-toi/:slug",
        destination: "/policy/:slug",
      },
      {
        source: "/gio-hang",
        destination: "/cart",
      },
      {
        source: "/gio-hang/hoan-tat",
        destination: "/cart/checkout",
      },
      {
        source: "/don-hang/:orderId/:hash",
        destination: "/order/:orderId/:hash",
      },
      {
        source: "/chuyen-muc",
        destination: "/post-category",
      },
      {
        source: "/chuyen-muc/:slug",
        destination: "/post-category/:slug",
      },
      {
        source: "/bai-viet/:slug",
        destination: "/post/:slug",
      },
      {
        source: "/tac-gia/:slug",
        destination: "/author/:slug",
      },
      {
        source: "/ca-nhan",
        destination: "/account",
      },
      {
        source: "/ca-nhan/lich-su-mua-hang",
        destination: "/account/order-history",
      },
    ];
  },
};

export default nextConfig;
