export interface Product {
  productId: number;
  displayName: string;
  shortDescription: string;
  packingStandard: string;
  slug: string;
  units: ProductUnit[];
  images: string[];
}

export type ProductCartItem = Pick<
  Product,
  "productId" | "displayName" | "slug" | "units" | "images"
>;

export interface ProductInfo extends Product {
  metaDescription: string;
  fullDescription: string;
  ingredients: string;
  originCountry: string;
  registerNumber: string;
  toc?: string;
  categories: ProductCategory[];
  brand?: ProductBrand;
  indications?: string[];
  author?: ProductAuthor;
  keywords?: string[];
  rate?: {
    avg: number;
    count: number;
  };
  highlights?: string;
  productNoticeUrl?: string;
}

export interface ProductUnit {
  unitId: number;
  unitName: string;
  description: string;
  sellingPrice: number;
  originalPrice: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: number;
  name: string;
  imageUrl: string;
  slug: string;
}

export interface ProductAuthor {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  position?: string;
}

export interface ProductPrice {
  inStock: boolean;
  units: {
    unitId: number;
    sellingPrice: number;
    originalPrice: number;
  }[];
}

export interface Gift extends Product {
  quantity: number;
}
