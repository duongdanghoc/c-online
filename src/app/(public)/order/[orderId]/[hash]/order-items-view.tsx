import { OrderItem } from "@/app/types/order";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  items: OrderItem[];
}

const OrderItemsView = ({ items }: Props) => {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="font-semibold">Sản phẩm</div>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div
            key={item.orderItemId}
            className="flex gap-2 border-b pb-4 last:border-0 md:flex-row"
          >
            <div className="flex-shrink-0">
              <Link
                href={`/product/${item.productInfo.slug}`}
                className="block h-12 w-12 overflow-hidden rounded-md"
              >
                {item.productInfo.image && (
                  <Image
                    src={item.productInfo.image}
                    alt={item.productName}
                    width={128}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
            </div>
            <div className="flex flex-1 flex-col justify-between">
              {item.flashSaleId && <FlashSaleTag />}
              <div>
                <Link
                  href={`/product/${item.productInfo.slug}`}
                  className="hover:text-primary text-base font-medium"
                >
                  {item.productName}
                </Link>
                <div className="text-muted-foreground text-sm">
                  {item.unitName}
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-sm">
                  Số lượng:{" "}
                  <span className="font-medium">
                    {item.quantity} {item.unitName}
                  </span>
                </div>
                {item.type != "GIFT" && (
                  <div className="text-base font-medium">
                    {item.orderPrice < item.originalPrice && (
                      <span className="text-sm font-normal text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}{" "}
                    {item.orderPrice < item.originalPrice && <span> </span>}
                    {formatPrice(item.orderPrice)}{" "}
                  </div>
                )}
                <>
                  {item.type == "GIFT" && (
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
                  )}
                </>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function FlashSaleTag() {
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

export default OrderItemsView;
