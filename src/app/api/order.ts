import { BaseError } from "../types/base-error";
import { PreviewOrderResp } from "../types/cart";
import { Order } from "../types/order";
import { Resp } from "../types/response";
import { PaginationQueryDto, PaginationResponseDto } from "./../types/base";
import api from "./api";
import apiWithAuth from "./api-with-auth";

export async function getOrderInfo(
  orderId: string,
  hash: string
): Promise<Resp<Order>> {
  try {
    const resp = (await api.get(`/order/${orderId}/${hash}`)) as Order;
    console.log(resp);

    return {
      data: resp,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function previewOrder(cardId: string): Promise<PreviewOrderResp> {
  return await api.post("/order/preview", {
    cartId: cardId,
  });
}

export interface OrderListQueryDto extends PaginationQueryDto {
  fromDate: Date;
  toDate: Date;
}

export interface OrderListRespDto extends PaginationResponseDto {
  orders: Order[];
}
export async function getOrders(
  params: OrderListQueryDto
): Promise<OrderListRespDto> {
  const queryParams = {
    ...params,
    fromDate: params.fromDate.toISOString(),
    toDate: params.toDate.toISOString(),
  };

  return await apiWithAuth.get("/order", { params: queryParams });
}
