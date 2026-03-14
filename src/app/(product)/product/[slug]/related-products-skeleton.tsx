import { Skeleton } from "@/components/ui/skeleton";

const RelatedProductsSkeleton = () => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`related-product-skeleton-${index}`}
            className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm"
          >
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSkeleton;
