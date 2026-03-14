import { getAllCategories } from "@/app/api/site-map";
import dayjs from "dayjs";
import { MetadataRoute } from "next";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const items = await getAllCategories();

  return items.map((item) => ({
    url: `${domain}/danh-muc/${item.slug}`,
    lastModified: dayjs(item.lastModified).toISOString(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}
