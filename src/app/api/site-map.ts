import api from "./api";

interface SitemapItem {
  slug: string;
  lastModified: string;
}

export async function getAllProducts(): Promise<SitemapItem[]> {
  try {
    const data = await api.get("/sitemap/products");
    return data;
  } catch {
    return [];
  }
}

export async function getAllPosts(): Promise<SitemapItem[]> {
  try {
    const data = await api.get("/sitemap/posts");
    return data;
  } catch {
    return [];
  }
}

export async function getAllCategories(): Promise<SitemapItem[]> {
  try {
    const data = await api.get("/sitemap/categories");
    return data;
  } catch {
    return [];
  }
}

export async function getAllPostCategories(): Promise<SitemapItem[]> {
  try {
    const data = await api.get("/sitemap/post-categories");
    return data;
  } catch {
    return [];
  }
}
