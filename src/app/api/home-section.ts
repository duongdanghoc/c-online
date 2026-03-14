import { BaseError } from "../types/base-error";
import { HomeSection } from "../types/home-section";
import { Resp } from "../types/response";
import api from "./api";

export async function getHomeSections(): Promise<Resp<HomeSection[]>> {
  try {
    const data = (await api.get("/home-section")) as HomeSection[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
