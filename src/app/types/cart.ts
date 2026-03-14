import { Gift } from "./product";
import { SelectedPromo } from "./promo";

export interface GCProductUnit {
  unitId: number;
  unitName: string;
  sellingPrice: number;
  originalPrice: number;
}

export interface ProductCalculatedPrice {
  originalPrice: number;
  directDiscount: number;
  totalDiscount: number;
  calculatedPrice: number;
}

export interface GCProductInfo {
  productId: number;
  displayName: string;
  slug: string;
  units: GCProductUnit[];
  image?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  unitId: number;
  quantity: number;
  isSelected: boolean;
  productInfo: GCProductInfo;
  selectedUnit: GCProductUnit;
  calculatedPrice: ProductCalculatedPrice;
  flashSaleInfo: CartItemFSInfo;
}

export interface CartItemFSInfo {
  flashSaleId: string;
  sectionId: string;
  flashSaleTitle: string;
  sectionTitle: string;
}

export interface GCCalculatedPrice {
  totalOriginalPrice: number;
  directDiscount: number;
  shippingFee: number;
  finalPrice: number;
}

export interface CartInfo {
  code: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  calculatedPrice: GCCalculatedPrice;
}

export interface PreviewOrderPrice {
  totalProductAmount: number;
  directDiscount: number;
  finalAmount: number;
  voucherDiscount: number;
  shippingFee: number;
  shippingDiscount: number;
  itemDiscount: number;
  cartDiscount: number;
}

export interface PreviewOrderResp {
  code: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  calculatedPrice: PreviewOrderPrice;
  promos: SelectedPromo[];
  gifts: Gift[];
}
