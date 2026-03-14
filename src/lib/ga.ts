interface ProductEventPayload {
  displayName: string;
}
import { sendGTMEvent } from "@next/third-parties/google";

export async function sendAddToCartEvent(product: ProductEventPayload) {
  sendGTMEvent({
    event: "addToCart",
    value: product.displayName,
  });
}

export async function sendBuyNowEvent(product: ProductEventPayload) {
  sendGTMEvent({
    event: "buyNow",
    value: product.displayName,
  });
}

export interface PurchaseEventData {
  email: string;
  phone: string;
  orderId: string;
  price: number;
  currency?: string;
}

export async function sendPurchaseEvent(data: PurchaseEventData) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];

    let phone = data.phone;
    if (phone.startsWith("0")) {
      phone = phone.replace("0", "+84");
    }

    window.dataLayer.push({
      event: "purchase_ec",
      email: data.email,
      phone: phone,
      order_id: data.orderId,
      price: data.price,
      currency: data.currency || "VND",
    });
  }
}

export async function sendConversionEvent(transactionId?: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-16888614372/wK-PCKeH5rQbEOSbj_U-",
      transaction_id: transactionId || "",
    });
  }
}
