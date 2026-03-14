import { BaseError } from "@/app/types/base-error";
import {
  FlashSale,
  FlashSaleProduct,
  FlashSaleProductQuota,
} from "@/app/types/flash-sale";
import { Resp } from "@/app/types/response";
import api from "./api";

export async function getFlashSales(): Promise<Resp<FlashSale[]>> {
  try {
    const data = (await api.get(
      "flash-sale/active-flash-sales"
    )) as FlashSale[];
    return { data };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getFlashSaleInfo(id: string): Promise<Resp<FlashSale>> {
  try {
    const data = (await api.get(`flash-sale/${id}/info`)) as FlashSale;
    return { data };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getFlashSaleProducts({
  flashSaleId,
  sectionId,
}: {
  flashSaleId: string;
  sectionId: string;
}) {
  try {
    const data = (await api.get(
      `flash-sale/${flashSaleId}/${sectionId}/products`
    )) as FlashSaleProduct[];
    return { data };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getFlashSaleProductQuotas({
  flashSaleId,
  sectionId,
}: {
  flashSaleId: string;
  sectionId: string;
}): Promise<Resp<FlashSaleProductQuota[]>> {
  try {
    const data = (await api.get(
      `flash-sale/${flashSaleId}/${sectionId}/quotas`
    )) as FlashSaleProductQuota[];
    return { data };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
