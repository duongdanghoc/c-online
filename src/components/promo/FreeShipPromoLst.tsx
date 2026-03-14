"use client";

import { getFreeShipPromos } from "@/app/api/promo";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const FreeShipPromoLst = () => {
  const { data } = useQuery({
    queryKey: ["free-ship-promos"],
    queryFn: async () => {
      return getFreeShipPromos();
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-orange-200 p-2">
      <div className="flex gap-2 font-medium">
        <Image
          src={"icons/free-shipping-orange.png"}
          alt="Free Shipping"
          width={64}
          height={64}
          className="h-6 w-6"
        />
        <span className="text-orange-400 italic">Mã giảm giá vận chuyển</span>
        <br />
      </div>
      <div className="text-xs font-light text-gray-500">
        ** Mua thêm để đạt điều kiện và áp dụng ngay ưu đãi
      </div>
      <ul className="mt-2 flex list-inside list-none flex-col gap-2 text-sm">
        {data?.map((promo) => (
          <li key={promo.id}>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-orange-50 p-2">
                <Image
                  src={"icons/coupon.png"}
                  alt="Free Shipping"
                  width={64}
                  height={64}
                  className="h-6 w-6"
                />
              </div>
              <div className="flex-1">{promo.name}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FreeShipPromoLst;
