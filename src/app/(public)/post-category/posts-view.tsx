"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PostItem from "./post-item";

const PostsView = ({ slug }: { slug?: string }) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", slug],
      queryFn: async ({ pageParam }) => {
        const { getPost } = await import("@/app/api/post");
        const { data, error } = await getPost({
          page: pageParam,
          limit: 12,
          categorySlug: slug,
        });
        if (error) {
          throw error;
        }
        return data;
      },
      getNextPageParam: (lastPage: any) => {
        return lastPage.nextPage ?? undefined;
      },
      initialPageParam: 0,
    });
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data?.pages.map((page, index) =>
          page?.posts.map((post, index2) => (
            <PostItem
              key={post.slug}
              post={post}
              isFirst={index === 0 && index2 === 0}
            />
          ))
        )}
      </div>

      <div className="flex items-center justify-center">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            variant={"ghost"}
            className="mt-4"
          >
            Xem thêm
            {isFetchingNextPage ? (
              <Loader2 className="animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                />
              </svg>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostsView;
