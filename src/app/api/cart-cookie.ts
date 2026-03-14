"use server";

import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const CART_ID_COOKIE_NAME = "cpc1hn-cart-id";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Get the cart ID from cookies, or create a new one if it doesn't exist
 * @returns Cart ID string
 */
export async function getCartId(): Promise<string> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value;

  if (cartId) {
    return cartId;
  }

  // Create a new cart ID if it doesn't exist
  const newCartId = uuidv4();

  // Set the cart ID in cookies with httpOnly flag
  cookieStore.set({
    name: CART_ID_COOKIE_NAME,
    value: newCartId,
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return newCartId;
}

/**
 * Clear the cart ID by removing the cookie
 * This completely removes the user's cart identity
 */
export async function clearCartId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_ID_COOKIE_NAME);
}
