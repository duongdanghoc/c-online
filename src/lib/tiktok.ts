// TikTok Pixel Event Tracking
// Docs: https://ads.tiktok.com/help/article/standard-events-parameters

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      identify: (params: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

export interface TikTokContent {
  content_id: string;
  content_type?: "product" | "product_group";
  content_name?: string;
}

export type TikTokEventParams = {
  contents?: TikTokContent[];
  value?: number;
  currency?: string;
  search_string?: string;
};

/**
 * Track TikTok Pixel event
 * @param event - Event name (e.g., 'InitiateCheckout', 'Purchase', 'PlaceAnOrder')
 * @param params - Event parameters
 */
export function trackTikTokEvent(
  event: string,
  params?: TikTokEventParams
): void {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, params);
  }
}

/**
 * Track when user initiates checkout
 */
export function trackInitiateCheckout(params: {
  contents?: TikTokContent[];
  value?: number;
  currency?: string;
}): void {
  trackTikTokEvent("InitiateCheckout", {
    currency: "VND",
    ...params,
  });
}

/**
 * Track when user completes a purchase
 */
export function trackPurchase(params: {
  contents: TikTokContent[];
  value: number;
  currency?: string;
}): void {
  trackTikTokEvent("Purchase", {
    currency: params.currency || "VND",
    value: params.value,
    contents: params.contents,
  });
}

/**
 * Track when user views content
 */
export function trackViewContent(params: {
  contents: TikTokContent[];
  value?: number;
  currency?: string;
}): void {
  trackTikTokEvent("ViewContent", {
    currency: "VND",
    ...params,
  });
}

/**
 * Track when user adds to cart
 */
export function trackAddToCart(params: {
  contents: TikTokContent[];
  value?: number;
  currency?: string;
}): void {
  trackTikTokEvent("AddToCart", {
    currency: "VND",
    ...params,
  });
}
