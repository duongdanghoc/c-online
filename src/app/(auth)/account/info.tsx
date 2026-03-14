"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

const Info = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return <Skeleton className="h-24 w-full rounded-xl bg-white" />;

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative h-fit overflow-hidden rounded-xl bg-gradient-to-bl from-[#195eb3] to-[#4c7eba]">
      <div className="ms-4 pt-4 text-xs font-semibold text-[#FDE395] uppercase">
        Khách hàng
      </div>

      <div className="relative ms-4 mt-1 mb-4 flex items-start gap-2">
        <Image
          width={32}
          height={32}
          alt="avatar"
          src={"white-logo.png"}
          className="h-8 w-8"
        />
        <div>
          <div className="font-bold text-white">
            {user.fullName ?? "Khách hàng"}
          </div>
          <div className="text-sm text-white/90">{user.phoneNumber}</div>
        </div>

        <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full border border-white/20"></div>

        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full border border-white/20"></div>
      </div>
    </div>
  );
};

export default Info;
