"use client";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdOutlineClose } from "react-icons/md";
import LoginView from "@/components/login/login-view";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLogin } from "@/store/login-store";

const UnAuthentication = () => {
  const [open, setOpen] = React.useState(false);
  const { reset } = useLogin();

  const onLoginSuccess = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <div className="container mx-auto mt-8 flex flex-col items-center justify-center">
      <Image src="/_images/401.png" alt="401" width={256} height={256} />
      <h1>Đăng nhập để tiếp tục</h1>
      <div className="text-center">
        Bạn cần đăng nhập để sử dụng tính năng này. Vui lòng đăng nhập để tiếp
        tục trải nghiệm.
      </div>

      <Dialog open={open}>
        <DialogTrigger asChild>
          <div
            className="mt-8 flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 font-semibold text-white"
            onClick={() => {
              setOpen(true);
              reset();
            }}
          >
            <div className="">Đăng nhập ngay</div>
          </div>
        </DialogTrigger>
        <DialogContent
          className="w-[95%] rounded-xl sm:max-w-[425px]"
          hideCloseButton={true}
        >
          <LoginView onLoginSuccess={onLoginSuccess} />

          <div className="absolute right-2 top-2">
            <Button
              type="button"
              variant="ghost"
              className="z-50 h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <MdOutlineClose
                className="h-6 w-6"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnAuthentication;
