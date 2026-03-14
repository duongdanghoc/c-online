import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const LoadingCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative flex flex-col space-y-2 overflow-hidden rounded-xl bg-white p-2",
        className,
      )}
      {...props}
    >
      <Skeleton className="aspect-[4/3] w-full bg-gray-150" />
      <Skeleton className="h-3 w-full bg-gray-150" />
      <Skeleton className="h-3 w-1/2 bg-gray-150" />
      <Skeleton className="h-3 w-2/3 bg-gray-150" />
      <Skeleton className="h-4 w-full bg-gray-150" />
      <Skeleton className="h-3 w-1/2 bg-gray-150" />
      <Skeleton className="h-4 w-full rounded-full bg-gray-150" />
      <Skeleton className="l w-ful h-8 bg-gray-150" />
    </div>
  );
};

export default LoadingCard;
