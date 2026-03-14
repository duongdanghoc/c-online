import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground text-lg">
        Không tìm thấy trang yêu cầu
      </p>
      <Link href="/">
        <Button variant="default">Trở về trang chủ</Button>
      </Link>
    </div>
  );
}
