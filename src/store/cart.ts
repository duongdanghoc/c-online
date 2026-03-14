import { getCardInfo } from "@/app/api/cart";
import { getCartId } from "@/app/api/cart-cookie";
import { CartInfo } from "@/app/types/cart";
import { create } from "zustand";

interface CartStore {
  cartId?: string;
  cartInfo?: CartInfo;
  setCartInfo: (cartInfo: CartInfo) => void;
  setCartId: (cartId: string) => void;
  getCartInfo: () => Promise<void>;
  clear: () => Promise<void>;
  refreshAfterLogin: () => Promise<void>;
  handleLogout: () => void;
  buyNow: boolean;
  setBuyNow: (value: boolean) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartId: undefined,
  cartInfo: undefined,
  setCartInfo: (cartInfo) => {
    set({ cartInfo });
  },
  setCartId: (cartId) => {
    set({ cartId });
  },
  getCartInfo: async () => {
    const cartId = get().cartId || (await getCartId());
    if (get().cartInfo) {
      return;
    }

    set({ cartId });
    if (!cartId) return;

    const { data, error } = await getCardInfo(cartId);

    if (error) {
      return;
    }

    if (data && !get().cartInfo) {
      // Update cartId from response for future operations
      set({ cartId: data.code, cartInfo: data });
    }
  },
  clear: async () => {
    set({ cartInfo: undefined });
    const cartId = get().cartId || (await getCartId());
    const { data, error } = await getCardInfo(cartId);

    if (error) {
      return;
    }

    if (data && !get().cartInfo) {
      // Update cartId from response for future operations
      set({ cartId: data.code, cartInfo: data });
    }
  },
  refreshAfterLogin: async () => {
    // Clear existing cart info to force refresh
    set({ cartInfo: undefined });

    // Fetch the merged cart from server after login
    const { data, error } = await getCardInfo("");

    if (error) {
      return;
    }

    if (data) {
      // Update cartId from merged cart response
      set({ cartId: data.code, cartInfo: data });
    }
  },
  handleLogout: () => {
    // Clear cart info and cartId when logging out
    // Will get new guest cart ID from cookie on next operation
    set({ cartId: undefined, cartInfo: undefined });
  },
  buyNow: false,
  setBuyNow: (value) => {
    set({ buyNow: value });
  },
}));
