import { getCategoryDetail } from "@/app/api/category";
import SafeHTML from "@/components/common/safe-html";
import styles from "@/lib/styles/content.module.css";
import { getImageUrl } from "@/lib/utils";
import { getQueryClient } from "@/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import classNames from "classnames";
import { redirect } from "next/navigation";
import CategoryInfo from "./category-info";
import CategoryProductsView from "./category-product-view";

interface Props {
  searchParams?: Promise<{
    "thuong-hieu"?: string[];
    "chi-dinh-su-dung"?: string[];
    gia: string;
  }>;
  params?: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const slug = params?.slug ?? "";

  const [getCategoryResp] = await Promise.all([await getCategoryDetail(slug)]);

  if (!getCategoryResp.data || getCategoryResp.error) {
    return undefined;
  }

  return {
    title: getCategoryResp.data.name,
    description: getCategoryResp.data.name,
    openGraph: {
      title: getCategoryResp.data.name,
      description: getCategoryResp.data.name,
      images: [
        {
          url: getImageUrl(getCategoryResp.data.imageUrl, 1200),
          width: 1200,
          height: 1200,
        },
      ],
    },
  };
}

const Page = async (props: Props) => {
  const queryClient = getQueryClient();

  const [searchParams, params] = await Promise.all([
    await props.searchParams,
    await props.params,
  ]);

  const [getCategoryResp] = await Promise.all([
    await getCategoryDetail(params?.slug ?? ""),
  ]);

  if (!getCategoryResp.data || getCategoryResp.error) {
    return redirect("/");
  }

  const dehydratedState = dehydrate(queryClient);
  const description = getCategoryResp.data.description || "";
  return (
    <>
      <h1 className="hidden">{getCategoryResp.data.name}</h1>
      <CategoryInfo category={getCategoryResp.data} />
      <HydrationBoundary state={dehydratedState}>
        {params?.slug && (
          <CategoryProductsView
            searchParams={searchParams}
            slug={params.slug}
          />
        )}
      </HydrationBoundary>
      {!!description && (
        <div className="container mx-auto">
          <div
            className={classNames(
              styles.content,
              "mt-4 w-full !max-w-full rounded-xl bg-white !p-2 xl:!p-4"
            )}
          >
            <SafeHTML html={description} />
          </div>
        </div>
      )}
      <div className="h-8"></div>
    </>
  );
};

export default Page;
