import { getRootCategories } from "@/app/api/post";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import { noImagePath } from "@/lib/const";
import { getQueryClient } from "@/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import PostsView from "./posts-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  const queryClient = getQueryClient();
  const [children] = await Promise.all([
    getRootCategories(),
    queryClient.prefetchInfiniteQuery({
      queryKey: ["posts"],
      queryFn: async () => {
        const { getPost } = await import("@/app/api/post");
        const { data, error } = await getPost({
          page: 0,
          limit: 12,
          categorySlug: undefined,
        });
        if (error) {
          throw error;
        }
        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: any) => {
        return lastPage.nextPage ?? undefined;
      },
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="container mx-auto grid grid-cols-12 gap-4 pb-12">
      <div className="col-span-full">
        <BreadcrumbsDefault
          items={[
            {
              label: "Trang chủ",
              href: "/",
            },
            {
              label: "Chuyên mục sức khoẻ",
              href: "",
            },
          ]}
        ></BreadcrumbsDefault>
      </div>

      <div className="col-span-full">
        <h1 className="w-full text-center lg:text-3xl">Chuyên mục sức khoẻ</h1>
        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
          {children.data?.map((category) => (
            <Link
              href={`/chuyen-muc/${category.slug}`}
              key={category.slug}
              className="hover:bg-primary/10 flex items-center gap-2 rounded-lg bg-white p-2 lg:flex-col lg:p-6"
            >
              <Image
                src={category.imageUrl ?? noImagePath}
                alt={category.name}
                className="h-10 w-10 rounded-lg lg:hidden"
                width={48}
                height={48}
              />
              <Image
                src={category.imageUrl ?? noImagePath}
                alt={category.name}
                className="hidden h-24 w-24 rounded-lg lg:block"
                width={96}
                height={96}
              />
              <h3 className="text-sm text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="col-span-full">
        <HydrationBoundary state={dehydratedState}>
          <PostsView />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default Page;
