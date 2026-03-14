import { Post } from "@/app/types/post";
import { noImagePath } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";

interface Props {
  posts: Post[];
}

const PostsView = ({ posts }: Props) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-4">
      <Link className="flex flex-col" href={`/bai-viet/${posts[0].slug}.html`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={posts[0].imageUrl ?? noImagePath}
            alt={posts[0].title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 640vw, 800px"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="mt-2 flex flex-col-reverse gap-1 lg:flex-col">
          <div className="bg-primary/10 w-fit rounded-full px-3 py-1 text-sm text-gray-700">
            {posts[0].categoryName}
          </div>
          <div className="font-medium">{posts[0].title}</div>
          <div className="line-clamp-2 text-sm font-normal text-gray-600">
            {posts[0].abstract}
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-4">
        {posts.slice(1).map((post, index) => (
          <Link
            href={`/bai-viet/${post.slug}.html`}
            key={index}
            className="flex items-start gap-4 rounded-xl bg-white p-2"
          >
            <Image
              src={post.imageUrl ?? noImagePath}
              alt={post.title}
              width={128}
              height={96}
              className="aspect-[4/3] w-24 rounded-lg object-contain"
            />
            <div className="flex flex-col gap-1">
              <div className="bg-primary/10 w-fit rounded-full px-3 py-1 text-sm text-gray-700">
                {post.categoryName}
              </div>
              <div className="font-medium">{post.title}</div>
              <div className="line-clamp-2 text-sm text-gray-600">
                {post.abstract}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostsView;
