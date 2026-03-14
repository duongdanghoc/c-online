import { BaseError } from "../types/base-error";
import { Resp } from "../types/response";
import api from "./api";
import cWebApi from "./c-web-api";

export enum PaymentMethod {
  COD = "COD",
  VNPAY = "VNPAY",
}

export interface CheckoutDto {
  cartCode: string;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhoneNumber: string;
  recipientName: string;
  recipientPhoneNumber: string;
  province: string;
  ward: string;
  address: string;
  note: string;
  eInvoiceRequested: boolean;
  expectedTotal: number;
}

export async function checkout(dto: CheckoutDto): Promise<
  Resp<{
    orderId: string;
    hash: string;
    dto: CheckoutDto;
  }>
> {
  try {
    const response = (await api.post("/checkout", dto, {
      withCredentials: true,
    })) as {
      orderId: string;
      hash: string;
    };

    return {
      data: {
        orderId: response.orderId,
        hash: response.hash,
        dto,
      },
    };
  } catch (error) {
    return {
      error: error as BaseError,
    };
  }
}

export async function fetchAddresses({
  city,
  district,
}: {
  city?: string;
  district?: string;
}): Promise<string[]> {
  const response = (await cWebApi.post("DefaultValue/GetLocation", {
    City: city,
    District: district,
  })) as any;
  return response["LocationLst"] as string[];
}
