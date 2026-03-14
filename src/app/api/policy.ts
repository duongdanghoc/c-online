import { BaseError } from "../types/base-error";
import { Policy, PolicyDetail } from "../types/policy";
import { Resp } from "../types/response";
import api from "./api";

export async function getAllPolicies(): Promise<Resp<Policy[]>> {
  try {
    const data = (await api.get(`policy`, {})) as Policy[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getPolicyDetail(
  slug: string
): Promise<Resp<PolicyDetail>> {
  try {
    const data = (await api.get(`policy/${slug}`)) as PolicyDetail;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
