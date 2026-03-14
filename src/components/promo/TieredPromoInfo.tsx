import {
  TieredBenefit,
  TieredDiscountBenefit,
  TieredGiftBenefit,
  TieredItemEffect,
} from "@/app/types/promo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatPrice } from "@/lib/utils";
import PromoInfoButton from "./PromoInfoButton";

interface TieredPromoInfoProps {
  effect: TieredItemEffect;
}

const appliesToText: Record<TieredDiscountBenefit["appliesTo"], string> = {
  unit: "mỗi đơn vị sản phẩm",
  line: "mỗi sản phẩm",
  cart: "toàn bộ đơn hàng",
};

function describeCap(cap: TieredDiscountBenefit["cap"] | undefined) {
  if (!cap) return "";

  const parts: string[] = [];

  if (cap.perUnit !== undefined) {
    parts.push(`tối đa ${formatPrice(cap.perUnit)} cho mỗi đơn vị sản phẩm`);
  }

  if (cap.perLine !== undefined) {
    parts.push(`tối đa ${formatPrice(cap.perLine)} cho mỗi sản phẩm`);
  }

  if (cap.perCart !== undefined) {
    parts.push(`tối đa ${formatPrice(cap.perCart)} cho mỗi đơn hàng`);
  }

  return parts.length ? ` (Giới hạn ${parts.join("; ")})` : "";
}

function describeDiscountBenefit(benefit: TieredDiscountBenefit) {
  const target = appliesToText[benefit.appliesTo];

  if (benefit.method === "percent") {
    return `Giảm ${benefit.value}% trên ${target}${describeCap(benefit.cap)}`;
  }

  return `Giảm ${formatPrice(benefit.value)} trên ${target}${describeCap(benefit.cap)}`;
}

function describeGiftBenefit(benefit: TieredGiftBenefit) {
  const items = benefit.items.map((item) => {
    const name = item.name ?? "quà tặng";
    return `${item.quantity} x ${name}`;
  });

  const appliesTo =
    benefit.appliesTo === "unit"
      ? "mỗi đơn vị sản phẩm"
      : benefit.appliesTo === "line"
        ? "mỗi sản phẩm"
        : "đơn hàng";

  return `Tặng ${items.join(", ")} áp dụng cho ${appliesTo}`;
}

function describeBenefit(benefit: TieredBenefit) {
  if (benefit.kind === "discount") {
    return describeDiscountBenefit(benefit);
  }

  return describeGiftBenefit(benefit);
}

function TieredPromoInfo({ effect }: TieredPromoInfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <PromoInfoButton ariaLabel="Xem chi tiết ưu đãi theo bậc" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="me-4 w-72 max-w-[18rem] space-y-3 text-sm"
      >
        <div className="font-semibold text-orange-500">Chi tiết ưu đãi</div>
        <div className="space-y-3">
          {effect.tiers.map((tier, index) => (
            <div key={tier.threshold} className="space-y-1">
              <div className="font-medium">
                Bậc {index + 1}: Mua từ {tier.threshold} đơn vị sản phẩm
              </div>
              <ul className="list-disc space-y-1 ps-5 text-slate-700">
                {tier.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex}>{describeBenefit(benefit)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TieredPromoInfo;
