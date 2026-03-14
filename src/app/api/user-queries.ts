import { getUserInfo } from "@/app/api/user";
import { unauthorizedError } from "@/app/types/base-error";
import { UserInfo } from "@/app/types/user";

export const userInfoQueryKey = ["userInfo"] as const;

export async function fetchUserInfo(): Promise<UserInfo> {
  const resp = await getUserInfo();

  if (!resp.data || resp.error) {
    throw resp.error ?? unauthorizedError;
  }

  return resp.data;
}
