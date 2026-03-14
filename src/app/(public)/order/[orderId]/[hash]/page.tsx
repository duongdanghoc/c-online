import { getOrderInfo } from "@/app/api/order";
import { OrderStatus, PaymentMethod } from "@/app/types/order";
import ConversionTracker from "@/components/analytics/ConversionTracker";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import OrderHeader from "./order-header";
import OrderHistoryView from "./order-history-view";
import OrderInfoView from "./order-info-view";
import OrderItemsView from "./order-items-view";
import OrderSummaryView from "./order-summary-view";
import VnpayPaymentInfo from "./vnpay-payment-info";

interface Props {
  params: Promise<{
    orderId: string;
    hash: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Đơn hàng #${orderId}`,
    description: `Thông tin chi tiết đơn hàng #${orderId}`,
  };
}

const Page = async ({ params }: Props) => {
  const { orderId, hash } = await params;

  const { data: order, error } = await getOrderInfo(orderId, hash);

  if (!order || error) {
    return (
      <div className="container mx-auto flex h-[50vh] flex-col items-center justify-center py-4 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy đơn hàng</h1>
        <p className="text-muted-foreground mt-2">
          Đơn hàng không tồn tại hoặc bạn không có quyền truy cập
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-12 gap-4 py-4">
      <ConversionTracker transactionId={order.id} />
      <div className="col-span-full">
        <BreadcrumbsDefault
          items={[
            {
              label: "Trang chủ",
              href: "/",
            },
            {
              label: "Đơn hàng",
              href: ``,
            },
          ]}
        />
      </div>
      <div className="col-span-12 col-start-1 row-span-10 flex flex-col gap-4 lg:col-span-8 lg:col-start-1">
        <OrderHeader order={order} />

        {order.items && order.items.length > 0 && (
          <OrderItemsView items={order.items} />
        )}

        <OrderInfoView order={order} />
      </div>

      {order.paymentMethod === PaymentMethod.VNPAY &&
        order.status === OrderStatus.PROCESSING && (
          <VnpayPaymentInfo
            order={order}
            hash={hash}
            className="col-span-12 row-start-2 h-fit lg:col-span-4 lg:col-start-9"
          />
        )}

      {/* Summary Div */}
      <div className="col-span-12 flex h-fit flex-col gap-4 lg:sticky lg:top-4 lg:col-span-4">
        <OrderSummaryView order={order} />
        {order.processingHistory && order.processingHistory.length > 0 && (
          <OrderHistoryView history={order.processingHistory} />
        )}
      </div>
    </div>
  );
};

export default Page;
