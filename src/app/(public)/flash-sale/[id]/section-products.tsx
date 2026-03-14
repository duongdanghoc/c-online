import {
  FlashSaleProduct,
  FlashSaleProductQuota,
} from "@/app/types/flash-sale";
import FlashSaleProductCard from "@/components/flash-sale/flash-sale-product-card";

interface Props {
  products: FlashSaleProduct[];
  quotas: FlashSaleProductQuota[];
}

const SectionProducts = ({ products, quotas }: Props) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4 xl:grid-cols-6">
      {products.map((product, index) => (
        <div key={product.slug + index} className="">
          <FlashSaleProductCard
            product={product}
            quota={quotas.filter((q) => q.productId == product.id)[0]}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionProducts;
