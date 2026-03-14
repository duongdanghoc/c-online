"use client";
import {
  addToCart,
  changeItemUnit,
  deleteItem,
  selectAll,
  selectItem,
} from "@/app/api/cart";
import { getCartId } from "@/app/api/cart-cookie";
import { BaseError } from "@/app/types/base-error";
import LoadingView from "@/components/layout/LoadingView";
import FreeShipPromoLst from "@/components/promo/FreeShipPromoLst";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@/lib/hooks/use-media.query";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import CartPrice from "./cart-price";
import ChangeItemQuantity from "./change-item-quantity";
import { FlashSaleTag } from "./checkout/products-view";

const CartView = () => {
  const { cartInfo, cartId, setCartInfo, buyNow, setBuyNow, getCartInfo } =
    useCartStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const router = useRouter();

  useEffect(() => {
    const initCart = async () => {
      await getCartInfo();
      setIsInitialLoading(false);
    };
    initCart();
  }, [getCartInfo]);

  useEffect(() => {
    if (buyNow) {
      setBuyNow(false);
      router.push("/gio-hang/hoan-tat");
    }
  }, [buyNow, setBuyNow, router]);

  const { mutate: toggleSelectItem, isPending: isSelectingItem } = useMutation({
    mutationFn: async (itemId: number) => {
      const id = cartId ?? (await getCartId());
      const { data, error } = await selectItem(id, itemId);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess(data) {
      if (!data) return;
      setCartInfo(data);
    },
    onError(error: BaseError) {
      toast.error(error.message);
    },
  });

  const { mutate: toggleSelectAll, isPending: isSelectingAll } = useMutation({
    mutationFn: async () => {
      const id = cartId ?? (await getCartId());
      const { data, error } = await selectAll(id);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess(data) {
      if (!data) return;
      setCartInfo(data);
    },
    onError(error: BaseError) {
      toast.error(error.message);
    },
  });

  const { mutate: changeItemMutate, isPending: isChangingItem } = useMutation({
    mutationFn: async (request: {
      productId: number;
      fromUnitId: number;
      toUnitId: number;
    }) => {
      const id = cartId ?? (await getCartId());
      const { data, error } = await changeItemUnit(id, request);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess(data) {
      if (!data) return;
      setCartInfo(data);
    },
    onError(error: BaseError) {
      toast.error(error.message);
    },
  });

  const { mutate: changeQuantityMutate, isPending: isChangingQuantity } =
    useMutation({
      mutationFn: async (request: {
        productId: number;
        unitId: number;
        quantity: number;
      }) => {
        const id = cartId ?? (await getCartId());
        const { data, error } = await addToCart(id, {
          ...request,
          changeQuantity: true,
        });
        if (error) {
          throw error;
        }
        return data;
      },
      onSuccess(data) {
        if (!data) return;
        setCartInfo(data);
      },
      onError(error: BaseError) {
        toast.error(error.message);
      },
    });

  const { mutate: deleteItemMutate, isPending: isDeletingItem } = useMutation({
    mutationFn: async (itemId: number) => {
      const id = cartId ?? (await getCartId());
      const fsItem = cartInfo?.items.find(
        (i) => i.id === itemId && i.flashSaleInfo
      );

      if (fsItem) {
        const { data, error } = await addToCart(id, {
          ...fsItem,
          changeQuantity: true,
          quantity: fsItem.quantity,
        });
        if (error) {
          throw error;
        }
        return data;
      }

      const { data, error } = await deleteItem(id, itemId);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess(data) {
      if (!data) return;
      setCartInfo(data);
    },
    onError(error: BaseError) {
      toast.error(error.message);
    },
  });

  const debouncedChangeItem = useDebouncedCallback(
    (request: {
      productId: number;
      unitId: number;
      quantity: number;
      currentQuantity: number;
    }) => {
      const changedValue = request.quantity - request.currentQuantity;

      const totalQuantity =
        cartInfo?.items.reduce((total, i) => {
          return (
            total + (i.selectedUnit.unitId === request.unitId ? i.quantity : 0)
          );
        }, 0) ?? 0;

      changeQuantityMutate({
        ...request,
        quantity: totalQuantity + changedValue,
      });
    },
    500
  );

  const isLoading =
    isSelectingItem ||
    isChangingItem ||
    isChangingQuantity ||
    isDeletingItem ||
    isSelectingAll;

  // Show skeleton while initially loading
  if (isInitialLoading) {
    return (
      <div className="container mx-auto grid h-fit grid-cols-12 gap-4 py-4">
        <div className="col-span-12 h-fit rounded-xl bg-white p-2 lg:col-span-9 lg:p-4">
          <div className="block lg:hidden">
            <div className="mb-2 flex items-center gap-2 px-2 pt-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Table className="w-full">
            <TableHeader className="hidden lg:table-header-group">
              <TableRow>
                <TableHead>
                  <Skeleton className="h-5 w-5" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isDesktop ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-5" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-lg" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5" />
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <Skeleton className="h-4 flex-1" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
                          <Skeleton className="h-10 w-24" />
                          <Skeleton className="h-10 w-28" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="col-span-12 h-fit rounded-xl bg-white p-4 lg:col-span-3">
          <Skeleton className="mb-4 h-8 w-2/3" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  // Show empty cart message only after loading completes
  if (!cartInfo || cartInfo.items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-xl font-semibold">
          Chưa có sản phẩm nào trong giỏ hàng
        </div>
        <div></div>
        <Link href={"/"}>
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  const allSelected = cartInfo.items.every((item) => item.isSelected);
  const handleSelectAll = () => {
    toggleSelectAll();
  };

  return (
    <div className="container mx-auto grid h-fit grid-cols-12 gap-4 py-4">
      <div className="col-span-12 h-fit rounded-xl bg-white p-2 lg:col-span-9 lg:p-4">
        <div className="block lg:hidden">
          <div className="mb-2 flex items-center gap-2 px-2 pt-2">
            <Checkbox
              checked={allSelected}
              onClick={handleSelectAll}
              aria-label="Chọn tất cả"
            />
            <span className="text-sm font-medium select-none">Chọn tất cả</span>
          </div>
        </div>

        <Table className="w-full">
          <TableHeader className="hidden lg:table-header-group">
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={allSelected}
                  onClick={handleSelectAll}
                  aria-label="Chọn tất cả"
                />
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Giá thành</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isDesktop &&
              cartInfo?.items.map((item, index) => (
                <TableRow key={`${item.id}${index}`}>
                  <TableCell>
                    <Checkbox
                      checked={item.isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectItem(item.id);
                      }}
                      aria-label="Chọn tất cả"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        width={128}
                        height={96}
                        src={item.productInfo.image || "/no-image.png"}
                        alt={item.productInfo.displayName}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-wrap">
                        {item.flashSaleInfo && <FlashSaleTag />}
                        <Link
                          className="text-sm font-medium"
                          href={"/san-pham/" + item.productInfo.slug + ".html"}
                        >
                          {item.productInfo.displayName}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-primary text-sm font-semibold">
                        {formatPrice(item.selectedUnit.sellingPrice ?? 0)}{" "}
                        <br />
                        {item.selectedUnit.sellingPrice <
                          item.selectedUnit.originalPrice && (
                          <span className="text-xs font-normal text-gray-500 line-through">
                            {" "}
                            {formatPrice(item.selectedUnit.originalPrice)}
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ChangeItemQuantity
                      item={item}
                      onQuantityChange={(data) =>
                        debouncedChangeItem({
                          ...data,
                          currentQuantity: item.quantity,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={`${item.selectedUnit.unitId}`}
                      onValueChange={(value) => {
                        changeItemMutate({
                          productId: item.productInfo.productId,
                          fromUnitId: item.selectedUnit.unitId,
                          toUnitId: Number(value),
                        });
                      }}
                    >
                      <SelectTrigger className="w-fit bg-white">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.productInfo.units.map((unit) => (
                          <SelectItem
                            key={unit.unitId}
                            value={`${unit.unitId}`}
                          >
                            {unit.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DeleteItem onDelete={() => deleteItemMutate(item.id)} />
                  </TableCell>
                </TableRow>
              ))}

            {!isDesktop &&
              cartInfo?.items.map((item, index) => {
                return (
                  <TableRow key={`${item.id}${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.isSelected}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectItem(item.id);
                          }}
                          aria-label="Select Item"
                        />
                        <Image
                          width={128}
                          height={96}
                          src={item.productInfo.image || "/no-image.png"}
                          alt={item.productInfo.displayName}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 text-wrap">
                          <Link
                            className="text-sm font-medium"
                            href={
                              "/san-pham/" + item.productInfo.slug + ".html"
                            }
                          >
                            {item.productInfo.displayName}
                          </Link>
                        </div>
                        <DeleteItem
                          onDelete={() => deleteItemMutate(item.id)}
                        />
                      </div>
                      <div className="text-primary flex items-center justify-end gap-2 font-semibold">
                        {item.selectedUnit.sellingPrice <
                          item.selectedUnit.originalPrice && (
                          <span className="font-normal text-gray-500 line-through">
                            {" "}
                            {formatPrice(item.selectedUnit.originalPrice)}
                          </span>
                        )}
                        <span className="text-base font-bold">
                          {formatPrice(item.selectedUnit.sellingPrice ?? 0)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
                        <Select
                          defaultValue={`${item.selectedUnit.unitId}`}
                          onValueChange={(value) => {
                            changeItemMutate({
                              productId: item.productInfo.productId,
                              fromUnitId: item.selectedUnit.unitId,
                              toUnitId: Number(value),
                            });
                          }}
                        >
                          <SelectTrigger className="w-fit bg-white">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            {item.productInfo.units.map((unit) => (
                              <SelectItem
                                key={unit.unitId}
                                value={`${unit.unitId}`}
                              >
                                {unit.unitName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ChangeItemQuantity
                          item={item}
                          onQuantityChange={(data) =>
                            debouncedChangeItem({
                              ...data,
                              currentQuantity: item.quantity,
                            })
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <FreeShipPromoLst />
      </div>
      <div className="col-span-12 h-fit rounded-xl bg-white p-4 lg:col-span-3">
        <CartPrice isLoading={isLoading} />
      </div>

      {isLoading && <LoadingView />}
    </div>
  );
};

function DeleteItem({ onDelete }: { onDelete: () => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <div className="text-sm">
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant={"ghost"}
              className="text-red-700"
              onClick={() => onDelete()}
            >
              Xóa
            </Button>

            <Button variant={"secondary"} asChild>
              <PopoverClose>Huỷ</PopoverClose>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CartView;
