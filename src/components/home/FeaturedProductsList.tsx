"use client";

import { getProductPrices } from "@/app/api/product";
import { Product } from "@/app/types/product";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ProductCard from "../product/ProductCard";

interface Props {
  initialProducts: Product[];
}

const FeaturedProductsList = ({ initialProducts }: Props) => {
  const priceCheckPayload = useMemo(
    () =>
      initialProducts.flatMap((p) =>
        (p.units || []).map((u) => ({
          productId: p.productId,
          unitId: u.unitId,
        }))
      ),
    [initialProducts]
  );

  const { data: latestPrices } = useQuery({
    queryKey: ["featured-products-prices", priceCheckPayload],
    queryFn: async () => {
      if (priceCheckPayload.length === 0) return [];
      return await getProductPrices(priceCheckPayload);
    },
    enabled: priceCheckPayload.length > 0,
  });

  const displayProducts = useMemo(() => {
    if (!latestPrices) return initialProducts;

    return initialProducts.map((product) => {
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
  }, [initialProducts, latestPrices]);

  return (
    <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
};

export default FeaturedProductsList;
