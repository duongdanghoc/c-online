"use client";
import { addToCart, buyNow } from "@/app/api/cart";
import { getCartId } from "@/app/api/cart-cookie";
import { getFsBannerOfProduct } from "@/app/api/fs-banner";
import { getProductPrices } from "@/app/api/product";
import { BaseError } from "@/app/types/base-error";
import { ProductCartItem, ProductUnit } from "@/app/types/product";
import LoadingView from "@/components/layout/LoadingView";
import FlashSaleComp from "@/components/product/flash-sale-comp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendAddToCartEvent, sendBuyNowEvent } from "@/lib/ga";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import FsBannerComp from "./fs-banner-comp";

interface Props {
  product: ProductCartItem;
  children?: React.ReactNode;
}

const AddToCart = ({ product, children }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<ProductUnit | null>(
    product.units[0] ?? null
  );
  const router = useRouter();

  const { data: prices } = useQuery({
    queryKey: ["productPrice", product.productId, unit?.unitId],
    queryFn: async () => {
      if (!unit) return null;
      const result = await getProductPrices([
        { productId: product.productId, unitId: unit.unitId },
      ]);
      return result[0];
    },
    enabled: !!unit,
  });

  const price = prices;

  const { data: fsBanner } = useQuery({
    queryKey: ["fsBanner", product.slug],
    queryFn: () => getFsBannerOfProduct(product.slug),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { cartId, setCartInfo, setBuyNow } = useCartStore();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      productId: number;
      unitId: number;
      quantity: number;
    }) => {
      const id = cartId || (await getCartId());
      const { data: result, error } = await addToCart(id, data);

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess(data) {
      if (!data) return;

      setCartInfo(data);
      toast.success("Đã thêm vào giỏ hàng");
    },
    onError(error: BaseError) {
      toast.error(error.message);
    },
  });

  const { mutate: mutateBuyNow, isPending: isBuyingNow } = useMutation({
    mutationFn: async (data: {
      productId: number;
      unitId: number;
      quantity: number;
    }) => {
      const id = cartId || (await getCartId());
      const { data: result, error } = await buyNow(id, data);

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess(data) {
      if (!data) return;

      setCartInfo(data);
      setBuyNow(true);
      router.push("/gio-hang");
    },
    onError(error: BaseError) {
      toast.error(error.message);
    },
  });

  if (product.units.length === 0 || !unit) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div>
        {price?.flashSale ? (
          <FlashSaleComp
            productId={product.productId}
            unitId={unit.unitId}
            selectedUnit={unit}
            price={price}
          />
        ) : !fsBanner ? (
          <div className="text-primary text-xl font-semibold">
            <span>
              {formatPrice(unit?.sellingPrice ?? 0)} / {unit?.unitName ?? "-"}
            </span>
            {unit?.originalPrice > unit?.sellingPrice && (
              <span className="ms-4 text-sm font-normal text-gray-500 line-through">
                {formatPrice(unit?.originalPrice ?? 0)}
              </span>
            )}
          </div>
        ) : (
          <FsBannerComp
            fsBanner={fsBanner}
            originalPrice={unit?.originalPrice ?? 0}
            sellingPrice={unit?.sellingPrice ?? 0}
            unit={unit?.unitName ?? ""}
          />
        )}

        <div className="mt-1 text-xs font-normal text-gray-500">
          Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ
          được thể hiện khi đặt hàng.
        </div>
      </div>
      <div className="hidden flex-wrap items-center gap-4 lg:flex">
        <div>Chọn đơn vị</div>
        {product.units.map((p) => {
          return (
            <div
              onClick={() => setUnit(p)}
              key={p.unitId}
              className={classNames({
                "bg-gray-100 text-slate-700": unit?.unitId !== p.unitId,
                "bg-primary/20 text-primary": unit?.unitId === p.unitId,
                "flex cursor-pointer items-center gap-2 rounded-full px-4 py-1 text-sm font-medium":
                  true,
              })}
            >
              <div className="flex-1">{p.unitName}</div>
              {unit?.unitId === p.unitId && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden items-center gap-4 lg:flex">
        Chọn số lượng
        <div className="flex w-fit overflow-hidden rounded-full border border-slate-300">
          <Button
            variant={"ghost"}
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </Button>
          <Input
            className="no-spinner border-sla w-16 rounded-none border-t-0 border-r-[1px] border-b-0 border-l-[1px] text-center ring-0 outline-0"
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(parseInt(e.target.value?.replace(/\D/g, "")))
            }
          />
          <Button variant={"ghost"} onClick={() => setQuantity(quantity + 1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Button>
        </div>
      </div>

      {price?.inStock === false && (
        <div className="text-sm text-red-500">
          ** Sản phẩm này đã hết hàng tạm thời, vui lòng liên hệ với chúng tôi
          để biết thêm thông tin.
        </div>
      )}

      {children}

      <div className="mt-4 hidden grid-cols-2 gap-2 lg:grid lg:gap-4 xl:gap-8">
        <Button
          variant={"secondary"}
          className="w-full min-w-full rounded-full px-12 py-6 lg:w-fit"
          disabled={isPending || price?.inStock === false}
          onClick={(e) => {
            sendAddToCartEvent(product);
            e.stopPropagation();
            e.preventDefault();
            mutate({
              productId: product.productId,
              unitId: unit.unitId,
              quantity,
            });
          }}
        >
          Thêm vào giỏ hàng{isPending && <Loader2 className="animate-spin" />}
        </Button>
        <Button
          className="w-full min-w-full rounded-full px-12 py-6 lg:w-fit"
          disabled={isPending || price?.inStock === false}
          onClick={(e) => {
            sendBuyNowEvent(product);
            e.stopPropagation();
            e.preventDefault();
            mutateBuyNow({
              productId: product.productId,
              unitId: unit.unitId,
              quantity,
            });
          }}
        >
          Mua ngay{isBuyingNow && <Loader2 className="animate-spin" />}
        </Button>
      </div>

      {(isPending || isBuyingNow) && <LoadingView />}
    </div>
  );
};

export default AddToCart;
