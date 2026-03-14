import { getRefreshToken, getToken } from "../(unauth)/login/actions";
import { BaseError } from "../types/base-error";
import { CartInfo } from "../types/cart";
import { Resp } from "../types/response";
import api from "./api";
import apiWithAuth from "./api-with-auth";

export async function getCardInfo(cartId: string): Promise<Resp<CartInfo>> {
  try {
    // Check if user is logged in (has any token)
    const accessToken = await getToken();
    const refreshToken = await getRefreshToken();

    const isLoggedIn = !!(accessToken || refreshToken);

    if (isLoggedIn) {
      // If user is logged in, ONLY call /cart/user/cart via apiWithAuth
      // Do NOT fallback to /cart/:code to prevent exposing user's cart code
      const data = (await apiWithAuth.get(`cart/user/cart`, {})) as CartInfo;
      return {
        data,
      };
    }

    // User is NOT logged in - use guest cart with code
    // Only call /cart/:code when user has no tokens
    if (!cartId) {
      return {
        error: new BaseError(400, "Cart ID is required for guest users"),
      };
    }

    const data = (await api.get(`cart/${cartId}`, {})) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function addToCart(
  cartId: string,
  {
    productId,
    unitId,
    quantity,
    changeQuantity,
  }: {
    productId: number;
    unitId: number;
    quantity: number;
    changeQuantity?: boolean;
  }
): Promise<Resp<CartInfo>> {
  try {
    const data = (await api.put(`cart/${cartId}`, {
      productId,
      unitId,
      quantity,
      changeQuantity,
    })) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function buyNow(
  cartId: string,
  {
    productId,
    unitId,
    quantity,
    changeQuantity,
  }: {
    productId: number;
    unitId: number;
    quantity: number;
    changeQuantity?: boolean;
  }
): Promise<Resp<CartInfo>> {
  try {
    const data = (await api.post(`cart/${cartId}/buy-now`, {
      productId,
      unitId,
      quantity,
      changeQuantity,
    })) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function deleteItem(
  cartId: string,
  itemId: number
): Promise<Resp<CartInfo>> {
  try {
    const data = (await api.delete(`cart/${cartId}/${itemId}`, {})) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function changeItemUnit(
  cartId: string,
  {
    productId,
    fromUnitId,
    toUnitId,
  }: { productId: number; fromUnitId: number; toUnitId: number }
): Promise<Resp<CartInfo>> {
  try {
    const data = (await api.post(`cart/${cartId}/change-unit`, {
      productId,
      fromUnitId,
      toUnitId,
    })) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function selectItem(
  cartId: string,
  itemId: number
): Promise<Resp<CartInfo>> {
  try {
    const data = (await api.post(
      `cart/${cartId}/select/${itemId}`,
      {}
    )) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function selectAll(cartId: string): Promise<Resp<CartInfo>> {
  try {
    const data = (await api.post(`cart/${cartId}/select-all`, {})) as CartInfo;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
