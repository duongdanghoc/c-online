"use client";

import { Order } from "@/app/types/order";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";

interface Props {
  order: Order;
}

const OrderHeader = ({ order }: Props) => {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-bold md:text-xl">Đơn hàng #{order.id}</div>
          <p className="text-muted-foreground text-sm">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  );
};

export default OrderHeader;
