"use client";

import { getProductPrices } from "@/app/api/product";
import { Product } from "@/app/types/product";
import ProductCard from "@/components/product/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";

import { useMemo } from "react";

interface Props {
  products: Product[];
}

const RelatedProducts = ({ products }: Props) => {
  const priceCheckPayload = useMemo(
    () =>
      products.flatMap((p) =>
        (p.units || []).map((u) => ({
          productId: p.productId,
          unitId: u.unitId,
        }))
      ),
    [products]
  );

  const { data: latestPrices } = useQuery({
    queryKey: ["related-products-prices", priceCheckPayload],
    queryFn: async () => {
      if (priceCheckPayload.length === 0) return [];
      return await getProductPrices(priceCheckPayload);
    },
    enabled: priceCheckPayload.length > 0,
  });

  const priceMap = useMemo(() => {
    if (!latestPrices) return null;
    return new Map(
      latestPrices.map((price) => [
        `${price.productId}:${price.unitId}`,
        price,
      ])
    );
  }, [latestPrices]);

  const displayProducts = useMemo(() => {
    if (!priceMap) return products;

    return products.map((product) => {
      const productUnits = product.units || [];
      const updatedUnits = productUnits.map((unit) => {
        const priceInfo = priceMap.get(`${product.productId}:${unit.unitId}`);

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
  }, [products, priceMap]);

  return (
    <div className="mt-8 flex flex-col gap-4">
      <h2>Sản phẩm liên quan</h2>
      <Carousel opts={{ loop: true, slidesToScroll: 2 }}>
        <CarouselContent className="-ml-2 h-full lg:-ml-4">
          {displayProducts.map((product) => (
            <CarouselItem
              key={product.slug}
              className="basis-1/2 py-1 pl-2 lg:basis-1/4 lg:pl-4 xl:basis-1/6"
            >
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {products.length > 4 && (
          <>
            <CarouselNext className="absolute right-0 hidden lg:flex" />
            <CarouselPrevious className="absolute left-0 hidden lg:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default RelatedProducts;
