import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tim-kiem/", "/gio-hang", "/gio-hang/hoan-tat", "/don-hang/"],
    },
    sitemap: [
      `${domain}/sitemap.xml`,
      `${domain}/product/sitemap.xml`,
      `${domain}/post/sitemap.xml`,
      `${domain}/category/sitemap.xml`,
      `${domain}/post-category/sitemap.xml`,
    ],
  };
}
