import { Product } from "./product";

export interface Promotion {
  id: number;

  title: string;

  metaDescription: string;

  fullDescription: string;

  slug: string;

  images: string[];

  products: Product[];
}
