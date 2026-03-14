"use client";

import { ProductInfo } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../product/AddToCartButton";
import { Button } from "../ui/button";

interface Props {
  product: ProductInfo;
}

export default function ChatProductCard({ product }: Props) {
  const slug: string | undefined = product?.slug;
  const name: string = product?.displayName || "Sản phẩm";
  const image: string | undefined = product?.images?.[0];
  const href = slug ? `/san-pham/${slug}.html` : "#";

  return (
    <Link
      href={href}
      className="flex gap-3 rounded-lg border bg-white p-2 hover:shadow-sm"
      onClick={(e) => {
        if (!slug) e.preventDefault();
      }}
    >
      <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={128}
            height={128}
            className="h-12 w-12 object-cover"
          />
        ) : (
          <div className="h-16 w-16" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="line-clamp-2 text-xs font-medium text-gray-900">
          {name}
        </div>
        <AddToCartButton product={product}>
          <Button size={"sm"} className="mt-1">
            Thêm vào giỏ
          </Button>
        </AddToCartButton>
      </div>
    </Link>
  );
}
