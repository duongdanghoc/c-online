import { sendOtpForLogin, SendOtpResp } from "@/app/api/auth";
import { BaseError } from "@/app/types/base-error";
import { errorClassnames, toastSuccessOption } from "@/lib/toaster";
import { OtpMethod } from "@/store/login-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseOtpMutationProps {
  onSuccess?: (data: SendOtpResp) => void;
  onError?: (error: BaseError) => void;
}

export const useOtpMutation = ({ onSuccess, onError }: UseOtpMutationProps) => {
  return useMutation({
    mutationFn: async ({
      phoneNumber,
      method,
      token,
    }: {
      phoneNumber: string;
      method: OtpMethod;
      token: string;
    }) => {
      return await sendOtpForLogin(phoneNumber, method, token);
    },
    onError: (error: BaseError) => {
      toast.error(error.message, {
        classNames: errorClassnames,
      });
      onError?.(error);
    },
    onSuccess: (data: SendOtpResp) => {
      toast.success(
        `Đã gửi mã OTP đến số ${data.phoneNumber}`,
        toastSuccessOption
      );
      onSuccess?.(data);
    },
  });
};
