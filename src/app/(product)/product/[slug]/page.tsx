import { getProductDetail, getRelatedProducts } from "@/app/api/product";
import { getProductPromos } from "@/app/api/promo";
import { ProductInfo } from "@/app/types/product";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import { Stars } from "@/components/feedback/stars";
import AddToCartButton from "@/components/product/AddToCartButton";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, cache } from "react";
import AddToCart from "./add-to-cart";
import ConsultationFormButton from "./consultation-form-button";
import ProductAuthorComp from "./product-author-comp";
import ProductDescription from "./product-description";
import ProductHighlights from "./product-highlights";
import ProductImages from "./product-images";
import ProductInteractions from "./product-interactions";
import ProductPromosComp from "./product-promos-comp";
import ProductPromosSkeleton from "./product-promos-skeleton";
import RelatedProducts from "./related-products";
import RelatedProductsSkeleton from "./related-products-skeleton";
import TikTokViewContent from "./tiktok-view-content";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: Props
): Promise<Metadata | undefined> {
  const params = await props.params;
  const slug = params.slug.replace(".html", "");

  const { data: product } = await getProductDetailCached(slug);

  if (product) {
    return {
      title: product.displayName,
      description: product.metaDescription,
      alternates: {
        canonical: `https://cpc1hnshop.com/san-pham/${slug}.html`,
      },
      openGraph: {
        title: product.displayName,
        description: product.metaDescription,
        images:
          product.images && product.images.length > 0
            ? {
                url: getImageUrl(product.images[0], 1200),
                width: 1200,
                height: 900,
              }
            : undefined,
      },
      authors: product.author && {
        name: "Cửa hàng trực tuyến - CPC1 Hà Nội",
      },
      robots: "index, follow",
      keywords: product.keywords ?? [],
    };
  }

  return undefined;
}

