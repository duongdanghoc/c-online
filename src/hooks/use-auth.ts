import { fetchUserInfo, userInfoQueryKey } from "@/app/api/user-queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: userInfoQueryKey,
    queryFn: fetchUserInfo,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = () => {
    queryClient.setQueryData(userInfoQueryKey, null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
  };
}
