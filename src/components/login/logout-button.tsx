"use client";

import { clearToken } from "@/app/(unauth)/login/actions";
import { useCartStore } from "@/store/cart";
import { useMutation } from "@tanstack/react-query";
import { MdLogout } from "react-icons/md";

const LogoutButton = () => {
  const { handleLogout } = useCartStore();
  const { mutate } = useMutation({
    mutationFn: async () => {
      // Clear cart code before clearing tokens
      handleLogout();
      await clearToken();
      window.location.replace("/");
    },
    onError: () => {},
  });

  return (
    <div
      className="hover:bg-primary/10 flex cursor-pointer gap-2 p-3"
      onClick={() => mutate()}
    >
      <MdLogout className="h-6 w-6" />
      Đăng xuất
    </div>
  );
};

export default LogoutButton;
