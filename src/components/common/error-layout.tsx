import UnAuthentication from "@/app/(auth)/account/unauthentication";
import { getErrorFromException, notFoundError } from "@/app/types/base-error";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ErrorLayoutProps {
  error?: any;
  children?: React.ReactNode;
}

const ErrorLayout = ({ error, children }: ErrorLayoutProps) => {
  const baseError = error ? getErrorFromException(error) : notFoundError;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      {baseError.isUnauthorized && <UnAuthentication />}

      {baseError.isNotFound && <NotFound />}

      {!baseError.isNotFound && !baseError.isUnauthorized && (
        <div className="flex flex-col items-center gap-4 p-8">
          <Image src="/_images/500.png" alt="500" width={300} height={300} />
          <h1 className="text-primary-dark">Có lỗi xảy ra!</h1>
          <div>{baseError.message}</div>
        </div>
      )}

      {children}
    </div>
  );
};

function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Image src="/_images/404.png" alt="404" width={300} height={300} />
      <h1 className="text-primary-dark">
        Đường dẫn không tồn tại hoặc thông tin không hợp lệ
      </h1>

      <Link
        href="/"
        replace
        className="bg-primary rounded-full px-4 py-2 font-semibold text-white"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}

export default ErrorLayout;
