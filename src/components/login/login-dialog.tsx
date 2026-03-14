"use client";

import React from "react";
import LoginView from "./login-view";
import { MdAccountCircle, MdOutlineClose } from "react-icons/md";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useLogin } from "@/store/login-store";

const LoginDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { reset } = useLogin();

  const onLoginSuccess = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <div
          className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-black/20 px-4 py-2 font-semibold text-white"
          onClick={() => {
            setOpen(true);
            reset();
          }}
        >
          <div className="hidden flex-1 xl:block">Đăng nhập</div>
          <MdAccountCircle className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton={true}>
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
  );
};

export default LoginDialog;
