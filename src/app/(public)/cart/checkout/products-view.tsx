import { CartItem } from "@/app/types/cart";
import { Gift } from "@/app/types/product";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface Props {
  cartItems: CartItem[];
  gifts: Gift[];
}

const ProductsView = ({ cartItems, gifts }: Props) => {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="flex flex-col gap-2">
        {cartItems.map((item) => {
          const isFs = !!item.flashSaleInfo;

          return (
            <div
              key={item.id}
              className="border-b-gray-150 border-b pb-2 nth-last-[1]:border-b-0"
            >
              <div className="flex gap-4">
                <Image
                  src={item.productInfo.image || "/no-image.png"}
                  width={128}
                  height={96}
                  alt={item.productInfo.displayName}
                  className="h-12 w-12 overflow-hidden rounded-lg border"
                />
                <div className="flex-1 font-medium">
                  {isFs && <FlashSaleTag />}
                  {item.productInfo.displayName}
                  <div className="flex justify-between">
                    <div className="text-sm font-normal text-gray-600">
                      {item.quantity} x {item.selectedUnit.unitName}
                    </div>
                    <div className="text-primary flex items-center gap-2 font-medium">
                      {item.selectedUnit.sellingPrice <
                        item.selectedUnit.originalPrice && (
                        <span className="text-sm font-normal text-gray-500 line-through">
                          {formatPrice(item.selectedUnit.originalPrice)}
                        </span>
                      )}
                      {formatPrice(item.selectedUnit.sellingPrice)}{" "}
                    </div>
                  </div>
                  {isFs && (
                    <div className="rounded-md bg-orange-50 p-2 text-sm text-orange-500">
                      {item.flashSaleInfo.flashSaleTitle}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {gifts.map((gift, index) => (
          <GiftItemComp key={index} gift={gift} />
        ))}
      </div>
    </div>
  );
};

export function FlashSaleTag() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 ps-1 text-xs text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
          clipRule="evenodd"
        />
      </svg>
      Flash sale
    </div>
  );
}

function GiftItemComp({ gift }: { gift: Gift }) {
  return (
    <div className="border-b-gray-150 flex gap-4 border-b pb-2 nth-last-[1]:border-b-0 nth-last-[1]:pb-0">
      <Image
        src={gift.images?.[0] || "/no-image.png"}
        width={128}
        height={96}
        alt={gift.displayName}
        className="h-12 w-12 overflow-hidden rounded-lg border"
      />
      <div className="flex-1 font-medium">
        {gift.displayName}
        <div className="flex justify-between">
          <div className="text-sm font-normal text-gray-600">
            {gift.quantity} x {gift.units?.[0].unitName}
          </div>
          <div className="text-primary flex items-center gap-2 font-medium">
            <div className="flex items-center gap-2 rounded-md bg-orange-50 px-2 py-0.5 text-sm text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              Quà tặng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
