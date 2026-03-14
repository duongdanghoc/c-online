import {
  FlashSaleProduct,
  FlashSaleProductQuota,
} from "@/app/types/flash-sale";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import FlashSaleProductCard from "./flash-sale-product-card";

interface Props {
  products: FlashSaleProduct[];
  quotas: FlashSaleProductQuota[];
}

const SectionProducts = ({ products, quotas }: Props) => {
  return (
    <Carousel opts={{ slidesToScroll: 2, align: "start" }} className="mt-4">
      <CarouselContent className="-ml-2 h-full lg:-ml-2">
        {products.map((product) => (
          <CarouselItem
            key={product.slug}
            className="basis-[calc(100%/2.2)] pl-2 lg:basis-1/4 lg:pl-2 xl:basis-1/6"
          >
            <div className="h-full">
              <FlashSaleProductCard
                product={product}
                quota={quotas.filter((q) => q.productId == product.id)[0]}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SectionProducts;
