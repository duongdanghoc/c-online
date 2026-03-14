import { Skeleton } from "@/components/ui/skeleton";

const ProductPromosSkeleton = () => {
  return (
    <div className="mt-4 rounded-lg border border-orange-200 p-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default ProductPromosSkeleton;
