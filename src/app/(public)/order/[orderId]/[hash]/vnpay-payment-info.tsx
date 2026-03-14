"use client";

import { createPayment } from "@/app/api/vnpay";
import { Order, VnpayPaymentStatus } from "@/app/types/order";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinder";
import { formatPrice } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";

interface Props {
  order: Order;
  hash: string;
  hidden?: boolean;
  className?: string;
}

const VnpayPaymentInfo = ({ order, hash, className, hidden }: Props) => {
  const [paymentInfo, setPaymentInfo] = useState(order.paymentInfo);
  const searchParams = useSearchParams();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await createPayment({
        orderId: order.id,
        hash: hash,
      });
    },
    onSuccess(data) {
      setPaymentInfo(data);
      window.location.href = data.url;
    },
  });

  const onPaymentClick = () => {
    if (!paymentInfo || paymentInfo.status === VnpayPaymentStatus.FAILED) {
      mutate();
      return;
    }

    const now = dayjs();
    const expiredDate = dayjs(paymentInfo.expireDate);

    if (now.isAfter(expiredDate)) {
      mutate();
      return;
    }

    window.location.href = paymentInfo.url;
  };

  useEffect(() => {
    if (!searchParams.get("vnp_Amount") || !paymentInfo) {
      return;
    }

    if (paymentInfo.status === VnpayPaymentStatus.SUCCESS) {
      return;
    }

    const params = Array.from(searchParams.entries());

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/vnpay/orders/${order.id}/payment-status?${new URLSearchParams(params).toString()}`;
    const eventSource = new EventSource(url);
    setIsCheckingStatus(true);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      const pm = parsedData.data;

      setPaymentInfo(pm);

      if (pm.status !== VnpayPaymentStatus.PENDING) {
        setIsCheckingStatus(false);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setIsCheckingStatus(false);
      eventSource.close();
    };

    const now = dayjs();
    const expiredDate = dayjs(paymentInfo.expireDate);
    const diff = now.diff(expiredDate, "millisecond");

    setTimeout(
      () => {
        setIsCheckingStatus(false);
        eventSource.close();
      },
      diff > 0 ? diff : 0
    );

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, order.id]);

  if (hidden) {
    return null;
  }

  return (
    <div
      className={classNames(
        "flex w-full flex-col items-center gap-2 rounded-xl bg-white p-4",
        className
      )}
    >
      <div className="flex w-full flex-col items-center">
        <div className="mb-4 flex w-full items-center gap-4 select-none">
          <div className="text-primary flex items-center gap-1 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clip-rule="evenodd"
              />
            </svg>
            Đã đặt đơn
          </div>
          <div className="h-[2px] w-8 flex-1 bg-gray-400"></div>

          <div className="flex items-center gap-1 text-sm text-orange-400">
            <div className="h-4 w-4 rounded-full border-2 border-orange-400"></div>
            Chờ thanh toán
          </div>

          <div className="h-[2px] w-8 flex-1 bg-gray-400"></div>
        </div>
        <div className="mb-4 h-[128px] w-[128px]">
          <PaymentStatusIcon status={paymentInfo?.status} />
        </div>
        {paymentInfo?.status === VnpayPaymentStatus.SUCCESS ? (
          <div className="text-sm text-green-700">Đã thanh toán</div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Bạn cần thanh toán
          </div>
        )}
        <div
          className={classNames(
            "text-3xl font-semibold lg:text-4xl",
            paymentInfo?.status === VnpayPaymentStatus.SUCCESS
              ? "text-green-600"
              : "text-orange-500"
          )}
        >
          {formatPrice(order.totalAmount)}
        </div>
        {isCheckingStatus && (
          <div className="flex items-center gap-2 text-sm font-normal text-orange-500">
            <Spinner />
            Đang kiểm tra trạng thái thanh toán...
          </div>
        )}
        {paymentInfo?.status === VnpayPaymentStatus.FAILED && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
            Thanh toán thất bại. Vui lòng thử lại.
          </div>
        )}

        {(!paymentInfo ||
          (paymentInfo &&
            paymentInfo.status !== VnpayPaymentStatus.SUCCESS)) && (
          <Button
            className="mt-4"
            onClick={() => {
              onPaymentClick();
            }}
            disabled={isPending || isCheckingStatus}
          >
            Thanh toán ngay
          </Button>
        )}
      </div>
    </div>
  );
};

const PaymentStatusIcon = memo(
  ({ status }: { status?: VnpayPaymentStatus }) => {
    if (status === VnpayPaymentStatus.SUCCESS) {
      return (
        <Image
          src={"/icons/pm_verified.png"}
          alt="Payment Successful"
          width={256}
          height={256}
        />
      );
    }

    if (status === VnpayPaymentStatus.FAILED) {
      return (
        <Image
          src={"/icons/pm_failed.png"}
          alt="Payment Failed"
          width={256}
          height={256}
        />
      );
    }
    return (
      <Image
        src={"/icons/pm_wait.png"}
        alt="Payment Pending"
        width={256}
        height={256}
      />
    );
  }
);
PaymentStatusIcon.displayName = "PaymentStatusIcon";

export default memo(VnpayPaymentInfo);
