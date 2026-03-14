import { getFeaturedCategories } from "@/app/api/category";
import Image from "next/image";
import Link from "next/link";

const FeaturedCategoryView = async () => {
  const { data, error } = await getFeaturedCategories();

  if (!data || error) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-2 pt-2 lg:grid-cols-8 lg:gap-4 lg:pt-4">
      {data.map((category) => (
        <Link
          href={`/danh-muc/${category.slug}`}
          key={category.id}
          className="flex w-full flex-col items-center gap-2 rounded-lg bg-white p-2"
        >
          <div className="">
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={64}
                height={64}
                className="h-8 w-8 overflow-hidden rounded-lg object-cover lg:h-12 lg:w-12"
              />
            )}
          </div>
          <span className="w-full text-center text-xs font-medium text-gray-800 lg:text-sm lg:font-semibold">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedCategoryView;
