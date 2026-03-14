import { BaseError } from "../types/base-error";
import { FreeShipPromo, ProductPromo } from "../types/promo";
import { Resp } from "../types/response";
import api from "./api";
import apiWithAuth from "./api-with-auth";

export async function addCoupon(cartId: string, couponCode: string) {
  return await apiWithAuth.post("promo/coupon/user-add", {
    cartId,
    couponCode,
  });
}

export async function removeCoupon(cartId: string, couponCode: string) {
  return await api.post("promo/coupon/remove", {
    cartId,
    couponCode,
  });
}

export async function getFreeShipPromos(): Promise<FreeShipPromo[]> {
  const response = await api.get("promo/free-ship");
  return response;
}

export async function getProductPromos(
  slug: string
): Promise<Resp<ProductPromo[]>> {
  try {
    const response = await api.get(`promo/product/${slug}`);
    return {
      data: response as ProductPromo[],
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
