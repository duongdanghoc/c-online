import { getFeaturedProducts } from "@/app/api/product";
import FeaturedProductsList from "./FeaturedProductsList";

const FeaturedProducts = async () => {
  const { data, error } = await getFeaturedProducts();

  if (!data || error || data.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-8 h-fit rounded-xl bg-gradient-to-t from-orange-50 to-orange-200 p-2">
      <div className="featured-tag">
        <div className="px-2 text-base">Sản phẩm nổi bật</div>
      </div>
      <FeaturedProductsList initialProducts={data} />
    </div>
  );
};

export default FeaturedProducts;
