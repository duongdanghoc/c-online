import { FsBanner } from "@/app/api/fs-banner";
import Countdown from "@/components/count-down-anim";
import { formatPrice } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  fsBanner: FsBanner;
  originalPrice: number;
  sellingPrice: number;
  unit: string;
}

const FsBannerComp = ({
  fsBanner,
  originalPrice,
  sellingPrice,
  unit,
}: Props) => {
  const endDate = useMemo(() => {
    const now = dayjs();
    const startAt = dayjs(fsBanner.startAt).hour(0).minute(0).second(0);
    const diff = now.diff(startAt, "second") ?? 0;
    const remaining =
      Math.ceil(diff / fsBanner.durationInSeconds) *
        fsBanner.durationInSeconds -
      diff;
    return now.add(remaining, "second").toDate();
  }, [fsBanner]);

  return (
    <div className="relative aspect-[7/1] h-fit w-full bg-red-100">
      <Image
        alt={"Flash Sale Banner"}
        src={fsBanner.imagePath}
        width={560}
        height={80}
        className="aspect-[7/1] w-full object-contain"
      />

      <div
        className="absolute top-1 right-1 flex items-center gap-1 text-xs font-medium italic lg:top-3 lg:right-3 lg:gap-3 lg:text-base"
        style={{
          color: fsBanner.textColor || "#ffffff",
          opacity: 90,
        }}
      >
        Flash Sale{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-3 lg:size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
      </div>

      <div className="absolute right-1 bottom-1 flex w-full items-center justify-end gap-2 lg:right-3 lg:bottom-3">
        <div
          className="text-xs opacity-70"
          style={{ color: fsBanner.textColor || "#ffffff" }}
        >
          Kết thúc sau
        </div>
        <div>
          <Countdown targetDate={endDate} showDays={false}></Countdown>
        </div>
      </div>

      <div
        className="absolute top-0 left-1 text-xl font-semibold lg:top-3 lg:left-3 lg:text-3xl"
        style={{ color: fsBanner.textColor || "#ffffff" }}
      >
        {formatPrice(sellingPrice)}{" "}
        <span className="text-sm font-normal opacity-90">/ {unit}</span>
      </div>
      <div
        className="absolute bottom-1 left-1 text-xs line-through opacity-70 lg:bottom-3 lg:left-3 lg:text-sm"
        style={{ color: fsBanner.textColor || "#ffffff" }}
      >
        {formatPrice(originalPrice)}
      </div>
    </div>
  );
};

export default FsBannerComp;
