import { Order } from "@/app/types/order";

interface Props {
  order: Order;
}

const OrderInfoView = ({ order }: Props) => {
  const title = (text: string) => {
    return (
      <div className="text-base font-medium text-gray-700 underline">
        {text}
      </div>
    );
  };
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="space-y-4">
        <div>
          {title("Thông tin người mua")}
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Tên người mua: </span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Số điện thoại: </span>
              <span className="font-medium">{order.customerPhoneNumber}</span>
            </div>
          </div>
        </div>

        <div>
          {title("Thông tin người nhận")}
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Tên người nhận: </span>
              <span className="font-medium">{order.recipientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Số điện thoại: </span>
              <span className="font-medium">{order.recipientPhoneNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Địa chỉ: </span>
              <span className="font-medium">
                {[
                  order.addressDetail,
                  order.ward,
                  order.district,
                  order.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Mã đơn hàng: </span>
              <span className="font-medium">{order.id}</span>
            </div>
            {order.note && (
              <div>
                <span className="text-muted-foreground">Ghi chú: </span>
                <span className="font-medium">{order.note}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {title("Phương thức thanh toán")}
          <div className="mt-2 text-sm">
            <span className="font-medium">
              {order.paymentMethod === "COD" &&
                "Thanh toán khi nhận hàng (COD)"}
            </span>
            <span className="font-medium">
              {order.paymentMethod === "VNPAY" && "Thanh toán qua cổng VNPay"}
            </span>
          </div>
          <div className="mt-2 text-sm"></div>
        </div>

        <div>
          {title("Thời gian đặt hàng")}
          <div className="mt-2 text-sm">
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoView;
