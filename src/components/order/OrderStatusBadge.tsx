import { OrderStatus } from "@/app/types/order";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  // Get status text and color based on order status
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return {
          text: "Đang xử lý",
          className: "bg-blue-100 text-blue-800",
        };
      case OrderStatus.ACCEPTED:
      case OrderStatus.ACCEPTED_ALT:
        return {
          text: "Đã xác nhận",
          className: "bg-indigo-100 text-indigo-800",
        };
      case OrderStatus.PREPARING:
      case OrderStatus.PREPARING_ALT:
        return {
          text: "Đang chuẩn bị hàng",
          className: "bg-purple-100 text-purple-800",
        };
      case OrderStatus.SHIPPING:
        return {
          text: "Đang giao",
          className: "bg-amber-100 text-amber-800",
        };
      case OrderStatus.DELIVERED:
        return {
          text: "Đã giao hàng",
          className: "bg-green-100 text-green-800",
        };
      case OrderStatus.CANCELLED:
        return {
          text: "Đơn hủy",
          className: "bg-red-100 text-red-800",
        };
      case OrderStatus.RETURNED:
        return {
          text: "Trả hàng",
          className: "bg-rose-100 text-rose-800",
        };
      case OrderStatus.CANCEL_REQUESTED:
        return {
          text: "Yêu cầu hủy",
          className: "bg-orange-100 text-orange-800",
        };
      default:
        return {
          text: "Không xác định",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const { text, className: statusClassName } = getStatusConfig(status);

  return (
    <div
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium",
        statusClassName,
        className
      )}
    >
      {text}
    </div>
  );
};

export default OrderStatusBadge;
