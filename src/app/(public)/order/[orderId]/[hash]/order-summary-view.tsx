import { Order, Redemption } from "@/app/types/order";
import { formatPrice } from "@/lib/utils";

interface Props {
  order: Order;
}

const OrderSummaryView = ({ order }: Props) => {
  const voucherDiscount = order.voucherDiscount - order.shippingDiscount;
  const redemptions = order.redemptions || [];

  return (
    <div className="h-fit rounded-xl bg-white p-4">
      {redemptions.length > 0 && (
        <div className="mb-4 space-y-2">
          {redemptions.map((redemption, index) => (
            <RedemptionItem key={index} redemption={redemption} />
          ))}
        </div>
      )}
      <div className="font-semibold">Thanh toán</div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tổng tiền sản phẩm</span>
          <span className="font-medium">
            {formatPrice(order.totalProductAmount)}
          </span>
        </div>

        {order.directDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Giảm giá trực tiếp</span>
            <span className="text-orange-500">
              -{formatPrice(order.directDiscount)}
            </span>
          </div>
        )}

        {voucherDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Giảm giá voucher</span>
            <span className="text-orange-500">
              -{formatPrice(voucherDiscount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span>
            {order.shippingFee > 0
              ? formatPrice(order.shippingFee)
              : "Miễn phí"}
          </span>
        </div>

        {order.shippingDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Giảm giá vận chuyển</span>
            <span className="text-orange-500">
              -{formatPrice(order.shippingDiscount)}
            </span>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex items-center justify-between font-medium">
            <span>Cần thanh toán</span>
            <span className="text-primary text-lg">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function RedemptionItem({ redemption }: { redemption: Redemption }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-orange-100 text-orange-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>
      <div className="flex-1 text-sm text-gray-700">{redemption.promoName}</div>
    </div>
  );
}

export default OrderSummaryView;
