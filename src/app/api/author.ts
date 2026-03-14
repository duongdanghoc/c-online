import { BaseError } from "../types/base-error";
import { Resp } from "../types/response";
import api from "./api";

export interface Author {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  position?: string;
  specialty?: string;
  experience?: string;
}

export async function getAuthor(slug: string): Promise<Resp<Author>> {
  try {
    const response = await api.get(`author/${slug}`);

    return {
      data: response as Author,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}
