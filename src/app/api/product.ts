import { cache } from "react";
import { BaseError } from "../types/base-error";
import { Product, ProductInfo } from "../types/product";
import { Resp } from "../types/response";
import api from "./api";

export async function suggest(query: string): Promise<Product[]> {
  const data = (await api.get("products/suggestion/list", {
    params: {
      query,
    },
  })) as Product[];
  return data;
}

export const getProductDetail = cache(
  async (slug: string): Promise<Resp<ProductInfo>> => {
    try {
      const data = (await api.get(`products/${slug}`, {
        params: {
          slug,
        },
      })) as ProductInfo;
      return {
        data,
      };
    } catch (e) {
      return {
        error: e as BaseError,
      };
    }
  }
);

export async function getRelatedProducts(
  slug: string
): Promise<Resp<Product[]>> {
  try {
    const data = (await api.get(`products/${slug}/related`, {
      params: {
        slug,
      },
    })) as Product[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getFeaturedProducts(): Promise<Resp<Product[]>> {
  try {
    const data = (await api.get("products/featured/list")) as Product[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export interface ProductPriceRequest {
  productId: number;
  unitId: number;
}

export interface ProductPrice {
  productId: number;
  unitId: number;
  originalPrice: number;
  sellingPrice: number;
  inStock?: boolean;
  flashSale?: FlashSalePreview;
}

export interface FlashSalePreview {
  id: string;
  title: string;
  image?: string;
  mobileImage?: string;
  color?: string;
  toHour?: string;
  fromHour?: string;
  totalQuantity?: number;
  usedQuantity?: number;
}

export async function getProductPrices(
  items: ProductPriceRequest[]
): Promise<ProductPrice[]> {
  return (await api.post(`products/prices`, {
    items: items,
  })) as ProductPrice[];
}
