import { Order, PaymentMethod } from "@/app/types/order";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import dayjs from "dayjs";
import { Loader2, PackageSearch } from "lucide-react";
import Link from "next/link";

type OrderListProps = {
  orders: Order[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

const OrderList = ({ orders, isLoading, error, onRetry }: OrderListProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách đơn hàng"
        }
        onRetry={onRetry}
      />
    );
  }

  if (orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 py-10 text-center text-slate-500">
    <Loader2 className="text-primary size-6 animate-spin" />
    <div>
      <p className="font-semibold text-slate-900">Đang tải đơn hàng</p>
      <p className="text-sm text-slate-500">Vui lòng chờ trong giây lát...</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 py-12 text-center text-slate-500">
    <PackageSearch className="size-10 text-slate-400" />
    <div>
      <p className="font-semibold text-slate-900">Chưa có đơn hàng nào</p>
      <p className="text-sm text-slate-500">
        Hãy tiếp tục mua sắm để thấy đơn hàng xuất hiện tại đây.
      </p>
    </div>
  </div>
);

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/70 py-10 text-center text-red-600">
    <p className="font-semibold text-red-700">{message}</p>
    <Button onClick={onRetry}>Thử lại</Button>
  </div>
);

const OrderCard = ({ order }: { order: Order }) => {
  const createdAt = dayjs(order.createdAt).format("DD/MM/YYYY HH:mm");
  const items = order.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const address = [
    order.addressDetail,
    order.ward,
    order.district,
    order.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="space-y-4 rounded-2xl border border-slate-100 bg-gradient-to-b from-white via-white to-slate-50 p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Đơn hàng</p>
          <p className="text-lg font-semibold text-slate-900">#{order.id}</p>
          <p className="text-sm text-slate-500">Tạo lúc {createdAt}</p>
        </div>
        <div className="text-right">
          <OrderStatusBadge
            status={order.status}
            className="w-fit justify-end"
          />
          <div className="mt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Tổng thanh toán
            </p>
            <p className="text-primary text-xl font-semibold">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Người nhận
          </p>
          <p className="font-medium text-slate-900">{order.recipientName}</p>
          <p className="text-sm text-slate-500">{order.recipientPhoneNumber}</p>
          {address && (
            <p className="text-sm text-slate-500">
              Địa chỉ: <span className="text-slate-700">{address}</span>
            </p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Thanh toán
          </p>
          <p className="font-medium text-slate-900">
            {getPaymentMethodLabel(order.paymentMethod)}
          </p>
          <p className="text-sm text-slate-500">
            {itemCount} sản phẩm trong đơn
          </p>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Link
          href={`/don-hang/${order.id}/${order.hash}`}
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
};

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.COD:
      return "Thanh toán khi nhận hàng";
    case PaymentMethod.VNPAY:
      return "Thanh toán qua VNPAY";
    default:
      return "Phương thức khác";
  }
};

export default OrderList;
