"use server";

import api from "@/app/api/api-with-auth";
import { accessTokenKey, refreshTokenKey } from "@/lib/const";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveToken(token: string) {
  saveTokenWithoutRedirect(token);
  redirect("/");
}

function decodeJwtPayload(token: string): any {
  const payload = token.split(".")[1];
  const decoded = Buffer.from(payload, "base64url").toString("utf8");
  return JSON.parse(decoded);
}

export async function saveTokenWithoutRedirect(token: string) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    throw new Error("JWT missing exp claim");
  }

  const now = Math.floor(Date.now() / 1000);
  const maxAge = payload.exp - now;

  if (maxAge <= 0) {
    throw new Error("JWT already expired");
  }

  console.log(maxAge);

  (await cookies()).set(accessTokenKey, token, {
    maxAge,
    secure: process.env.COOKIE_SECURE === "true",
    httpOnly: true,
    sameSite: "strict",
  });
}

export async function clearToken() {
  const refreshToken = await getRefreshToken();

  try {
    await api.post("web-auth/logout", {
      refreshToken: refreshToken,
    });
  } catch (e) {
    console.log(e);
  }
  (await cookies()).delete(accessTokenKey);
  (await cookies()).delete(refreshTokenKey);
}

export async function getToken() {
  const token = (await cookies()).get(accessTokenKey)?.value;
  return token;
}

// Refresh token
export async function saveRefreshToken(token: string) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    throw new Error("JWT missing exp claim");
  }

  const now = Math.floor(Date.now() / 1000);
  const maxAge = payload.exp - now;

  if (maxAge <= 0) {
    throw new Error("JWT already expired");
  }

  (await cookies()).set(refreshTokenKey, token, {
    maxAge,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.COOKIE_SECURE === "true",
  });
}

export async function getRefreshToken() {
  const token = (await cookies()).get(refreshTokenKey)?.value;
  return token;
}
