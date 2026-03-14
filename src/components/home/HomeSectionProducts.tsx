"use client";

import { getProductPrices } from "@/app/api/product";
import { Product } from "@/app/types/product";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../product/ProductCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface Props {
  productsRecord: Record<string, Product[]>;
}

const HomeSectionProducts = ({ productsRecord }: Props) => {
  const groups = Object.keys(productsRecord) ?? [];
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    groups.length > 0 ? groups[0] : null
  );

  const priceCheckPayload = useMemo(() => {
    const allProducts = Object.values(productsRecord).flat();
    return allProducts.flatMap((p) =>
      (p.units || []).map((u) => ({
        productId: p.productId,
        unitId: u.unitId,
      }))
    );
  }, [productsRecord]);

  const { data: latestPrices } = useQuery({
    queryKey: ["home-section-products-prices", priceCheckPayload],
    queryFn: async () => {
      if (priceCheckPayload.length === 0) return [];
      return await getProductPrices(priceCheckPayload);
    },
    enabled: priceCheckPayload.length > 0,
  });

  const displayProducts = useMemo(() => {
    if (selectedGroup === null) return [];
    const products = productsRecord[selectedGroup] || [];
    if (!latestPrices) return products;

    return products.map((product) => {
      const productUnits = product.units || [];
      const updatedUnits = productUnits.map((unit) => {
        const priceInfo = latestPrices.find(
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
  }, [selectedGroup, productsRecord, latestPrices]);

  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (groups.length === 0) {
    return (
      <div className="text-center text-gray-500">Không có sản phẩm nào</div>
    );
  }
  return (
    <>
      {groups.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-2 lg:gap-4">
          {groups.map((group) => (
            <div
              key={group}
              className={classNames(
                "flex items-center gap-1",
                "hover:border-primary hover:bg-primary cursor-pointer rounded-full px-4 py-2 text-center transition-all duration-200 hover:text-white",
                selectedGroup === group
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800"
              )}
              onClick={() => setSelectedGroup(group)}
            >
              {selectedGroup === group && (
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
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
              <div className="text-sm font-normal">{group}</div>
            </div>
          ))}
        </div>
      )}

      {selectedGroup != null && (
        <Carousel
          setApi={setApi}
          className="mt-2"
          opts={{
            slidesToScroll: "auto",
          }}
        >
          <CarouselContent className="py-1">
            {displayProducts.map((product) => (
              <CarouselItem
                key={product.productId}
                className="basis-1/2 md:basis-1/4 xl:basis-1/6"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext className="hidden lg:flex"></CarouselNext>
          <CarouselPrevious className="hidden lg:flex"></CarouselPrevious>

          <div className="mt-2 flex h-3 w-full items-center justify-center gap-2 lg:hidden">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className={classNames(
                  "h-1 w-1 transform rounded-full transition-all duration-300 ease-in-out lg:h-2 lg:w-2",
                  current === index + 1
                    ? "border-primary border-[6px]"
                    : "border-primary/60 hover:border-primary/80 border-[3px]"
                )}
                onClick={() => api && api.scrollTo(index)}
              />
            ))}
          </div>
        </Carousel>
      )}
    </>
  );
};

export default HomeSectionProducts;
