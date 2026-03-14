"use client";

import { Mail, Smartphone, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterForm() {
  return (
    <div className="flex max-h-[500px] w-full max-w-[420px] flex-col rounded-[32px] border border-white bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all md:p-8">
      {/* Header */}
      <div className="mb-5 flex shrink-0 items-center justify-center">
        <h2 className="text-primary-color text-center text-xl font-bold md:text-2xl">
          Đăng ký tài khoản
        </h2>
      </div>

      {/* Form Content Wrapper */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <form className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
          {/* Email */}
          <div className="relative flex shrink-0 items-center">
            <Mail
              className="absolute left-4 h-5 w-5 text-[#1e1b4b]"
              strokeWidth={1.5}
            />
            <Input
              type="email"
              placeholder="Nhập email"
              className="focus-visible:ring-primary-color h-[52px] rounded-xl border-[#e2e8f0] bg-white pl-12 text-sm shadow-none placeholder:text-[#94a3b8] focus-visible:ring-1"
            />
          </div>

          {/* Referrer */}
          <div className="relative flex shrink-0 items-center">
            <Users
              className="absolute left-4 h-5 w-5 text-[#1e1b4b]"
              strokeWidth={1.5}
            />
            <Input
              placeholder="Nhập SĐT người giới thiệu hoặc mã"
              className="focus-visible:ring-primary-color h-[52px] rounded-xl border-[#e2e8f0] bg-white pl-12 text-sm shadow-none placeholder:text-[#94a3b8] focus-visible:ring-1"
            />
          </div>

          {/* How did you know about us? */}
          <div className="shrink-0">
            <Select>
              <SelectTrigger className="focus:ring-primary-color h-[52px] w-full rounded-xl border-[#e2e8f0] bg-white px-5 text-sm text-[#94a3b8] shadow-none focus:ring-1">
                <SelectValue placeholder="Bạn biết đến C-Online qua *" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#e2e8f0] shadow-md">
                <SelectItem value="facebook" className="py-2 text-sm">
                  Facebook
                </SelectItem>
                <SelectItem value="google" className="py-2 text-sm">
                  Google
                </SelectItem>
                <SelectItem value="tiktok" className="py-2 text-sm">
                  TikTok
                </SelectItem>
                <SelectItem value="friend" className="py-2 text-sm">
                  Người quen giới thiệu
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional fields that will be scrollable */}
          <div className="mt-1 flex flex-col gap-4 border-t border-slate-50 pt-4">
            <div className="relative flex shrink-0 items-center">
              <Smartphone
                className="absolute left-4 h-5 w-5 text-[#1e1b4b]"
                strokeWidth={1.5}
              />
              <Input
                type="tel"
                placeholder="Nhập số điện thoại *"
                className="focus-visible:ring-primary-color h-[52px] rounded-xl border-[#e2e8f0] bg-white pl-12 text-sm shadow-none placeholder:text-[#94a3b8] focus-visible:ring-1"
              />
            </div>
            <Input
              placeholder="Tên hộ kinh doanh/doanh nghiệp *"
              className="focus-visible:ring-primary-color h-[52px] rounded-xl border-[#e2e8f0] bg-white px-5 text-sm shadow-none placeholder:text-[#94a3b8] focus-visible:ring-1"
            />
            <Input
              placeholder="Địa chỉ cụ thể *"
              className="focus-visible:ring-primary-color h-[52px] rounded-xl border-[#e2e8f0] bg-white px-5 text-sm shadow-none placeholder:text-[#94a3b8] focus-visible:ring-1"
            />
          </div>
          {/* Checkbox Agreement */}
          <div className="mt-1 flex shrink-0 items-start gap-3">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                id="terms"
                className="text-primary-color focus:ring-primary-color h-4 w-4 cursor-pointer rounded border-gray-300"
              />
            </div>
            <label
              htmlFor="terms"
              className="cursor-pointer text-[12px] leading-snug text-slate-600"
            >
              Tôi đồng ý với{" "}
              <Link
                href="/terms"
                className="text-primary-color font-bold underline"
              >
                Điều khoản sử dụng
              </Link>
              , và xác nhận tôi đã có đủ giấy phép cần thiết cũng như đáp ứng
              các điều kiện theo quy định của pháp luật để mua sản phẩm trên
              thuocsi.vn khi đăng ký tài khoản.
            </label>
          </div>
        </form>
      </div>

      {/* Action Button */}
      <div className="mt-6 shrink-0">
        <Button className="h-[54px] w-full rounded-xl bg-[#dddddd] text-base font-bold tracking-wide text-[#8e8e8e] uppercase shadow-none transition-colors hover:bg-slate-300">
          Gửi mã xác thực
        </Button>

        {/* Footer Text */}
        <p className="mt-5 text-center text-sm text-slate-800">
          Bạn đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary-color font-bold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1; 
        }
      `,
        }}
      />
    </div>
  );
}
