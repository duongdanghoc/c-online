"use client";

import { Category } from "@/app/types/category";
import { SearchInput } from "@/components/layout/SearchInput";
import { hotline } from "@/lib/const";
import { useMediaQuery } from "@/lib/hooks/use-media.query";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoginButton from "../login/login-button";
import DesktopCartButton from "./DesktopCartButton";
import DesktopMenu from "./DesktopMenu";
import HeaderDrawer from "./HeaderDrawer";
import MobileCartButton from "./MobileCartButton";

const COMPACT_SCROLL_OFFSET = 120;

interface HeaderContentProps {
  categories: Category[];
}

const HeaderContent = ({ categories }: HeaderContentProps) => {
  const [isCompact, setIsCompact] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const handleScroll = () => {
      const shouldCompact = window.scrollY > COMPACT_SCROLL_OFFSET;

      setIsCompact((current) =>
        current === shouldCompact ? current : shouldCompact
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={classNames({
        "sticky top-0 z-50 bg-white": !isDesktop,
      })}
    >
      {isCompact && !isDesktop ? (
        <CompactHeader categories={categories} />
      ) : (
        <>
          <DefaultHeader categories={categories} />
          {categories.length > 0 ? (
            <DesktopMenu categories={categories} />
          ) : null}
        </>
      )}
    </div>
  );
};

const DefaultHeader = ({ categories }: HeaderContentProps) => {
  return (
    <header className="from-primary/80 to-primary h-full bg-gradient-to-b">
      <div className="container mx-auto">
        <Link
          href={hotline.path}
          className="text-primary-foreground flex items-center justify-end gap-2 pt-2 text-xs"
        >
          Hotline (8h - 21h30)
          <br />
          <span className="text-base font-medium text-yellow-400">
            {hotline.text}
          </span>
        </Link>
        <div className="grid grid-cols-12 gap-4 py-2 lg:py-4 lg:pt-4">
          <HeaderDrawer categories={categories} />
          <Link
            href={"/"}
            className="col-span-8 row-start-1 flex items-center justify-center gap-4 lg:col-span-3 lg:justify-start"
          >
            <Image
              src="white-logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="h-6 w-6 lg:h-12 lg:w-12"
            />
            <div className="text-primary-foreground font-bold lg:text-lg">
              Dược phẩm
              <br /> CPC1 Hà Nội
            </div>
          </Link>
          <MobileCartButton />
          <div className="col-span-12 row-start-2 lg:col-span-6 lg:row-start-1">
            <SearchInput />
          </div>
          <div className="col-span-3 hidden items-center justify-end gap-4 text-sm lg:flex">
            <LoginButton />
            <DesktopCartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

const CompactHeader = ({ categories }: HeaderContentProps) => {
  return (
    <div className="from-primary/80 to-primary h-full bg-gradient-to-b shadow-sm">
      <div className="container mx-auto flex items-center gap-1 py-3">
        <HeaderDrawer
          categories={categories}
          showOnDesktop
          className="flex-none items-center"
        />
        <div className="flex-1">
          <SearchInput />
        </div>
        <MobileCartButton />
      </div>
    </div>
  );
};

export default HeaderContent;
