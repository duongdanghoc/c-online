import { OtpMethod } from "@/store/login-store";
import api from "./api";

export interface SendOtpResp {
  phoneNumber: string;
  nextRequestTime: string;
  expiresTime: string;
  otp: string;
}

export interface VerifyOtpResp {
  accessToken: string;
  refreshToken: string;
}

export async function sendOtpForLogin(
  phoneNumber: string,
  method: OtpMethod,
  token: string
): Promise<SendOtpResp> {
  const response = (await api.post("web-auth/login/otp", {
    phoneNumber: phoneNumber.trim(),
    method,
    token,
  })) as SendOtpResp;
  return response;
}

export async function verifyOtpForLogin(
  phoneNumber: string,
  otp: string,
  token: string,
  cartCode?: string
): Promise<VerifyOtpResp> {
  const response = (await api.post("web-auth/login/verify-otp", {
    phoneNumber: phoneNumber.trim(),
    otp,
    token,
    cartCode,
  })) as any;

  return response;
}
