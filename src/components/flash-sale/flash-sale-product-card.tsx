import {
  FlashSaleProduct,
  FlashSaleProductQuota,
} from "@/app/types/flash-sale";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import AddToCartButton2 from "./add-to-cart-button-2";

interface Props {
  product: FlashSaleProduct;
  quota: FlashSaleProductQuota;
}

const FlashSaleProductCard = ({ product, quota }: Props) => {
  const [discount, setDiscount] = React.useState<string | null>(null);
  const [canBuy, setCanBuy] = React.useState<boolean>(false);
  const outStock = quota.totalQuantity > 0 && quota.currentQuantity <= 0;

  React.useEffect(() => {
    const originalPrice = quota?.originalPrice || product.unit.originalPrice;
    const sellingPrice = quota?.sellingPrice;

    if (!sellingPrice || originalPrice <= 0) {
      setDiscount("-xx %");
      setCanBuy(false);
      return;
    }
    setCanBuy(true);

    if (originalPrice > sellingPrice) {
      const discountValue = (
        ((originalPrice - sellingPrice) / originalPrice) *
        100
      ).toFixed(0);
      setDiscount(`-${discountValue}%`);
    }
  }, [quota, product]);

  return (
    <Link
      className="product-card relative flex h-full flex-col overflow-hidden rounded-xl bg-white"
      href={`/san-pham/${product.slug}.html`}
    >
      {discount && <div className="discount">{discount}</div>}
      <div className="relative aspect-[4/3] bg-white p-2">
        <Image
          src={product.image ?? "/no-image.png"}
          alt={product.name}
          width={256}
          height={192}
          className="aspect-[4/3] w-full overflow-hidden rounded-lg object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 pt-0">
        <div className="line-clamp-3 flex-1 text-sm font-medium">
          {product.name}
        </div>
        <div className="text-primary flex flex-col items-start font-medium">
          <div className="font-bold">
            {quota && quota.sellingPrice
              ? formatCurrency(quota.sellingPrice)
              : (quota?.maskedPrice ?? "#")}{" "}
            / {product.unit.unitName}
          </div>
          <div>
            {discount && product.unit.originalPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(
                  quota?.originalPrice || product.unit.originalPrice
                )}
              </span>
            )}
          </div>
        </div>

        {quota && <QuotaComp quota={quota} canBuy={canBuy} />}

        {(!canBuy || outStock) && (
          <Button
            className="bg-primary/10 hover:bg-primary/30 w-full"
            variant={"secondary"}
          >
            {" "}
            Xem chi tiết
          </Button>
        )}

        {canBuy && !outStock && <AddToCartButton2 fsProduct={product} />}
      </div>
    </Link>
  );
};

function QuotaComp({
  quota,
  canBuy,
}: {
  quota: FlashSaleProductQuota;
  canBuy: boolean;
}) {
  if (!canBuy && quota.totalQuantity == 0) {
    return <ProgressBar progress={10} title="Mở bán giá sốc"></ProgressBar>;
  }
  if (!canBuy && quota.totalQuantity > 0) {
    return (
      <ProgressBar
        progress={10}
        title={`Mở bán ${quota.totalQuantity} suất`}
      ></ProgressBar>
    );
  }

  if (quota.totalQuantity > 0 && quota.currentQuantity > 0) {
    return (
      <ProgressBar
        progress={Math.min(
          (quota.usedQuantity / quota.totalQuantity) * 100,
          100
        )}
        title={`Đã bán ${Math.min(quota.totalQuantity, quota.usedQuantity)}/${quota.totalQuantity}`}
      ></ProgressBar>
    );
  }

  if (quota.totalQuantity > 0 && quota.currentQuantity <= 0) {
    return <ProgressBar progress={100} title="Đã bán hết" />;
  }

  return <ProgressBar progress={80} title="Mở bán giá sốc"></ProgressBar>;
}

function ProgressBar({ progress, title }: { progress: number; title: string }) {
  return (
    <div className="relative h-5 w-full gap-1 overflow-hidden rounded-full text-sm">
      <div className="absolute top-0 left-0 h-full w-full rounded-full bg-orange-300"></div>

      <div
        className="absolute top-0 left-0 z-20 h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
        style={{
          width: `${Math.max(15, progress)}%`,
          minWidth: 24,
        }}
      ></div>

      <div className="absolute top-0 left-0 z-30 flex h-full w-full items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="ml-1 size-4 text-yellow-200"
        >
          <path
            fillRule="evenodd"
            d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
            clipRule="evenodd"
          />
        </svg>
        <div className="ml-1 line-clamp-1 flex-1 py-0.5 text-xs font-semibold text-white">
          {title}
        </div>
      </div>
    </div>
  );
}

export default FlashSaleProductCard;
