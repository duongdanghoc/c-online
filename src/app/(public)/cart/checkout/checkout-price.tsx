import { PreviewOrderPrice } from "@/app/types/cart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Props {
  calculatedPrice: PreviewOrderPrice;
  isLoading?: boolean;
  onSubmit?: () => void;
}

const CheckoutPrice = ({ isLoading, onSubmit, calculatedPrice }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-end gap-4">
        <Skeleton className="h-8 w-2/3" />

        <Skeleton className="h-8 w-1/2" />

        <div className="h-[1px] w-full bg-slate-300"></div>

        <Skeleton className="h-8 w-2/3" />

        <Skeleton className="h-4" />
        <Skeleton className="h-4" />

        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    );
  }

  const totalDiscount =
    calculatedPrice.voucherDiscount - calculatedPrice.shippingDiscount;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <div>Tổng tiền sản phẩm</div>
        <div className="text-lg font-semibold">
          {formatPrice(calculatedPrice.totalProductAmount ?? 0)}
        </div>
      </div>

      {calculatedPrice.directDiscount > 0 && (
        <DiscountField
          title="Giảm giá trực tiếp"
          discount={calculatedPrice.directDiscount}
        />
      )}

      {totalDiscount > 0 && (
        <DiscountField title="Tổng cộng mã giảm giá" discount={totalDiscount} />
      )}

      <div className="flex items-center justify-between text-sm">
        <div>Phí giao hàng</div>
        <div className="text-lg font-semibold">
          {calculatedPrice.shippingFee > 0
            ? formatPrice(calculatedPrice.shippingFee ?? 0)
            : "Miễn phí"}
        </div>
      </div>

      {calculatedPrice.shippingDiscount > 0 && (
        <DiscountField
          title="Giảm giá phí vận chuyển"
          discount={calculatedPrice.shippingDiscount}
        />
      )}

      <div className="h-[1px] w-full bg-slate-300"></div>

      <div className="flex items-center justify-between text-sm">
        <div>Thành tiền</div>
        <div className="text-primary-dark text-xl font-semibold">
          {formatPrice(calculatedPrice.finalAmount ?? 0)}
        </div>
      </div>

      <div className="text-center text-xs">
        Bằng việc tiến hành đặt mua hàng, bạn đồng ý với
        <br />
        <Link
          href="/ve-chung-toi/chinh-sach-giao-nhan-va-kiem-hang.html"
          className="text-primary underline"
        >
          Điều khoản dịch vụ
        </Link>{" "}
        và{" "}
        <Link
          href="/ve-chung-toi/chinh-sach-bao-mat-thong-tin.html"
          className="text-primary underline"
        >
          Chính sách dữ liệu cá nhân của CPC1HN
        </Link>
      </div>
      <Button
        className="rounded-full"
        type="submit"
        disabled={isLoading}
        onClick={() => {
          onSubmit?.();
        }}
      >
        Hoàn tất
      </Button>
    </div>
  );
};

function DiscountField({
  title,
  discount,
}: {
  title: string;
  discount: number;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div>{title}</div>
      <div className="text-lg font-semibold text-orange-500">
        - {formatPrice(discount)}
      </div>
    </div>
  );
}
export default CheckoutPrice;
