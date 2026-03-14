import { BaseError } from "../types/base-error";
import { Product } from "../types/product";
import { Resp } from "../types/response";
import api from "./api";

export class ProductFilter {
  brands?: string[];
  indications?: string[];
  price?: {
    min?: number;
    max?: number;
  };
}

export class SearchProductQuery extends ProductFilter {
  aggs?: boolean;
  query?: string;
  size?: number;
  from?: number;
  sortType?: ProductSortType;
}

export enum ProductSortType {
  PRICE_ASC = 1,
  PRICE_DESC = 2,
}

export interface SearchProductResponse {
  total: number;
  products: Product[];
  aggregations?: SearchAggregations;
  nextPage?: number;
}

export interface SearchAggregations {
  brands?: string[];
  indications?: string[];
}

export async function searchProducts(
  params: SearchProductQuery
): Promise<Resp<SearchProductResponse>> {
  try {
    const data = (await api.post("search/products", {
      ...params,
      size: params.size || 12,
      aggs: params.aggs || params.from == 0,
    })) as SearchProductResponse;

    return {
      data: {
        ...data,
        nextPage:
          data.total > (params.from || 0) + (params.size || 12)
            ? (params.from || 0) + (params.size || 12)
            : undefined,
      },
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export function generateSearchProductKey(
  search?: string,
  brands?: string[],
  indications?: string[],
  priceFilter?: string,
  sortType?: number
): string[] {
  return [
    [
      "searchProducts",
      search ?? "",
      brands && brands.length > 0 ? brands.join(",") : "",
      indications && indications.length > 0 ? indications.join(",") : "",
      priceFilter ?? "",
      sortType ?? "",
    ].join(","),
  ]; // Join the array into a string
}
