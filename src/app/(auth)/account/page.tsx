"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import UnAuthentication from "./unauthentication";
import UserInfoView from "./user-info-view";

const Page = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return <Skeleton className="h-48 w-full rounded-xl bg-white" />;

  if (!isAuthenticated || !user) return <UnAuthentication />;

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      {user && <UserInfoView info={user} />}
    </div>
  );
};

export default Page;
