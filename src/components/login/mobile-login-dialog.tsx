"use client";

import { useLogin } from "@/store/login-store";
import React from "react";
import { MdAccountCircle, MdOutlineClose } from "react-icons/md";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import LoginView from "./login-view";

const LoginDialog = () => {
  const { reset } = useLogin();
  const [open, setOpen] = React.useState(false);

  const onLoginSuccess = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <div
          className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <div className="flex-1">Đăng nhập</div>
          <MdAccountCircle className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent
        className="w-[95%] max-w-[425px] rounded-xl"
        hideCloseButton={true}
      >
        <LoginView onLoginSuccess={onLoginSuccess} />

        <div className="absolute top-2 right-2">
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
