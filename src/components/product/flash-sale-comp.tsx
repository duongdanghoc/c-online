import { ProductPrice } from "@/app/api/product";
import { ProductUnit } from "@/app/types/product";
import { noImagePath } from "@/lib/const";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import FSStatusComp from "./flash-sale-status";

interface Props {
  productId: number;
  unitId: number;
  selectedUnit: ProductUnit;
  price: ProductPrice;
}

// Utility function to convert hex color to rgba with opacity
const hexToRgba = (hex: string, opacity: number): string => {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const FlashSaleComp = ({ selectedUnit, price }: Props) => {
  if (!price.flashSale) {
    return null;
  }

  const flashSale = price.flashSale;
  const themeColor = flashSale.color || "#1e40af"; // Default to blue-800
  const bgColor = hexToRgba(themeColor, 0.15); // Apply 15% opacity

  // Create a section object from FlashSalePreview for FSStatusComp
  const section =
    flashSale.fromHour && flashSale.toHour
      ? {
          id: flashSale.id,
          fsId: flashSale.id,
          title: flashSale.title,
          fromHour: flashSale.fromHour,
          toHour: flashSale.toHour,
        }
      : null;

  // Calculate progress percentage
  const progressPercentage =
    flashSale.totalQuantity && flashSale.usedQuantity
      ? (flashSale.usedQuantity / flashSale.totalQuantity) * 100
      : 0;

  const label =
    flashSale.usedQuantity != 0
      ? `Đã bán ${flashSale.usedQuantity}/${flashSale.totalQuantity}`
      : `Mở bán ${flashSale.totalQuantity}`;
  return (
    <div className="rounded-xl" style={{ backgroundColor: bgColor }}>
      <div className="relative">
        {/* Countdown overlay at top-left */}
        {section && (
          <div className="absolute top-2 right-2 z-10 flex flex-col items-end">
            <FSStatusComp section={section} />

            {flashSale.totalQuantity !== undefined &&
              flashSale.usedQuantity !== undefined && (
                <div className="z-10 mt-2 flex w-[200px] rounded-b-xl">
                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-amber-100 lg:h-4">
                    <div
                      className="-z-10 h-full w-full rounded-full bg-amber-300 text-sm transition-all duration-300"
                      style={{
                        width: `${Math.max(progressPercentage, 10)}%`,
                      }}
                    ></div>
                    <div className="absolute top-0 right-0 left-0 z-10 flex h-full items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4 text-amber-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <div className="ms-2 text-xs font-medium text-amber-500">
                        {label}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}

        <Image
          alt={flashSale.title || "Flash Sale Image"}
          src={flashSale.mobileImage || noImagePath}
          className="aspect-[3.75/1] rounded-xl object-cover lg:hidden"
          width={750}
          height={200}
        />
        <Image
          alt={flashSale.title || "Flash Sale Image"}
          src={flashSale.image || noImagePath}
          className="hidden aspect-[10/1] rounded-xl object-cover lg:block"
          width={1000}
          height={100}
        />
      </div>
      <div className="relative space-y-2 rounded-b-xl px-2 pb-1 lg:space-y-2">
        <div className="mt-4">
          <div
            className="text-2xl font-bold lg:text-3xl"
            style={{ color: themeColor }}
          >
            {formatCurrency(price.sellingPrice)} / {selectedUnit.unitName}
          </div>
          <div>
            {price.sellingPrice < price.originalPrice && (
              <span
                className="text-sm font-normal line-through opacity-70"
                style={{ color: themeColor }}
              >
                {formatCurrency(price.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* "Xem chi tiết" link at top-right */}
        <Link
          href={`/flash-sale/${flashSale.id}`}
          className="absolute right-2 bottom-2 z-10 flex items-center gap-2 rounded-full bg-black/20 px-2 py-1 text-sm text-white"
        >
          Xem chi tiết{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FlashSaleComp;
