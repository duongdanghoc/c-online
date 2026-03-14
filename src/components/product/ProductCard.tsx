"use client";

import { Product, ProductUnit } from "@/app/types/product";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import AddToCartButton from "./AddToCartButton";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const isSale = product.units?.some((unit) => unit.sellingPrice > 0);
  const [unit, setUnit] = useState<ProductUnit | null>(
    product.units && product.units.length > 0 ? product.units[0] : null
  );

  useEffect(() => {
    if (product.units && product.units.length > 0) {
      setUnit((prev) => {
        if (!prev) return product.units[0];
        const found = product.units.find((u) => u.unitId === prev.unitId);
        return found || product.units[0];
      });
    }
  }, [product]);

  const discount = useMemo(() => {
    if (!unit) return undefined;

    const discount = unit.originalPrice - unit.sellingPrice;
    if (discount > 0) {
      return `Giảm ${Math.round((discount / unit.originalPrice) * 100)}%`;
    }
    return undefined;
  }, [unit]);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/no-image.png";

  return (
    <Link
      className="product-card hover:ring-primary/50 relative flex h-full flex-col rounded-xl bg-white shadow-sm hover:ring-2"
      href={`/san-pham/${product.slug}.html`}
    >
      {discount && <div className="discount">{discount}</div>}
      <div className="relative p-2">
        <Image
          src={imageUrl}
          alt={product.displayName}
          width={256}
          height={256}
          className="aspect-square w-full overflow-hidden rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 pt-0">
        <div className="line-clamp-3 text-sm font-medium">
          {product.displayName}
        </div>
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap gap-1">
            {product.units?.map((u) => (
              <div
                key={u.unitId}
                className={`cursor-pointer rounded-md border px-2 py-1 text-center text-xs font-medium ${
                  u.unitId === unit?.unitId
                    ? "border-primary text-primary bg-white"
                    : "border-gray-200 bg-gray-100 text-gray-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setUnit(u);
                }}
              >
                {u.unitName}
              </div>
            ))}
          </div>
          {unit && (
            <div className="text-primary flex flex-wrap items-center gap-2 gap-y-1 text-sm font-medium">
              <span className="font-bold">
                {formatPrice(unit.sellingPrice)}
              </span>
              <span>/{unit.unitName}</span>
              {discount && unit.originalPrice > 0 && (
                <span className="text-gray-600 line-through">
                  {formatPrice(unit.originalPrice)}
                </span>
              )}
            </div>
          )}
        </div>
        {isSale ? (
          <AddToCartButton product={product} initialUnit={unit ?? undefined} />
        ) : (
          <Button className="w-full" variant={"secondary"}>
            {" "}
            Xem chi tiết
          </Button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
