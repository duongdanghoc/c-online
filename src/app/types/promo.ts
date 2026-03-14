export interface SelectedPromo {
  id: string;
  name: string;
  autoApply: boolean;
  couponCodes: SelectedCouponCode[];
  discount: number;
  isApplicable: boolean;
}

export interface SelectedCouponCode {
  id: string;
  code: string;
  promoId: string;
}

export interface FreeShipPromo {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
}

export interface ProductPromo {
  id: string;
  name: string;
  startAt?: string;
  endAt?: string;
  effectObj: PromoEffectSchema;
  gifts: {
    slug: string;
    displayName: string;
    imageUrl?: string;
  }[];
}

export interface PercentOffCartEffect {
  type: "PERCENT_OFF_CART";
  discountPercent: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
}

export interface AmountOffCartEffect {
  type: "AMOUNT_OFF_CART";
  discountAmount: number; // fixed amount off the cart
  minOrderAmount?: number; // minimum order amount to qualify
}

export interface PercentOffItemEffect {
  type: "PERCENT_OFF_ITEM";
  discountPercent: number; // e.g., 15 for 15% off each item
  maxDiscountPerItem?: number; // maximum discount per item
  maxQuantity?: number; // maximum quantity that can be discounted
  minOrderAmount?: number; // minimum order amount to qualify
}

export interface AmountOffItemEffect {
  type: "AMOUNT_OFF_ITEM";
  discountAmount: number; // fixed amount off each item
  maxQuantity?: number; // maximum quantity that can be discounted
  minOrderAmount?: number; // minimum order amount to qualify
}

export interface ShipAmountEffect {
  type: "SHIP_AMOUNT";
  shippingDiscount: number;
  minOrderAmount?: number;
}

// ---------- Tiered effect schemas ----------
export type TierMode = "threshold";

export interface TieredGiftItem {
  unitId: number;
  quantity: number;
  name?: string;
  value: number;
}

export interface TieredGiftBenefit {
  kind: "gift";
  items: TieredGiftItem[];
  appliesTo: "unit" | "line" | "cart";
}

export interface TieredDiscountBenefit {
  kind: "discount";
  method: "amount" | "percent";
  value: number;
  appliesTo: "unit" | "line" | "cart";
  cap?: { perUnit?: number; perLine?: number; perCart?: number };
}

export type TieredBenefit = TieredDiscountBenefit | TieredGiftBenefit;

export interface TierDefinition {
  threshold: number;
  benefits: TieredBenefit[];
}

export interface TieredCommonEffect {
  tierMode: TierMode;
  tiers: TierDefinition[];
}

export interface TieredItemEffect extends TieredCommonEffect {
  type: "TIERED_ITEM";
  metric: "item_quantity";
}

export interface TieredCartEffect extends TieredCommonEffect {
  type: "TIERED_CART";
  metric: "cart_value";
}

// Union type for all effect types
export type PromoEffectSchema =
  | PercentOffCartEffect
  | AmountOffCartEffect
  | PercentOffItemEffect
  | AmountOffItemEffect
  | ShipAmountEffect
  | TieredItemEffect
  | TieredCartEffect;
