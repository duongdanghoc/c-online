import { getRefreshToken } from "@/app/(unauth)/login/actions";
import {
  BaseError,
  getErrorFromException,
  unauthorizedError,
} from "../types/base-error";
import { UserInfo } from "../types/user";
import api from "./api-with-auth";

export async function getUserInfo(): Promise<{
  data?: UserInfo;
  error?: BaseError;
}> {
  const token = await getRefreshToken();
  if (!token) {
    return {
      error: unauthorizedError,
    };
  }

  try {
    const response = (await api.get(`user/info`)) as UserInfo;

    return {
      data: response,
    };
  } catch (error) {
    return {
      error: getErrorFromException(error),
    };
  }
}

export async function updateUserInfo(info: UserInfo) {
  await api.post("user/updateInfo", info);
}
