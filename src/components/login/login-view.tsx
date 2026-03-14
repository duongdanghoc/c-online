"use client";

import React, { useEffect } from "react";
import { Step, useLogin } from "@/store/login-store";
import InputPhoneNumber from "./input-phone-number";
import SelectOtpMethod from "./select-otp-method";
import InputOtpView from "./input-otp";
import Turnstile, { useTurnstile } from "react-turnstile";

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

const LoginView = ({ onLoginSuccess }: LoginViewProps) => {
  const { step, setTurnstileToken } = useLogin();
  const turnstile = useTurnstile();

  useEffect(() => {
    const interval = setInterval(() => {
      turnstile.reset();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {step === Step.INPUT_PHONE_NUMBER && <InputPhoneNumber />}
      {step === Step.SELECT_OTP_METHOD && <SelectOtpMethod />}
      {step === Step.INPUT_OTP && (
        <InputOtpView onLoginSuccess={onLoginSuccess} />
      )}
      <div>
        <Turnstile
          sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
          onVerify={(token) => {
            setTurnstileToken(token);
          }}
        />
      </div>
    </div>
  );
};

export default LoginView;
