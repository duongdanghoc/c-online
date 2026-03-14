import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  isLoading?: boolean;
}

const CartPrice = ({ isLoading }: Props) => {
  const { cartInfo, clear } = useCartStore();
  const router = useRouter();

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

  if (!cartInfo) return null;

  const calculatedPrice = cartInfo.calculatedPrice ?? 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <div>Tổng tiền sản phẩm</div>
        <div className="text-lg font-semibold">
          {formatPrice(calculatedPrice.totalOriginalPrice ?? 0)}
        </div>
      </div>
      {calculatedPrice.directDiscount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div>Giảm giá trực tiếp</div>
          <div className="text-lg font-semibold text-orange-500">
            - {formatPrice(calculatedPrice.directDiscount)}
          </div>
        </div>
      )}

      <div className="h-[1px] w-full bg-slate-300"></div>

      <div className="flex items-center justify-between text-sm">
        <div>Thành tiền</div>
        <div className="text-primary-dark text-xl font-semibold">
          {formatPrice(calculatedPrice.finalPrice ?? 0)}
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
        onClick={() => {
          clear();
          setTimeout(() => {
            router.push("/gio-hang/hoan-tat");
          }, 100);
        }}
        className="rounded-full"
        disabled={
          !cartInfo.items ||
          cartInfo.items.filter((item) => item.isSelected).length === 0 ||
          isLoading
        }
      >
        Mua hàng
      </Button>
    </div>
  );
};

export default CartPrice;
