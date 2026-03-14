import { BaseError } from "../types/base-error";
import { Promotion } from "../types/promotion";
import { Resp } from "../types/response";
import api from "./api";

export async function getPromotionBySlug(
  slug: string
): Promise<Resp<Promotion>> {
  try {
    const data = (await api.get(`promotion/${slug}`, {
      params: {
        slug,
      },
    })) as Promotion;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
