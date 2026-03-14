"use client";
import { checkout, CheckoutDto, PaymentMethod } from "@/app/api/checkout";
import { previewOrder } from "@/app/api/order";
import LoadingView from "@/components/layout/LoadingView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { sendPurchaseEvent } from "@/lib/ga";
import {
  TikTokContent,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/tiktok";
import { useCartStore } from "@/store/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CheckoutForm from "./checkout-form";
import CheckoutPrice from "./checkout-price";
import CouponView from "./coupon-view";
import ProductsView from "./products-view";

// Phone number regex: 10 or 11 digits
const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

export const formSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  customerPhoneNumber: z
    .string()
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  recipientName: z
    .string()
    .trim()
    .min(2, "Tên người nhận phải có ít nhất 2 ký tự"),
  recipientPhoneNumber: z
    .string()
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  note: z.string().optional(),
  eInvoiceRequested: z.boolean(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

const CheckoutView = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { clear, cartId } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: previewOrderInfo, isPending: isPreviewing } = useQuery({
    queryKey: ["preview-order", cartId],
    queryFn: async () => {
      return previewOrder(cartId!);
    },
    enabled: !!cartId,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    const selectedItem = previewOrderInfo?.items.find(
      (item) => item.isSelected
    );
    if (!selectedItem && !isPreviewing) {
      router.push("/gio-hang");
      return;
    }

    // Track TikTok InitiateCheckout event
    if (previewOrderInfo?.calculatedPrice) {
      trackInitiateCheckout({
        value: previewOrderInfo.calculatedPrice.finalAmount,
        currency: "VND",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreviewing]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhoneNumber: "",
      recipientName: "",
      recipientPhoneNumber: "",
      province: "",
      ward: "",
      address: "",
      note: "",
      eInvoiceRequested: false,
      paymentMethod: PaymentMethod.COD,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: CheckoutDto) => {
      const { data, error } = await checkout(request);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async (data) => {
      if (!data) return;
      const { orderId, hash, dto } = data;

      const price = previewOrderInfo?.calculatedPrice.finalAmount ?? 0;

      // Handle successful checkout - GA & TikTok tracking
      await sendPurchaseEvent({
        orderId: orderId,
        phone: dto.recipientPhoneNumber,
        email: "",
        price: price,
        currency: "VND",
      });

      // Track TikTok Purchase event
      const contents: TikTokContent[] =
        previewOrderInfo?.items
          .filter((item) => item.isSelected)
          .map((item) => ({
            content_id: item.productId.toString(),
            content_type: "product" as const,
            content_name: item.productInfo.displayName,
          })) ?? [];

      trackPurchase({
        contents,
        value: price,
        currency: "VND",
      });

      router.push(`/don-hang/${orderId}/${hash}`);
      toast.success("Đặt hàng thành công");
      form.reset();

      setTimeout(() => {
        clear();
      }, 200);
    },
    onError() {
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isPending) {
      return;
    }
    if (!previewOrderInfo?.code) {
      toast.error("Giỏ hàng không hợp lệ");
    }

    const request: CheckoutDto = {
      customerName: data.customerName,
      customerPhoneNumber: data.customerPhoneNumber,
      recipientName: data.recipientName,
      recipientPhoneNumber: data.recipientPhoneNumber,
      province: data.province,
      ward: data.ward,
      address: data.address,
      note: data.note || "",
      eInvoiceRequested: data.eInvoiceRequested,
      paymentMethod: data.paymentMethod,
      cartCode: previewOrderInfo?.code ?? "",
      expectedTotal: previewOrderInfo?.calculatedPrice.finalAmount ?? 0,
    };
    mutate(request);
  };

  // Show skeleton while loading preview order
  if (isPreviewing) {
    return (
      <div className="relative container mx-auto grid grid-cols-12 gap-4 py-4">
        <div className="col-span-full">
          <Button
            variant="ghost"
            className="text-primary"
            onClick={() => router.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
            Quay lại giỏ hàng
          </Button>
        </div>
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-8">
          {/* Products skeleton */}
          <div className="rounded-xl bg-white p-4">
            <Skeleton className="mb-4 h-6 w-48" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b py-4 last:border-b-0"
              >
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>

          {/* Checkout form skeleton */}
          <div className="rounded-xl bg-white p-4">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
        <div className="col-span-12 flex h-fit flex-col gap-4 lg:sticky lg:top-4 lg:col-span-4">
          {/* Coupon skeleton */}
          <div className="rounded-xl bg-white p-4">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Price skeleton */}
          <div className="rounded-xl bg-white p-4">
            <Skeleton className="mb-4 h-8 w-2/3" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative container mx-auto grid grid-cols-12 gap-4 py-4">
      <div className="col-span-full">
        <Button
          variant="ghost"
          className="text-primary"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
          Quay lại giỏ hàng
        </Button>
      </div>
      <div className="col-span-12 flex flex-col gap-4 lg:col-span-8">
        <ProductsView
          cartItems={
            previewOrderInfo?.items.filter((item) => item.isSelected) ?? []
          }
          gifts={previewOrderInfo?.gifts || []}
        />

        <CheckoutForm form={form} />
      </div>
      <div className="col-span-12 flex h-fit flex-col gap-4 lg:sticky lg:top-4 lg:col-span-4">
        {cartId && (
          <CouponView
            selectedPromos={previewOrderInfo?.promos ?? []}
            cartId={cartId}
            onCouponChanged={() => {
              queryClient.invalidateQueries({
                queryKey: ["preview-order", cartId],
              });
            }}
            isLoggedIn={isLoggedIn}
          />
        )}
        {previewOrderInfo?.calculatedPrice && (
          <div className="rounded-xl bg-white p-4">
            <CheckoutPrice
              calculatedPrice={previewOrderInfo.calculatedPrice}
              isLoading={isPending}
              onSubmit={() => {
                form.handleSubmit(onSubmit)();
              }}
            />
          </div>
        )}
      </div>

      {isPending && <LoadingView />}
    </div>
  );
};

export default CheckoutView;