const Product = async (props: Props) => {
  const params = await props.params;
  const slug = params.slug.replace(".html", "");

  const productInfoResp = await getProductDetailCached(slug);

  if (!productInfoResp.data || productInfoResp.error) {
    return redirect("/");
  }
  const productInfo = productInfoResp.data;
  const productImages = productInfo.images || [];
  const cartProduct = {
    productId: productInfo.productId,
    displayName: productInfo.displayName,
    slug: productInfo.slug,
    units: productInfo.units ?? [],
    images: productInfo.images ?? [],
  };

  const categories = productInfo.categories ?? [];
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    ...[...categories].reverse().map((parent) => ({
      label: parent.name,
      href: `/danh-muc/${parent.slug}`,
    })),
  ];

  const category = categories[categories.length - 1];

  const info = (
    <div className="mt-4 flex flex-col gap-4">
      <Suspense fallback={<ProductPromosSkeleton />}>
        <ProductPromosSection slug={slug} />
      </Suspense>

      {productInfo.productNoticeUrl && (
        <Link
          className="flex items-center gap-2 font-medium text-green-600"
          href={productInfo.productNoticeUrl}
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
          Xem giấy công bố sản phẩm
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </Link>
      )}
      <ProductInfoItem label="Thương hiệu">
        {productInfo.brand && <div>{productInfo.brand?.name} </div>}
      </ProductInfoItem>
      <ProductInfoItem label="Danh mục">
        {category?.slug ? (
          <Link
            href={`/danh-muc/${category.slug}`}
            className="text-blue-800"
          >
            {category?.name}{" "}
          </Link>
        ) : (
          <div>{category?.name ?? ""}</div>
        )}
      </ProductInfoItem>
      {productInfo.shortDescription && !productInfo.highlights && (
        <ProductInfoItem label="Mô tả ngắn">
          {productInfo.shortDescription}
        </ProductInfoItem>
      )}
      <ProductInfoItem label="Thành phần chính">
        {productInfo.ingredients}
      </ProductInfoItem>
      <ProductInfoItem label="Chỉ định sử dụng">
        {productInfo.indications?.join(", ") ?? ""}
      </ProductInfoItem>
      <ProductInfoItem label="Số đăng ký">
        {productInfo.registerNumber}
      </ProductInfoItem>

      {productInfo.highlights && (
        <ProductHighlights highlights={productInfo.highlights} />
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-4 text-sm lg:text-base">
      <div className="mb-4">
        <BreadcrumbsDefault items={breadcrumbItems} />
      </div>
      <div className="grid grid-cols-12 gap-4 rounded-xl bg-white p-2 lg:p-4">
        {/* Add product details here */}
        <div className="col-span-12 lg:col-span-5">
          <ProductImages
            images={productImages}
            productName={productInfo.displayName}
          />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="relative flex flex-col items-baseline gap-2 lg:flex-row">
            <div className="text-md absolute top-0.5 left-0 rounded-md bg-gradient-to-b from-red-700 to-red-400 px-1 py-0.5 text-white">
              Mall
            </div>
            <h1 className="inline-block">
              <span className="h-4 w-12 px-5">{"    "}</span>
              {productInfo.displayName}
            </h1>
          </div>

          {productInfo.rate?.avg ? (
            <div className="mt-1 flex items-center gap-2">
              <Stars rate={productInfo.rate?.avg || 0} />
              <div className="font-bold text-gray-700">
                {productInfo.rate?.avg.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                ({productInfo.rate?.count || 0} đánh giá)
              </div>
            </div>
          ) : null}

          {cartProduct.units.length > 0 ? (
            <AddToCart product={cartProduct}>{info}</AddToCart>
          ) : (
            info
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white">
        {!!productInfo.fullDescription && (
          <ProductDescription
            description={productInfo.fullDescription}
            toc={productInfo.toc ?? ""}
          />
        )}
        {productInfo.author && (
          <ProductAuthorComp author={productInfo.author} />
        )}
      </div>

      <ProductInteractions
        slug={slug}
        productId={productInfo.productId?.toString() ?? ""}
      />

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsSection slug={slug} />
      </Suspense>

      {/* TikTok Pixel tracking for ViewContent event */}
      <TikTokViewContent
        contentId={productInfo.productId?.toString() ?? slug}
        contentName={productInfo.displayName}
        value={productInfo.units?.[0]?.sellingPrice}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(productInfo)),
        }}
      />

      {productInfo.units?.[0] && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex h-fit w-full gap-2 rounded-t-2xl bg-white p-3 shadow-sm lg:hidden">
          <div className="flex-1">
            <AddToCartButton
              product={cartProduct}
              initialUnit={productInfo.units[0]}
            >
              <Button className="w-full flex-1 rounded-full py-6">
                Chọn mua
              </Button>
            </AddToCartButton>
          </div>
          <ConsultationFormButton />
        </div>
      )}
    </div>
  );
};

function ProductInfoItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lg:items-centers flex flex-col items-start gap-1 lg:flex-row lg:gap-2">
      <span className="w-full text-sm text-gray-600 lg:w-40 lg:text-base">
        {label}
      </span>
      <div className="flex-1 text-sm font-medium text-gray-800 lg:text-base">
        {children}
      </div>
    </div>
  );
}

function generateProductSchema(product: ProductInfo) {
  const ratingCount = product.rate?.count || 1;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    image:
      product.images && product.images.length > 0
        ? product.images[0]
        : undefined,
    description: product.metaDescription,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand?.name,
        }
      : undefined,
    offers: product.units &&
      product.units.length > 0 && {
        "@type": "Offer",
        priceCurrency: "VND",
        price: product.units[0].sellingPrice,
        availability: "https://schema.org/InStock",
      },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rate?.avg || 5,
      bestRating: "5",
      worstRating: "1",
      ratingCount: ratingCount > 1 ? ratingCount : 1,
    },
  };

  const cleanedSchema = Object.entries(schema).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
  return cleanedSchema;
}

const getProductDetailCached = cache((slug: string) => getProductDetail(slug));

async function ProductPromosSection({ slug }: { slug: string }) {
  const promosResp = await getProductPromos(slug);

  if (!promosResp.data || promosResp.data.length === 0) {
    return null;
  }

  return <ProductPromosComp promos={promosResp.data} />;
}

async function RelatedProductsSection({ slug }: { slug: string }) {
  const relatedProductsResp = await getRelatedProducts(slug);
  const relatedProducts = relatedProductsResp.data || [];

  if (relatedProducts.length === 0) {
    return null;
  }

  return <RelatedProducts products={relatedProducts} />;
}

export default Product;
