"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdAccountCircle, MdOutlineHistory } from "react-icons/md";
import LogoutButton from "./logout-button";
import classNames from "classnames";

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    {
      title: "Thông tin cá nhân",
      href: "/ca-nhan",
      icon: <MdAccountCircle className="h-6 w-6" />,
    },
    {
      title: "Lịch sử mua hàng",
      href: "/ca-nhan/lich-su-mua-hang",
      icon: <MdOutlineHistory className="h-6 w-6" />,
    },
  ];

  return (
    <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={classNames({
            "flex gap-2 rounded-md p-3 font-medium": true,
            "hover:bg-primary/10": pathname !== item.href,
            "bg-primary/20 text-primary-dark": pathname === item.href,
          })}
        >
          {item.icon} {item.title}
        </Link>
      ))}
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
