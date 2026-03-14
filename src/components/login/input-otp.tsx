import {
  saveRefreshToken,
  saveTokenWithoutRedirect,
} from "@/app/(unauth)/login/actions";
import { verifyOtpForLogin, VerifyOtpResp } from "@/app/api/auth";
import { BaseError } from "@/app/types/base-error";
import { useOtpMutation } from "@/lib/hooks/otp-mutation";
import { errorClassnames } from "@/lib/toaster";
import { durationToTime } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { OtpMethod, Step, useLogin } from "@/store/login-store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { InputOTP, InputOTPSlot } from "../ui/input-otp";

interface InputOtpViewProps {
  onLoginSuccess?: () => void;
}

const InputOtpView = ({ onLoginSuccess }: InputOtpViewProps) => {
  const {
    otpMethod,
    setOtp: setOtpResp,
    phoneNumber,
    setStep,
    turnstileToken,
    nextRequestTime,
    setNextRequestTime,
  } = useLogin();
  const { refreshAfterLogin, cartId } = useCartStore();
  const otpMethodText = otpMethod === OtpMethod.SMS ? "Tin nhắn" : "Zalo";

  const [otp, setOtp] = React.useState("");
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async ({
      phoneNumber,
      otp,
      token,
      cartCode,
    }: {
      phoneNumber: string;
      otp: string;
      token: string;
      cartCode?: string;
    }) => {
      return await verifyOtpForLogin(phoneNumber, otp, token, cartCode);
    },
    onError: (error: BaseError) => {
      toast.error(error.message, {
        classNames: errorClassnames,
      });
    },
    onSuccess: async (data: VerifyOtpResp) => {
      saveTokenWithoutRedirect(data.accessToken);
      saveRefreshToken(data.refreshToken);
      await refreshAfterLogin();
      onLoginSuccess?.();
    },
  });

  const onVerifyOtp = () => {
    if (otp.length !== 6) {
      return;
    }

    mutate({
      phoneNumber,
      otp,
      token: turnstileToken || "",
      cartCode: cartId,
    });
  };

  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (!nextRequestTime) {
      return;
    }

    const diff = nextRequestTime.getTime() - new Date().getTime();
    setCountdown(diff > 0 ? diff : 0);

    const interval = setInterval(() => {
      const diff = nextRequestTime.getTime() - new Date().getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown(0);
      } else {
        setCountdown(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRequestTime]);

  const { mutate: resendOtp, isPending: resendingOtp } = useOtpMutation({
    onSuccess: (data) => {
      setNextRequestTime(new Date(data.nextRequestTime));
      setOtpResp(data);
      setStep(Step.INPUT_OTP);
    },
  });

  return (
    <div
      className="flex flex-col gap-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onVerifyOtp();
        }
      }}
    >
      <div>
        <DialogTitle className="text-xl">Nhập OTP</DialogTitle>
        <div className="">
          Mã xác thực OTP đã được gửi qua <br /> {otpMethodText}{" "}
          <span>{phoneNumber}</span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <InputOTP
          maxLength={6}
          className="flex"
          onChange={(otp) => setOtp(otp)}
          autoFocus
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg border">
              <InputOTPSlot
                autoFocus
                index={0}
                className="rounded-md border-none p-4 text-lg font-semibold"
              />
            </div>
            <div className="rounded-lg border">
              <InputOTPSlot
                index={1}
                className="rounded-md border-none p-4 text-lg font-semibold"
              />
            </div>
            <div className="rounded-lg border">
              <InputOTPSlot
                index={2}
                className="rounded-md border-none p-4 text-lg font-semibold"
              />
            </div>
            <div className="rounded-lg border">
              <InputOTPSlot
                index={3}
                className="rounded-md border-none p-4 text-lg font-semibold"
              />
            </div>
            <div className="rounded-lg border">
              <InputOTPSlot
                index={4}
                className="rounded-md border-none p-4 text-lg font-semibold"
              />
            </div>
            <div className="rounded-lg border">
              <InputOTPSlot
                index={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onVerifyOtp();
                  }
                }}
                className="rounded-md border-none p-4 text-lg font-semibold"
              />
            </div>
          </div>
        </InputOTP>
      </div>

      <div className="text-sm font-medium text-slate-600">
        {countdown > 0
          ? `Gửi lại mã OTP sau ${durationToTime(countdown)}`
          : "Không nhận được mã OTP?"}
        {countdown <= 0 && !!nextRequestTime && (
          <Button
            variant={"link"}
            onClick={() =>
              resendOtp({
                phoneNumber,
                method: otpMethod,
                token: turnstileToken || "",
              })
            }
            disabled={resendingOtp}
          >
            Gửi lại OTP{" "}
            {resendingOtp && <Loader2 className="h-6 w-6 animate-spin" />}
          </Button>
        )}
      </div>

      <Button
        className="rounded-xl p-6"
        onClick={onVerifyOtp}
        disabled={isLoading || otp.length !== 6}
      >
        Xác thực
        {isLoading && otpMethod === OtpMethod.SMS && (
          <Loader2 className="ml-2 h-6 w-6 animate-spin" />
        )}
      </Button>

      <Button
        className="rounded-xl p-6"
        variant={"outline"}
        disabled={isLoading}
        onClick={() => setStep(Step.SELECT_OTP_METHOD)}
      >
        Quay lại
      </Button>
    </div>
  );
};

export default InputOtpView;
