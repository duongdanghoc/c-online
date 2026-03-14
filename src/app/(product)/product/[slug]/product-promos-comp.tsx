import { ProductPromo, PromoEffectSchema } from "@/app/types/promo";
import Image from "next/image";
import Link from "next/link";
import TieredPromoInfo from "@/components/promo/TieredPromoInfo";
import ItemDiscountPromoInfo from "@/components/promo/ItemDiscountPromoInfo";

interface Props {
  promos: ProductPromo[];
}

function renderPromoInfo(effect?: PromoEffectSchema) {
  if (!effect) return null;

  switch (effect.type) {
    case "TIERED_ITEM":
      return <TieredPromoInfo effect={effect} />;
    case "PERCENT_OFF_ITEM":
    case "AMOUNT_OFF_ITEM":
      return <ItemDiscountPromoInfo effect={effect} />;
    default:
      return null;
  }
}

const ProductPromosComp = ({ promos }: Props) => {
  return (
    <div className="mt-4 rounded-lg border border-orange-200 p-2">
      <div className="flex gap-1 font-medium">
        <Image
          src={"icons/voucher.png"}
          alt="Free Shipping"
          width={64}
          height={64}
          className="h-6 w-6"
        />
        <span className="text-orange-400 italic">Khuyến mại hot</span>
        <br />
      </div>
      <div className="text-xs font-light text-gray-500">
        ** Mua thêm để đạt điều kiện và áp dụng ngay ưu đãi
      </div>
      <ul className="mt-2 flex list-inside list-none flex-col gap-2 text-sm">
        {promos?.map((promo) => (
          <li key={promo.id}>
            <div className="flex justify-center gap-2">
              <div>
                <div className="rounded-md bg-orange-50 p-2">
                  <Image
                    src={"icons/coupon.png"}
                    alt="Free Shipping"
                    width={64}
                    height={64}
                    className="h-6 w-6"
                  />
                </div>
              </div>
              <div
                className="flex min-h-[24px] flex-1 flex-col justify-center self-stretch"
                style={{
                  minHeight: "1.5rem",
                }}
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{promo.name}</span>
                  {renderPromoInfo(promo.effectObj)}
                </div>
                <div className="flex flex-col gap-1">
                  {promo.gifts &&
                    promo.gifts.length > 0 &&
                    promo.gifts.map((gift, index) => (
                      <Link
                        href={`/san-pham/${gift.slug}`}
                        key={gift.displayName + index}
                        className="flex items-center gap-2 rounded-sm bg-orange-50 p-1 text-gray-700"
                      >
                        {gift.imageUrl && (
                          <Image
                            src={gift.imageUrl}
                            alt={gift.displayName}
                            width={64}
                            height={64}
                            className="h-10 w-10 rounded-xs"
                          />
                        )}
                        {gift.displayName}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPromosComp;
