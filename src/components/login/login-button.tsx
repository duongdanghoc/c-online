import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { MdAccountCircle, MdOutlineHistory } from "react-icons/md";
import { Skeleton } from "../ui/skeleton";
import LogoutButton from "./logout-button";
import LoginDialog from "./mobile-login-dialog";

const LoginButton = () => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-10 w-24 rounded-full bg-white/20" />;
  }

  if (error || !user) {
    return <LoginDialog />;
  }

  const name = user?.fullName
    ? user?.fullName.trim().split(" ").pop()
    : "Khách hàng";
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
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={"/ca-nhan"}>
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white">
            <div className="hidden flex-1 xl:block">
              {!!user?.fullName ? name : "Khách hàng"}
            </div>
            <MdAccountCircle className="h-6 w-6" />
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="rounded-xl p-0">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="hover:bg-primary/10 flex gap-2 p-3"
          >
            {item.icon} {item.title}
          </Link>
        ))}
        <LogoutButton />
      </HoverCardContent>
    </HoverCard>
  );
};

export default LoginButton;
