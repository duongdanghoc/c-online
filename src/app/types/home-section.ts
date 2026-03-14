import { Product } from "./product";

export interface HomeSection {
  title: string;
  description: string;
  icon?: string;
  slug: string;
  products: Record<string, Product[]>;
}
