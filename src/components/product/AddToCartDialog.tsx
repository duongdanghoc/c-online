import { getProductPrices } from "@/app/api/product";
import { ProductCartItem, ProductUnit } from "@/app/types/product";
import { sendAddToCartEvent, sendBuyNowEvent } from "@/lib/ga";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FlashSaleComp from "./flash-sale-comp";

interface Props {
  product: ProductCartItem;
  initialUnit?: ProductUnit;
  isAdding?: boolean;
  onAddToCartClick: ({
    productId,
    unitId,
    quantity,
  }: {
    productId: number;
    unitId: number;
    quantity: number;
  }) => void;
  onBuyNowClick: ({
    productId,
    unitId,
    quantity,
  }: {
    productId: number;
    unitId: number;
    quantity: number;
  }) => void;
}

const AddToCartDialog = ({
  product,
  isAdding,
  onAddToCartClick,
  initialUnit,
  onBuyNowClick,
}: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(initialUnit ?? product.units[0]);

  const { data: prices } = useQuery({
    queryKey: ["productPrice", product.productId, unit.unitId],
    queryFn: async () => {
      const result = await getProductPrices([
        { productId: product.productId, unitId: unit.unitId },
      ]);
      return result[0];
    },
  });

  const price = prices;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Image
          src={
            product.images && product.images.length > 0
              ? product.images[0]
              : "/no-image.png"
          }
          alt={product.displayName}
          width={600}
          height={450}
          className="w-full overflow-hidden rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium">{product.displayName}</div>

        {price?.flashSale ? (
          <FlashSaleComp
            productId={product.productId}
            unitId={unit.unitId}
            selectedUnit={unit}
            price={price}
          />
        ) : (
          <>
            <div className="text-primary text-xl font-semibold">
              <span>
                {formatPrice(unit?.sellingPrice ?? 0)} / {unit?.unitName ?? "-"}
              </span>
            </div>
            <div className="-mt-2 text-xs font-normal text-gray-500">
              Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có)
              sẽ được thể hiện khi đặt hàng.
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-4">
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
        <div className="mb-6 flex items-center gap-4">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
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

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={"secondary"}
            className="w-full rounded-full py-6"
            disabled={isAdding || price?.inStock === false}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              sendBuyNowEvent(product);
              onBuyNowClick({
                productId: product.productId,
                unitId: unit.unitId,
                quantity,
              });
            }}
          >
            Mua ngay
            {isAdding && <Loader2 className="animate-spin" />}
          </Button>

          <Button
            className="w-full rounded-full py-6"
            disabled={isAdding || price?.inStock === false}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              sendAddToCartEvent(product);
              onAddToCartClick({
                productId: product.productId,
                unitId: unit.unitId,
                quantity,
              });
            }}
          >
            Thêm vào giỏ hàng
            {isAdding && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartDialog;
