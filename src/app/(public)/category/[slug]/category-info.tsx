import { Category } from "@/app/types/category";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import Image from "next/image";
import Link from "next/link";

interface Props {
  category: Category;
}

const CategoryInfo = ({ category }: Props) => {
  const items = [
    { label: "Trang chủ", href: "/" },
    ...(category.parents?.reverse().map((parent) => ({
      label: parent.name,
      href: `/danh-muc/${parent.slug}`,
    })) ?? []),
    { label: category.name, href: `/danh-muc/${category.slug}` },
  ];
  return (
    <div className="container mx-auto">
      <BreadcrumbsDefault items={items} />
      <div className="bg-gray-150 @container mt-4 mb-8 grid w-full grid-cols-2 gap-2 rounded-xl lg:grid-cols-4 lg:gap-4">
        {category.children?.map((child) => (
          <Link
            href={`/danh-muc/${child.slug}`}
            key={child.id}
            className="hover:bg-primary/10 flex cursor-pointer items-center gap-4 rounded-lg bg-white p-2 text-sm text-gray-800"
          >
            {child.imageUrl ? (
              <Image
                src={child.imageUrl}
                width={48}
                height={48}
                alt={child.name}
                className="overflow-hidden rounded-xl"
              />
            ) : null}
            <div className="flex flex-col gap-1">
              <div className="font-medium">{child.name}</div>
              <div className="text-xs text-gray-600">
                {child.productCount ?? "-"} sản phẩm
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryInfo;
