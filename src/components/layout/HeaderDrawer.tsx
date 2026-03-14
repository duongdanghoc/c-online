"use client";

import { getUserInfo } from "@/app/api/user";
import { Category } from "@/app/types/category";
import { hotline } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import LoginDialog from "../login/mobile-login-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const HeaderDrawer = ({
  categories,
  className,
  showOnDesktop = false,
}: {
  categories: Category[];
  className?: string;
  showOnDesktop?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const onCategoryClick = () => {
    setOpen(false);
  };

  const { data } = useQuery({
    queryKey: ["info"],
    queryFn: async () => {
      const data = await getUserInfo();
      return data;
    },
    retry: 0,
  });

  const { data: info, error } = data ?? {};
  const name = info?.fullName
    ? info?.fullName.trim().split(" ").pop()
    : "Khách hàng";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div
          className={classNames(
            "col-span-2 row-start-1 flex",
            showOnDesktop ? "lg:flex" : "lg:hidden",
            className
          )}
          onClick={() => setOpen(true)}
        >
          <div className="flex w-fit items-center gap-2 rounded-full bg-black/20 px-4 py-2 font-semibold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" />
            </svg>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        className="border-none p-0"
        hideCloseButton={true}
        side={"left"}
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          <div className="from-primary/80 to-primary relative flex flex-col gap-2 bg-gradient-to-b p-2">
            <div className="flex items-center gap-2 text-white">
              <Image
                className="col-span-4 h-7 w-fit lg:col-span-3 lg:h-9"
                src={"/white-logo.png"}
                height={64}
                width={64}
                alt="Dược phẩm CPC1 Hà Nội"
              />
              <span className="font-medium">Dược phẩm CPC1 Hà Nội</span>
            </div>

            <div>
              <div className="flex">
                {info && (
                  <Link
                    onClick={() => setOpen(false)}
                    href={"/ca-nhan"}
                    className="flex w-fit flex-row-reverse items-center gap-2 rounded-full bg-black/20 px-4 py-2 font-semibold text-white"
                  >
                    <div className="flex-1">
                      {!!info?.fullName ? name : "Khách hàng"}
                    </div>
                    <MdAccountCircle className="h-6 w-6" />
                  </Link>
                )}

                {error && <LoginDialog />}
              </div>
            </div>

            <Button
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => setOpen(false)}
              variant={"ghost"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            <Accordion type="single" collapsible className="p-2 text-base">
              {categories.map((category) => {
                return (
                  <CategoryItem
                    category={category}
                    key={category.id}
                    onClick={onCategoryClick}
                  />
                );
              })}
            </Accordion>
          </div>
          <div className="border border-t p-3">
            <Link
              href={hotline.path}
              className="bg-primary/20 text-primary-dark flex items-center gap-2 rounded-xl p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" />
              </svg>

              <div className="flex-1">
                Hotline <span className="font-bold">{hotline.text}</span>
              </div>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const CategoryItem = ({
  category,
  onClick,
}: {
  category: Category;
  onClick: () => void;
}) => {
  return (
    <AccordionItem value={category.slug}>
      <AccordionTrigger>
        <Link href={`/danh-muc/${category.slug}`} onClick={onClick}>
          {category.name}
        </Link>
      </AccordionTrigger>
      <AccordionContent className="bg-primary/10 mb-4 rounded-lg pb-0">
        <div className="grid grid-cols-2">
          {category.children?.map((child) => {
            return (
              <Link
                onClick={onClick}
                className="p-3 font-medium"
                key={child.id}
                href={`/danh-muc/${child.slug}`}
              >
                {child.name}
              </Link>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default HeaderDrawer;
