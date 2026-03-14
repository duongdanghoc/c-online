import {
  AmountOffItemEffect,
  PercentOffItemEffect,
} from "@/app/types/promo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatPrice } from "@/lib/utils";
import PromoInfoButton from "./PromoInfoButton";

type ItemDiscountEffect = PercentOffItemEffect | AmountOffItemEffect;

interface ItemDiscountPromoInfoProps {
  effect: ItemDiscountEffect;
}

function buildDetails(effect: ItemDiscountEffect) {
  const details: string[] = [];

  if (effect.type === "PERCENT_OFF_ITEM") {
    details.push(`Giảm ${effect.discountPercent}% trên mỗi sản phẩm đủ điều kiện`);

    if (effect.maxDiscountPerItem !== undefined) {
      details.push(
        `Mức giảm tối đa ${formatPrice(effect.maxDiscountPerItem)} cho mỗi sản phẩm`
      );
    }
  } else {
    details.push(`Giảm ${formatPrice(effect.discountAmount)} trên mỗi sản phẩm`);
  }

  if (effect.maxQuantity !== undefined) {
    details.push(`Áp dụng cho tối đa ${effect.maxQuantity} sản phẩm trong một đơn`);
  }

  if (effect.minOrderAmount !== undefined) {
    details.push(
      `Cần đơn hàng tối thiểu ${formatPrice(effect.minOrderAmount)} để kích hoạt ưu đãi`
    );
  }

  return details;
}

function ItemDiscountPromoInfo({ effect }: ItemDiscountPromoInfoProps) {
  const details = buildDetails(effect);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <PromoInfoButton ariaLabel="Xem chi tiết ưu đãi giảm giá sản phẩm" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="me-4 w-72 max-w-[18rem] space-y-2 text-sm"
      >
        <div className="font-semibold text-orange-500">Chi tiết giảm giá sản phẩm</div>
        <ul className="list-disc space-y-1 ps-5 text-slate-700">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default ItemDiscountPromoInfo;
