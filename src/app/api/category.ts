import { BaseError } from "@/app/types/base-error";
import { Category } from "@/app/types/category";
import { Resp } from "@/app/types/response";
import api from "./api";
import {
  ProductFilter,
  ProductSortType,
  SearchProductResponse,
} from "./search";

export async function getCategories(): Promise<Resp<Category[]>> {
  try {
    const data = (await api.get("category")) as Category[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getFeaturedCategories(): Promise<Resp<Category[]>> {
  try {
    const data = (await api.get("category/featured/list")) as Category[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getCategoryDetail(slug: string) {
  try {
    const data = (await api.get(`category/${slug}/detail`)) as Category;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

// get products of category
export class GetProductsQuery extends ProductFilter {
  size?: number;
  from?: number;
  sortType?: ProductSortType;
}

export async function getProductsOfCategory(
  slug: string,
  params: GetProductsQuery
): Promise<Resp<SearchProductResponse>> {
  try {
    const data = (await api.post(`category/${slug}/products`, {
      ...params,
      size: params.size || 12,
    })) as SearchProductResponse;
    console.log(slug, params);

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
