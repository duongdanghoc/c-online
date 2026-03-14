"use client";

import { useCartStore } from "@/store/cart";
import classNames from "classnames";
import { useRouter } from "next/navigation";

const BottomCart = () => {
  const router = useRouter();
  const { cartInfo } = useCartStore();
  const itemsCount = cartInfo?.items?.length || 0;

  return (
    <div className="fixed right-4 bottom-4 hidden h-12 w-12 cursor-pointer items-center rounded-full bg-white p-0.5 text-white shadow lg:right-12 lg:bottom-30 lg:flex lg:h-16 lg:w-16 lg:p-1">
      <div
        className={classNames(
          "flex h-full w-full items-center justify-center rounded-full"
        )}
        onClick={() => {
          router.push("/gio-hang");
        }}
      >
        <div className="relative h-fit w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-primary h-8 w-8"
          >
            <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
          </svg>
          {itemsCount > 0 && (
            <div className="absolute -top-1 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 py-0.5 text-[10px]">
              {itemsCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomCart;
