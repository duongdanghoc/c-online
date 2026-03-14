import { getPost, getRootCategories } from "@/app/api/post";
import { noImagePath } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";
import PostsView from "./PostsView";

const HomePosts = async () => {
  const [rootCategoriesResp, postsResp] = await Promise.all([
    getRootCategories(),
    getPost({ page: 1, limit: 6 }),
  ]);

  if (!rootCategoriesResp.data || !postsResp.data) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4">
        <Image
          src={"/icons/post.png"}
          alt="post"
          width={64}
          height={64}
          className="h-8 w-8"
        />
        <h2>Chuyên mục sức khoẻ</h2>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 lg:mt-4 lg:gap-4">
        {rootCategoriesResp.data.map((category) => (
          <Link
            href={`/chuyen-muc/${category.slug}`}
            key={category.slug}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2"
          >
            <Image
              src={category.imageUrl ?? noImagePath}
              alt={category.name}
              className="h-6 w-6"
              width={24}
              height={24}
            />
            <h3 className="text-sm font-normal text-gray-800">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>

      {postsResp.data?.posts && postsResp.data?.posts.length > 0 && (
        <PostsView posts={postsResp.data.posts} />
      )}
    </div>
  );
};

export default HomePosts;
