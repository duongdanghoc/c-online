import { BaseError } from "@/app/types/base-error";
import axios, { AxiosInstance, AxiosResponse } from "axios";

export const DEFAULT_TIMEOUT = 10000;

let apiInstance: AxiosInstance | null = null;
const isServer = () => typeof window === "undefined";

function getInitializedApiInstance() {
  if (!apiInstance) {
    const baseURL = isServer()
      ? process.env.API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL;

    apiInstance = axios.create({
      baseURL: baseURL,
      timeout: DEFAULT_TIMEOUT,
    });

    apiInstance.interceptors.request.use(async (config) => {
      return config;
    });

    apiInstance.interceptors.response.use(handleResponse, handleError);
  }
  return apiInstance;
}

async function handleResponse(response: AxiosResponse) {
  if (response.data == null) {
    return Promise.reject(new BaseError(response.status, response.statusText));
  }

  if (response.status != 200 && response.status != 201) {
    const data = response.data;
    const message = data.respText ?? response.statusText;
    return Promise.reject(new BaseError(response.status, message));
  }

  return response.data?.data;
}

async function handleError(error: any) {
  const status = error.response?.status;
  const errorMessage = error.response?.data?.respText;
  return Promise.reject(new BaseError(status, errorMessage));
}

const api = {
  get: (...args: Parameters<AxiosInstance["get"]>) =>
    getInitializedApiInstance().get(...args) as Promise<any>,
  post: (...args: Parameters<AxiosInstance["post"]>) =>
    getInitializedApiInstance().post(...args) as Promise<any>,
  put: (...args: Parameters<AxiosInstance["put"]>) =>
    getInitializedApiInstance().put(...args) as Promise<any>,
  delete: (...args: Parameters<AxiosInstance["delete"]>) =>
    getInitializedApiInstance().delete(...args) as Promise<any>,
  patch: (...args: Parameters<AxiosInstance["patch"]>) =>
    getInitializedApiInstance().patch(...args) as Promise<any>,
};

export default api;
