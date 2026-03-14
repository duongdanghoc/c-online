"use client";

import { CartItem } from "@/app/types/cart";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const DesktopCartButton = () => {
  const { cartInfo, getCartInfo } = useCartStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const itemsCount = cartInfo?.items?.length || 0;

  useEffect(() => {
    getCartInfo();
  }, []);

  const navigateToCart = () => {
    setOpen(false);
    router.push("/gio-hang");
  };

  return (
    <HoverCard
      openDelay={0}
      closeDelay={100}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardTrigger asChild>
        <Link
          href="/gio-hang"
          onClick={() => setOpen(false)}
          className="text-primary-foreground flex cursor-pointer items-center gap-4 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          <span className="font-medium">Giỏ hàng</span>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
            {itemsCount > 0 && (
              <div className="absolute -top-1 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 py-0.5 text-[10px]">
                {itemsCount}
              </div>
            )}
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-full max-w-[500px] rounded-xl">
        <div className="w-full">
          {!cartInfo?.items || cartInfo?.items?.length === 0 ? (
            <div className="flex h-12 w-full items-center justify-center text-sm font-medium text-slate-500">
              Giỏ hàng của bạn đang trống
            </div>
          ) : (
            <>
              <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
                {cartInfo?.items.map((item) => {
                  return <CartItemView key={item.id} item={item} />;
                })}
              </div>{" "}
              <div className="mt-4 flex justify-end">
                <Button onClick={navigateToCart}>Xem giỏ hàng</Button>
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

function CartItemView({ item }: { item: CartItem }) {
  return (
    <div key={item.id}>
      <div className="flex items-center gap-4">
        <Image
          src={item.productInfo.image || "/no-image.png"}
          width={128}
          height={96}
          alt={item.productInfo.displayName}
          className="h-16 w-16 overflow-hidden rounded-lg border"
        />
        <div className="flex-1">
          <div className="text-sm">{item.productInfo.displayName}</div>
          <div className="flex justify-between text-sm font-semibold text-gray-600">
            <div className="text-primary font-semibold">
              {formatPrice(item.selectedUnit.sellingPrice ?? 0)}{" "}
              {item.selectedUnit.sellingPrice <
                item.selectedUnit.originalPrice && (
                <span className="text-sm font-normal text-gray-500 line-through">
                  {" "}
                  {formatPrice(item.selectedUnit.originalPrice)}
                </span>
              )}
            </div>
            <div>
              x{item.quantity} {item.selectedUnit.unitName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopCartButton;
