"use client";

import { getCategories } from "@/app/api/category";
import { getProductPrices, suggest } from "@/app/api/product";
import { Product } from "@/app/types/product";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { cn, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

export function SearchInput() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const queryDebounced = useDebounce(query, 500);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["search-suggestion", queryDebounced],
    queryFn: async () => {
      const suggestions = await suggest(queryDebounced);
      if (!suggestions || suggestions.length === 0) return [];

      const payload = suggestions.flatMap((p: any) =>
        (p.units || []).map((u: any) => ({
          productId: p.productId,
          unitId: u.unitId,
        }))
      );

      if (payload.length === 0) return suggestions;

      const prices = await getProductPrices(payload);

      return suggestions.map((product: any) => {
        const productUnits = product.units || [];
        const updatedUnits = productUnits.map((unit: any) => {
          const priceInfo = prices.find(
            (p) => p.productId === product.productId && p.unitId === unit.unitId
          );

          if (priceInfo) {
            return {
              ...unit,
              originalPrice: priceInfo.originalPrice,
              sellingPrice: priceInfo.sellingPrice,
            };
          }
          return unit;
        });

        return {
          ...product,
          units: updatedUnits,
        };
      });
    },
    enabled: !!queryDebounced,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await getCategories();
      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  const filteredCategories = useMemo(
    () =>
      categories?.filter((category) =>
        category.name.toLowerCase().includes(queryDebounced.toLowerCase())
      ),
    [categories, queryDebounced]
  );

  // Handle scroll lock when search is open
  // React.useEffect(() => {
  //   if (open) {
  //     document.body.style.overflowY = "scroll";
  //     document.body.style.position = "fixed";
  //     document.body.style.width = "100%";
  //   } else {
  //     document.body.style.position = "";
  //     document.body.style.overflowY = "";
  //     document.body.style.width = "";
  //   }

  //   return () => {
  //     document.body.style.position = "";
  //     document.body.style.overflowY = "";
  //     document.body.style.width = "";
  //   };
  // }, [open]);

  const handleSearch = (query: string) => {
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/tim-kiem?tu-khoa=${query}`);
  };

  return (
    <div className="w-full md:relative">
      <div className="relative">
        <Input
          ref={inputRef}
          className={cn(
            "text-foreground w-full rounded-full bg-white px-12 py-4 lg:py-6",
            "focus-visible:ring-white/30"
          )}
          style={{
            color: "var(--foreground)",
            backgroundColor: "white",
          }}
          placeholder="Tìm kiếm sản phẩm, bài viết, ..."
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
            }, 300);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform font-semibold"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute inset-x-2 z-50 mt-2 rounded-xl border bg-white p-4 shadow-lg md:inset-x-auto md:w-full">
          {isLoading && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          )}

          {/* Empty */}
          {!products?.length && !filteredCategories?.length && !isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-8 w-8 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM9.293 7.293a1 1 0 0 1 1.414 0L12.414 9l2.293-2.293a1 1 0 1 1 1.414 1.414l-3.5 3.5a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1-.707-.293Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-gray-500">Không tìm thấy kết quả</p>
            </div>
          )}

          {/* Result */}
          {products && (
            <div className="space-2 mb-6 flex flex-col gap-2 lg:gap-4">
              {products?.map((p) => (
                <ProductItem key={p.productId} product={p}></ProductItem>
              ))}
            </div>
          )}
          {filteredCategories?.length ? (
            <div className="mb-4">
              <h2 className="mb-2 text-lg font-semibold">Danh mục</h2>
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <Link href={`/danh-muc/${category.slug}`} key={category.id}>
                    <div className="flex items-center gap-2 py-1 font-medium text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-primary h-4 w-4 transform font-semibold"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {category.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ProductItem({ product }: { product: Product }) {
  const imageUrl = product.images?.length ? product.images[0] : "/no-image.png";
  const unit = product.units?.length ? product.units[0] : null;

  const isDiscount = unit && unit.sellingPrice < unit.originalPrice;
  return (
    <Link
      className="flex items-center gap-2"
      href={`/san-pham/${product.slug}.html`}
    >
      <Image
        src={imageUrl}
        alt={product.displayName}
        width={64}
        height={64}
        className="h-12 w-12 rounded-lg"
      />

      <div className="flex-1 text-sm lg:text-base">
        {product.displayName}
        {unit && (
          <div className="text-primary mt-1 flex items-center gap-2 text-xs font-medium">
            <span>{formatPrice(unit.sellingPrice)}</span>
            <span>/{unit.unitName}</span>
            {isDiscount && (
              <span className="text-gray-500 line-through">
                {formatPrice(unit.originalPrice)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
