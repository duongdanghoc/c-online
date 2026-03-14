import dayjs from "dayjs"
import { ProductUnit } from "./product"

export interface FlashSale {
  id: string
  title: string
  image?: string
  mobileImage?: string
  color?: string
  fromDate: string
  toDate: string
  description?: string;
  sections: FlashSaleSection[];
}

export interface FlashSaleSection {
  id: string
  fsId: string
  title: string
  fromHour: string
  toHour: string
}

export interface FlashSaleProduct {
  id: number
  uProductId?: string
  name: string
  slug: string
  indications?: string
  unit: ProductUnit
  image?: string
}

export interface FlashSaleProductQuota {
  productId: number
  unitId: number
  currentQuantity: number
  usedQuantity: number
  totalQuantity: number
  originalPrice: number
  sellingPrice: number
  maskedPrice: string
  flashSaleId: string
  sectionId: string
  flashSale?: FlashSale
  section?: FlashSaleSection
  maxQuantityPerOrder?: number
}

export enum FlashSaleStatus {
  UPCOMING = "upcoming",
  ONGOING = "ongoing",
  ENDED = "ended",
}

export function getFSSectionStatus(section: FlashSaleSection): FlashSaleStatus {
  const now = dayjs();
  const fromHour = dayjs(section.fromHour);
  const toHour = dayjs(section.toHour);

  if (now.isBefore(fromHour)) {
    return FlashSaleStatus.UPCOMING;
  } else if (now.isAfter(toHour)) {
    return FlashSaleStatus.ENDED;
  } else {
    return FlashSaleStatus.ONGOING;
  }
}