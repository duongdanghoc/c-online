import { getPromotionBySlug } from "@/app/api/promotion";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import { redirect } from "next/navigation";
import PromotionDescription from "./promotion-description";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const { data: promotion, error } = await getPromotionBySlug(slug);

  if (error || !promotion) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto pb-8">
      <BreadcrumbsDefault
        items={[{ label: "Trang chủ", href: "/" }, { label: promotion.title }]}
      />
      <div className="mt-8 flex h-fit flex-col gap-4">
        <h1>{promotion.title}</h1>
        <div className="relative flex h-fit w-full flex-col gap-4">
          {promotion.images?.length > 0 &&
            promotion.images.map((image, index) => (
              <div className="relative aspect-[2/1] w-full" key={index}>
                <Image
                  key={image}
                  src={image}
                  alt={promotion.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1000px, 1280px"
                  className="aspect-square w-full rounded-xl object-contain"
                />
              </div>
            ))}
        </div>

        {promotion.fullDescription && (
          <PromotionDescription description={promotion.fullDescription} />
        )}

        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4 xl:grid-cols-6">
          {promotion.products.map((product) => (
            <div key={product.productId}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
