import { useOtpMutation } from "@/lib/hooks/otp-mutation";
import { OtpMethod, Step, useLogin } from "@/store/login-store";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { DialogTitle } from "../ui/dialog";

const SelectOtpMethod = () => {
  const {
    phoneNumber,
    setOtpMethod,
    otpMethod,
    setOtp,
    setStep,
    turnstileToken,
    setNextRequestTime,
  } = useLogin();

  const { mutate, isPending: isLoading } = useOtpMutation({
    onSuccess: (data) => {
      setNextRequestTime(new Date(data.nextRequestTime));
      setOtp(data);
      setStep(Step.INPUT_OTP);
    },
  });

  const onSelectOtpMethod = (method: OtpMethod) => {
    setOtpMethod(method);

    mutate({
      phoneNumber,
      method,
      token: turnstileToken || "",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <DialogTitle className="text-xl">Chọn phương thức xác thực</DialogTitle>
        <div className="text-sm text-gray-500">
          Xác thực OTP để đăng nhập tài khoản{" "}
          <span className="text-lg font-bold">{phoneNumber}</span>
        </div>
      </div>

      <Button
        className="rounded-xl p-6"
        onClick={() => onSelectOtpMethod(OtpMethod.SMS)}
        disabled={isLoading}
      >
        Nhận OTP qua SMS
        {isLoading && otpMethod === OtpMethod.SMS && (
          <Loader2 className="ml-2 h-6 w-6 animate-spin" />
        )}
      </Button>

      {/* <Button
        disabled={isLoading}
        className="rounded-xl bg-blue-700 p-6 text-white hover:bg-blue-800"
        onClick={() => onSelectOtpMethod(OtpMethod.ZNS)}
      >
        Nhận OTP qua Zalo
        {isLoading && otpMethod === OtpMethod.ZNS && (
          <Loader2 className="ml-2 h-6 w-6 animate-spin" />
        )}
      </Button> */}

      <Button
        className="rounded-xl p-6"
        variant={"outline"}
        disabled={isLoading}
        onClick={() => setStep(Step.INPUT_PHONE_NUMBER)}
      >
        Quay lại
      </Button>
    </div>
  );
};

export default SelectOtpMethod;
