import { getAllProducts } from "@/app/api/site-map";
import dayjs from "dayjs";
import { MetadataRoute } from "next";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const items = await getAllProducts();

  return items.map((item) => ({
    url: `${domain}/san-pham/${item.slug}.html`,
    lastModified: dayjs(item.lastModified).toISOString(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}
