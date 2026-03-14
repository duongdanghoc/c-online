import { OrderPaymentWithVnpay } from "../types/order";
import api from "./api";

export async function createPayment({
  orderId,
  hash,
}: {
  orderId: string;
  hash: string;
}): Promise<OrderPaymentWithVnpay> {
  const resp = await api.post(`/vnpay/orders/${orderId}/payment-url`, {
    hash,
    // bankCode: "VNPAYQR",
  });

  return resp as OrderPaymentWithVnpay;
}
