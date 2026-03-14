import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { accessTokenKey, refreshTokenKey } from "@/lib/const";

const REFRESH_ENDPOINT = `/web-auth/refresh`;

async function refreshTokensOnBackend(refreshToken: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${REFRESH_ENDPOINT}`,
    { withCredentials: true },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  return response.data?.data;
}

export async function POST() {
  const cookieStore = await cookies();
  const existingRefreshToken = cookieStore.get(refreshTokenKey)?.value;

  if (!existingRefreshToken) {
    console.error("[REFRESH API] No refresh token found in cookies");
    return NextResponse.json(
      { message: "Thiếu refresh token" },
      { status: 401 }
    );
  }

  try {
    console.log("[REFRESH API] Starting token refresh");
    const refreshedTokens = await refreshTokensOnBackend(existingRefreshToken);
    const accessToken = refreshedTokens?.accessToken;
    const newRefreshToken = refreshedTokens?.refreshToken;

    if (!accessToken || !newRefreshToken) {
      console.error("[REFRESH API] Missing tokens in backend response");
      return NextResponse.json(
        { message: "Refresh token thất bại" },
        { status: 500 }
      );
    }

    const payload = decodeJwtPayload(accessToken);
    if (!payload?.exp) {
      throw new Error("JWT missing exp claim");
    }
    const refreshPayload = decodeJwtPayload(newRefreshToken);
    if (!refreshPayload?.exp) {
      throw new Error("JWT missing exp claim");
    }

    const now = Math.floor(Date.now() / 1000);
    const accessMaxAge = payload.exp - now;
    const refreshMaxAge = refreshPayload.exp - now;

    console.log("[REFRESH API] Token expiry info:", {
      accessTokenExpiry: new Date(payload.exp * 1000).toISOString(),
      refreshTokenExpiry: new Date(refreshPayload.exp * 1000).toISOString(),
      currentTime: new Date(now * 1000).toISOString(),
      accessMaxAge,
      refreshMaxAge,
    });

    // CRITICAL: Validate that backend didn't return expired tokens
    if (accessMaxAge <= 0) {
      console.error("[REFRESH API] Backend returned EXPIRED access token!", {
        expiry: new Date(payload.exp * 1000).toISOString(),
        now: new Date(now * 1000).toISOString(),
        diff: accessMaxAge,
      });
      return NextResponse.json(
        { message: "Backend trả về token đã hết hạn" },
        { status: 500 }
      );
    }

    if (refreshMaxAge <= 0) {
      console.error("[REFRESH API] Backend returned EXPIRED refresh token!", {
        expiry: new Date(refreshPayload.exp * 1000).toISOString(),
        now: new Date(now * 1000).toISOString(),
        diff: refreshMaxAge,
      });
      return NextResponse.json(
        { message: "Backend trả về refresh token đã hết hạn" },
        { status: 500 }
      );
    }

    const secure = process.env.COOKIE_SECURE === "true";

    console.log("[REFRESH API] Setting cookies with maxAge:", {
      accessMaxAge,
      refreshMaxAge,
      secure,
    });

    cookieStore.set(accessTokenKey, accessToken, {
      maxAge: accessMaxAge,
      secure,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set(refreshTokenKey, newRefreshToken, {
      maxAge: refreshMaxAge,
      secure,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    console.log("[REFRESH API] Tokens refreshed and cookies set successfully");

    return NextResponse.json(
      {
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.respText ??
      error.message ??
      "Có lỗi xảy ra trong quá trình refresh ";

    console.error("[REFRESH API] Refresh failed:", {
      status,
      message,
      error: error.message,
    });

    return NextResponse.json({ message }, { status });
  }
}
function decodeJwtPayload(accessToken: any) {
  const payload = accessToken.split(".")[1];
  const decoded = Buffer.from(payload, "base64url").toString("utf8");
  return JSON.parse(decoded);
}
