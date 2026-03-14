import {
  getRefreshToken,
  getToken,
  saveRefreshToken,
  saveTokenWithoutRedirect,
} from "@/app/(unauth)/login/actions";
import axios, { AxiosHeaders } from "axios";
import { jwtDecode } from "jwt-decode";
import { BaseError } from "../types/base-error";

const isServer = () => typeof window === "undefined";

// Debug logging utility
const DEBUG_AUTH = process.env.NEXT_PUBLIC_DEBUG_AUTH === "true";
function debugLog(context: string, message: string, data?: any) {
  if (!DEBUG_AUTH) return;
  const timestamp = new Date().toISOString();
  const prefix = `[AUTH ${isServer() ? "SERVER" : "CLIENT"}]`;
  console.log(`${prefix} [${timestamp}] [${context}]`, message, data || "");
}

const api = axios.create({
  baseURL: isServer()
    ? process.env.API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// --- CLIENT SIDE ONLY STATE ---
type RefreshSubscriber = (token: string) => void;
type RefreshRejecter = (error: unknown) => void;
let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];
let refreshRejecters: RefreshRejecter[] = [];
let memoryAccessToken: string | null = null; // In-memory token cache for client
let pendingTokenPromise: Promise<string | undefined> | null = null; // Dedupe concurrent token fetches

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
  refreshRejecters = [];
}

function addRefreshSubscriber(callback: RefreshSubscriber) {
  refreshSubscribers.push(callback);
}

function addRefreshRejecter(callback: RefreshRejecter) {
  refreshRejecters.push(callback);
}

function onRefreshFailed(error: unknown) {
  refreshRejecters.forEach((callback) => callback(error));
  refreshSubscribers = [];
  refreshRejecters = [];
}
// Memory token management (client-side only)
function getMemoryToken(): string | null {
  return memoryAccessToken;
}

function setMemoryToken(token: string): void {
  memoryAccessToken = token;
}

function clearMemoryToken(): void {
  memoryAccessToken = null;
  pendingTokenPromise = null;
}

async function fetchTokenWithDedupe(): Promise<string | undefined> {
  if (pendingTokenPromise) {
    debugLog("TOKEN_FETCH", "Deduplicating concurrent token fetch");
    return pendingTokenPromise;
  }

  debugLog("TOKEN_FETCH", "Fetching token from cookies");
  pendingTokenPromise = getToken()
    .then((token) => {
      if (token) {
        debugLog("TOKEN_FETCH", "Token fetched from cookies, updating memory", {
          expiry: getTokenExpiry(token),
        });
        setMemoryToken(token);
      } else {
        debugLog("TOKEN_FETCH", "No token found in cookies");
      }
      pendingTokenPromise = null;
      return token;
    })
    .catch((error) => {
      debugLog("TOKEN_FETCH", "Error fetching token from cookies", error);
      pendingTokenPromise = null;
      throw error;
    });

  return pendingTokenPromise;
}

const REFRESH_BUFFER = 5 * 60;

function isTokenAboutToExpire(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - now;

    debugLog("TOKEN_CHECK", "Checking token expiration", {
      timeUntilExpiry: `${Math.floor(timeUntilExpiry)}s`,
      refreshBuffer: `${REFRESH_BUFFER}s`,
      willRefresh: timeUntilExpiry < REFRESH_BUFFER,
    });

    return timeUntilExpiry < REFRESH_BUFFER;
  } catch (error) {
    debugLog(
      "TOKEN_CHECK",
      "Failed to decode token, treating as expired",
      error
    );
    return true;
  }
}

async function performClientRefresh(): Promise<string> {
  if (isRefreshing) {
    debugLog("REFRESH", "Refresh already in progress, queuing request", {
      subscriberCount: refreshSubscribers.length,
    });
    return new Promise<string>((resolve, reject) => {
      addRefreshSubscriber((token: string) => {
        debugLog("REFRESH", "Subscriber received new token");
        resolve(token);
      });
      addRefreshRejecter((error) => {
        debugLog("REFRESH", "Subscriber received error", error);
        reject(error);
      });
    });
  }

  isRefreshing = true;
  const oldToken = getMemoryToken();
  debugLog("REFRESH", "Starting token refresh", {
    oldTokenExpiry: oldToken ? getTokenExpiry(oldToken) : null,
  });

  try {
    const newAccessToken = await refreshAccessTokenViaRoute();

    debugLog("REFRESH", "Token refresh successful", {
      newTokenExpiry: getTokenExpiry(newAccessToken),
      subscriberCount: refreshSubscribers.length,
    });

    // Update memory token IMMEDIATELY on successful refresh
    setMemoryToken(newAccessToken);

    isRefreshing = false;
    onRefreshed(newAccessToken);

    return newAccessToken;
  } catch (refreshError) {
    debugLog("REFRESH", "Token refresh failed", refreshError);
    isRefreshing = false;
    onRefreshFailed(refreshError);
    clearMemoryToken();
    throw refreshError;
  }
}

