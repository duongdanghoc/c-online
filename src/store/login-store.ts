import { SendOtpResp } from "@/app/api/auth";
import { create } from "zustand";

export enum Step {
  INPUT_PHONE_NUMBER = 1,
  SELECT_OTP_METHOD = 2,
  INPUT_OTP = 3,
}

export enum OtpMethod {
  SMS = "sms",
  ZNS = "zns",
}

interface LoginState {
  step: Step;
  setStep: (step: Step) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  otpMethod: OtpMethod;
  setOtpMethod: (otpMethod: OtpMethod) => void;
  otp: SendOtpResp | null;
  setOtp: (otp: SendOtpResp) => void;
  turnstileToken: string | null;
  setTurnstileToken: (token: string) => void;
  reset: () => void;
  nextRequestTime?: Date;
  setNextRequestTime: (time: Date) => void;
}

export const useLogin = create<LoginState>((set) => ({
  step: Step.INPUT_PHONE_NUMBER,
  setStep: (step) => set({ step }),
  phoneNumber: "",
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  otpMethod: OtpMethod.SMS,
  setOtpMethod: (otpMethod) => set({ otpMethod }),
  otp: null,
  setOtp: (otp) => set({ otp }),
  turnstileToken: null,
  setTurnstileToken: (token) => set({ turnstileToken: token }),
  reset: () =>
    set({
      step: Step.INPUT_PHONE_NUMBER,
      phoneNumber: "",
      otpMethod: OtpMethod.SMS,
      otp: null,
      turnstileToken: null,
    }),
  setNextRequestTime: (time) => set({ nextRequestTime: time }),
}));
