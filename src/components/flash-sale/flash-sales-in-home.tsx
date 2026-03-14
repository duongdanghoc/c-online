"use client";

import { getFlashSales } from "@/app/api/flash-sale";
import { useQuery } from "@tanstack/react-query";
import FlashSaleView from "./flash-sale-view";

const FlashSalesInHome = () => {
  const { data, error } = useQuery({
    queryKey: ["flashSales"],
    queryFn: async () => {
      const { data, error } = await getFlashSales();
      if (error) {
        throw error;
      }
      return data;
    },
    refetchOnWindowFocus: true,
  });

  if (error) {
    return <></>;
  }

  return (
    <div className="mt-8 space-y-8 px-0 lg:mt-4">
      {data?.map((flashSale) => (
        <FlashSaleView key={flashSale.id} flashSale={flashSale} />
      ))}
    </div>
  );
};

export default FlashSalesInHome;