// Helper to get token expiry for logging
function getTokenExpiry(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return null;
    return new Date(decoded.exp * 1000).toISOString();
  } catch {
    return null;
  }
}
// ------------------------------

api.interceptors.request.use(async (config) => {
  let token: string | undefined;

  if (isServer()) {
    token = await getToken();
    debugLog("REQUEST", "Using server-side token");
  } else {
    // CLIENT SIDE: Check if refresh is already in progress
    if (isRefreshing) {
      debugLog("REQUEST", "Refresh in progress, waiting for new token");
      try {
        // Wait for the ongoing refresh to complete
        token = await performClientRefresh();
      } catch (error) {
        debugLog("REQUEST", "Failed to get token from ongoing refresh", error);
        // Fall through to try getting token normally
      }
    }

    if (!token) {
      token = getMemoryToken() || undefined;
      if (token) {
        debugLog("REQUEST", "Using memory token", {
          expiry: getTokenExpiry(token),
        });
      }
    }

    if (!token) {
      debugLog("REQUEST", "No memory token, fetching from cookies");
      token = await fetchTokenWithDedupe();
    }
  }

  if (token) {
    // Check if token is about to expire (only if not already refreshing)
    if (!isRefreshing && isTokenAboutToExpire(token)) {
      debugLog("REQUEST", "Token about to expire, triggering refresh");
      try {
        if (isServer()) {
          token = await refreshAccessTokenOnServer();
        } else {
          token = await performClientRefresh();
        }
      } catch (error) {
        debugLog(
          "REQUEST",
          "Proactive refresh failed, proceeding with old token",
          error
        );
        // If refresh fails, let the request proceed with old token
        // and let response interceptor handle 401
      }
    }

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  } else {
    debugLog("REQUEST", "No token available for request");
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.status < 200 || response.status >= 300) {
      return Promise.reject(
        new BaseError(response.status, response.statusText)
      );
    }
    return response.data?.data ?? response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Nếu không phải 401 hoặc đã retry rồi thì throw lỗi luôn
    if (status !== 401 || originalRequest._retry) {
      const errorMessage = error.response?.data?.respText || error.message;
      debugLog("RESPONSE", `Non-401 error or already retried: ${status}`, {
        alreadyRetried: originalRequest._retry,
      });
      return Promise.reject(new BaseError(status, errorMessage));
    }

    debugLog("RESPONSE", "Received 401, attempting token refresh and retry");
    originalRequest._retry = true;

    // --- CASE 1: SERVER SIDE ---
    if (isServer()) {
      try {
        debugLog("RESPONSE", "Server-side 401 handling");
        const newAccessToken = await refreshAccessTokenOnServer();

        if (!originalRequest.headers)
          originalRequest.headers = new AxiosHeaders();
        (originalRequest.headers as AxiosHeaders).set(
          "Authorization",
          `Bearer ${newAccessToken}`
        );

        debugLog("RESPONSE", "Retrying request with new token");
        return api(originalRequest);
      } catch (refreshError) {
        debugLog("RESPONSE", "Server-side refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // --- CASE 2: CLIENT SIDE ---
    try {
      debugLog("RESPONSE", "Client-side 401 handling");
      const token = await performClientRefresh();

      if (!originalRequest.headers)
        originalRequest.headers = new AxiosHeaders();
      (originalRequest.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${token}`
      );

      debugLog("RESPONSE", "Retrying request with new token");
      return api(originalRequest);
    } catch (refreshError) {
      debugLog("RESPONSE", "Client-side refresh failed", refreshError);
      return Promise.reject(refreshError);
    }
  }
);

async function refreshAccessTokenOnServer() {
  const currentRefreshToken = await getRefreshToken();
  if (!currentRefreshToken) {
    throw new BaseError(401, "Thiếu refresh token, vui lòng đăng nhập lại");
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/web-auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${currentRefreshToken}`,
      },
    }
  );

  const newAccessToken = response.data?.data?.accessToken;
  const refreshToken = response.data?.data?.refreshToken;

  if (!newAccessToken || !refreshToken) {
    throw new BaseError(500, "Không nhận được token mới");
  }

  await saveTokenWithoutRedirect(newAccessToken);
  await saveRefreshToken(refreshToken);

  return newAccessToken;
}

async function refreshAccessTokenViaRoute() {
  const response = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new BaseError(
      response.status,
      payload?.message ?? "Hết phiên đăng nhập, vui lòng đăng nhập lại"
    );
  }

  const newAccessToken = payload?.data?.accessToken;
  if (!newAccessToken) {
    throw new BaseError(500, "Không nhận được token mới");
  }

  return newAccessToken;
}

export { clearMemoryToken };

export default api;
