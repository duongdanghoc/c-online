import { BaseError } from "@/app/types/base-error";
import { Resp } from "@/app/types/response";
import { GetBannersResp } from "../types/banner";
import api from "./api";

export async function getBanners(): Promise<Resp<GetBannersResp>> {
  try {
    const data = (await api.get("banner", {})) as GetBannersResp;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
