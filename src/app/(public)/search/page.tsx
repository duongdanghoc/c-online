import { getQueryClient } from "@/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SearchView from "./search-view";

interface Props {
  searchParams?: Promise<{
    "tu-khoa"?: string;
    "thuong-hieu"?: string[];
    "chi-dinh-su-dung"?: string[];
    gia: string;
  }>;
}

const Page = async ({ searchParams }: Props) => {
  const queryClient = getQueryClient();
  const resolvedParams = await searchParams;

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: generateSearchProductKey(
  //     resolvedParams?.["tu-khoa"],
  //     getStringArrayParams(resolvedParams?.["thuong-hieu"]),
  //     getStringArrayParams(resolvedParams?.["chi-dinh-su-dung"]),
  //     resolvedParams?.["gia"],
  //     undefined
  //   ),
  //   queryFn: async () => {
  //     const { searchProducts } = await import("@/app/api/search");
  //     const priceFilterText = resolvedParams?.["gia"];
  //     const priceFilter = priceFilterOptions.find(
  //       (option) => option.title === priceFilterText
  //     );
  //     const { data, error } = await searchProducts({
  //       aggs: true,
  //       from: 0,
  //       size: 4,
  //       query: resolvedParams?.["tu-khoa"],
  //       brands: resolvedParams?.["thuong-hieu"],
  //       indications: resolvedParams?.["chi-dinh-su-dung"],
  //       price: priceFilter
  //         ? {
  //             min: priceFilter.min,
  //             max: priceFilter.max,
  //           }
  //         : undefined,
  //     });
  //     if (error) {
  //       throw error;
  //     }
  //     return data;
  //   },
  //   initialPageParam: 0,
  //   getNextPageParam: (lastPage: any) => lastPage.nextPage ?? undefined,
  // });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <SearchView searchParams={resolvedParams} />
    </HydrationBoundary>
  );
};

export default Page;
