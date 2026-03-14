import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BaseError } from "../types/base-error";
import { Resp } from "../types/response";

let apiInstance: AxiosInstance | null = null;

function getInitializedApiInstance() {
  if (!apiInstance) {
    const baseURL = process.env.NEXT_PUBLIC_C_WEB_API_URL;

    apiInstance = axios.create({
      baseURL: baseURL,
      timeout: 10000,
    });

    apiInstance.interceptors.request.use(async (config) => {
      return config;
    });

    apiInstance.interceptors.response.use(handleResponse, handleError);
  }
  return apiInstance;
}

async function handleResponse(response: AxiosResponse) {
  if (response.status != 200 && response.status != 201) {
    return Promise.reject(new BaseError(response.status, response.statusText));
  }

  if (response.data == null) {
    return Promise.reject(new BaseError(response.status, response.statusText));
  }

  const data = response.data;

  const code = data["RespCode"] ?? -9;

  if (code != 0) {
    const message = data["RespText"] ?? "Có lỗi xảy ra";
    return Promise.reject(new BaseError(code, message));
  }

  return data;
}

async function handleError(error: unknown) {
  return Promise.reject(
    error instanceof BaseError ? error : new BaseError(500, "Có lỗi xảy ra")
  );
}

const cWebApi = {
  get: (...args: Parameters<AxiosInstance["get"]>) =>
    getInitializedApiInstance().get(...args) as Resp<any>,
  post: (...args: Parameters<AxiosInstance["post"]>) =>
    getInitializedApiInstance().post(...args) as Resp<any>,
  put: (...args: Parameters<AxiosInstance["put"]>) =>
    getInitializedApiInstance().put(...args) as Resp<any>,
  delete: (...args: Parameters<AxiosInstance["delete"]>) =>
    getInitializedApiInstance().delete(...args) as Resp<any>,
  patch: (...args: Parameters<AxiosInstance["patch"]>) =>
    getInitializedApiInstance().patch(...args) as Resp<any>,
};

export default cWebApi;
