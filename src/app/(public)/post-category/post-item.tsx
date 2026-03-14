"use client";

import { Post } from "@/app/types/post";
import { noImagePath } from "@/lib/const";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  post: Post;
  isFirst?: boolean;
}

const PostItem = ({ post, isFirst }: Props) => {
  return (
    <Link
      href={`/bai-viet/${post.slug}.html`}
      key={post.slug}
      className={cn(
        "flex items-start gap-4 rounded-xl bg-white p-2 lg:gap-4 lg:p-4",
        {
          "flex-col lg:flex-row": isFirst,
        }
      )}
    >
      <Image
        src={post.imageUrl ?? noImagePath}
        alt={post.title}
        width={128}
        height={96}
        className={cn("aspect-[4/3] rounded-lg object-contain", {
          "w-full lg:w-32": isFirst,
          "w-24 lg:w-32": !isFirst,
        })}
      />
      <div className="flex flex-col gap-1">
        <div className="bg-primary/10 w-fit rounded-full px-3 py-1 text-xs text-gray-700">
          {post.categoryName}
        </div>
        <div className="font-medium">{post.title}</div>
        <div
          className="line-clamp-3 text-sm text-gray-700"
          dangerouslySetInnerHTML={{
            __html: post.abstract ?? "",
          }}
        ></div>
      </div>
    </Link>
  );
};

export default PostItem;
