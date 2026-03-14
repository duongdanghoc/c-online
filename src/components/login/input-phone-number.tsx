import { phoneRegex } from "@/lib/const";
import { Step, useLogin } from "@/store/login-store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const InputPhoneNumber = () => {
  const { setStep, phoneNumber, setPhoneNumber } = useLogin();
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    if (phoneRegex.test(phoneNumber)) {
      setStep(Step.SELECT_OTP_METHOD);
      return;
    }

    setError("Số điện thoại không hợp lệ");
  };

  return (
    <>
      <div>
        <DialogTitle className="from-primary to-primary/60 bg-gradient-to-b bg-clip-text text-xl text-transparent lg:text-2xl">
          Đặc quyền thành viên CPC1HN
        </DialogTitle>
        <p className="text-sm text-gray-700">
          Tham gia CPC1HN để nhận nhiều ưu đãi hấp dẫn
        </p>
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-2 rounded-md border border-gray-200 p-2 text-sm shadow-sm lg:flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 lg:size-4"
            >
              <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
              <path
                fill-rule="evenodd"
                d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                clip-rule="evenodd"
              />
            </svg>

            <div className="flex-1 text-center font-medium lg:text-left">
              Voucher ưu đãi
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-md border border-gray-200 p-2 text-sm shadow-sm lg:flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 lg:size-4"
            >
              <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z" />
            </svg>
            <div className="flex-1 text-center font-medium lg:text-left">
              {" "}
              Quà tặng độc quyền
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-md border border-gray-200 p-2 text-sm shadow-sm lg:flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 lg:size-4"
            >
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 text-center font-medium lg:text-left">
              Hoàn tiền
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
              clip-rule="evenodd"
            />
          </svg>

          <div>Miễn phí vận chuyển</div>
          <div className="w-5"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
              clip-rule="evenodd"
            />
          </svg>

          <div>Ưu tiên hỗ trợ</div>
        </div>

        <div className="flex flex-col justify-start gap-2 xl:mt-4">
          <Label
            htmlFor="username"
            className="flex items-center gap-2 text-left font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                clipRule="evenodd"
              />
            </svg>
            Đăng nhập bằng Số điện thoại
          </Label>
          <Input
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onButtonClick();
              }
            }}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setError(null);
            }}
            placeholder="Nhập số điện thoại"
            id="username"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="rounded-xl px-4 py-6 text-xl font-semibold"
          />
          <div className="text-sm text-red-700">{error}</div>
        </div>

        <Button className="mt-4 w-full rounded-xl p-6" onClick={onButtonClick}>
          Tiếp tục
        </Button>
      </div>
    </>
  );
};

export default InputPhoneNumber;
