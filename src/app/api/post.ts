import { cache } from "react";
import { BaseError } from "../types/base-error";
import { Post, PostCategory, PostInfo } from "../types/post";
import { Resp } from "../types/response";
import api from "./api";

export async function getRootCategories(): Promise<Resp<PostCategory[]>> {
  try {
    const data = (await api.get("/post-category")) as PostCategory[];
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Resp<PostCategory>> {
  try {
    const data = (await api.get(`/post-category/${slug}`)) as PostCategory;
    return {
      data,
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

interface PostsQuery {
  page?: number;
  limit?: number;
  categorySlug?: string;
}

interface GetPostsResponse {
  page: number;
  limit: number;
  total: number;
  posts: Post[];
  nextPage?: number;
}

export async function getPost({
  page,
  limit,
  categorySlug,
}: PostsQuery): Promise<Resp<GetPostsResponse>> {
  try {
    const data = (await api.get("/post", {
      params: {
        page: page || 1,
        limit: limit || 10,
        categorySlug,
      },
    })) as GetPostsResponse;
    return {
      data: {
        ...data,
        nextPage:
          data.total > (data.page || 1) * (limit || 10)
            ? data.page + 1
            : undefined,
      },
    };
  } catch (e) {
    return {
      error: e as BaseError,
    };
  }
}

export const getPostBySlug = cache(
  async (slug: string): Promise<Resp<PostInfo>> => {
    try {
      const data = (await api.get(`/post/${slug}/detail`)) as PostInfo;
      return {
        data,
      };
    } catch (e) {
      return {
        error: e as BaseError,
      };
    }
  }
);
