"use client";

import { addToCart, buyNow } from "@/app/api/cart";
import { getCartId } from "@/app/api/cart-cookie";
import { BaseError } from "@/app/types/base-error";
import { ProductCartItem, ProductUnit } from "@/app/types/product";
import { useMediaQuery } from "@/lib/hooks/use-media.query";
import { useCartStore } from "@/store/cart";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import VisuallyHidden from "../ui/visually-hidden";
import AddToCartDialog from "./AddToCartDialog";
import AddToCartDrawer from "./AddToCartDrawer";

interface Props {
  product: ProductCartItem;
  initialUnit?: ProductUnit;
  children?: React.ReactNode;
  initialOpen?: boolean;
}

const AddToCartButton = ({
  product,
  initialUnit,
  children,
  initialOpen,
}: Props) => {
  const [open, setOpen] = useState(initialOpen || false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { cartId, setCartInfo, setBuyNow } = useCartStore();
  const router = useRouter();
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
      setOpen(false);
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

  const onAddToCartClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  const onAddProductToCart = ({
    productId,
    unitId,
    quantity,
  }: {
    productId: number;
    unitId: number;
    quantity: number;
  }) => {
    mutate({
      productId,
      unitId,
      quantity,
    });
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div onClick={onAddToCartClick}>
            {children == null ? (
              <Button className="w-full"> Thêm vào giỏ hàng</Button>
            ) : (
              children
            )}
          </div>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[800px]"
          onClick={(e) => e.stopPropagation()}
        >
          <VisuallyHidden>
            <DialogTitle>Thêm sản phẩm vào giỏ hàng</DialogTitle>
          </VisuallyHidden>

          {open && (
            <AddToCartDialog
              initialUnit={initialUnit}
              product={product}
              onAddToCartClick={onAddProductToCart}
              isAdding={isPending}
              onBuyNowClick={mutateBuyNow}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div onClick={onAddToCartClick}>
          {children == null ? (
            <Button className="w-full"> Thêm vào giỏ hàng</Button>
          ) : (
            children
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        onClick={(e) => e.stopPropagation()}
        side={"bottom"}
        className="rounded-t-2xl p-0 py-2"
      >
        <SheetHeader>
          <SheetTitle>Chọn mua sản phẩm</SheetTitle>
        </SheetHeader>

        {open && (
          <AddToCartDrawer
            onBuyNowClick={mutateBuyNow}
            initialUnit={initialUnit}
            onClose={() => setOpen(false)}
            product={product}
            onAddToCartClick={onAddProductToCart}
            isAdding={isBuyingNow}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddToCartButton;
