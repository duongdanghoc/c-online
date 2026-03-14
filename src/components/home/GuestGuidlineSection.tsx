"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Điền thông tin doanh nghiệp",
    description: (
      <div className="flex flex-col gap-2">
        <p className="font-bold">
          Điền đầy đủ thông tin doanh nghiệp và cung cấp các loại hồ sơ sau:
        </p>
        <p>Giấy chứng nhận:</p>
        <ul className="list-decimal space-y-0.5 pl-5">
          <li>Thực hành tốt phân phối thuốc (GDP).</li>
          <li>Thực hành tốt cơ sở bán lẻ thuốc (GPP).</li>
          <li>Thực hành tốt bảo quản thuốc (GSP).</li>
          <li>Đủ điều kiện kinh doanh dược.</li>
          <li>Đăng ký doanh nghiệp</li>
        </ul>
      </div>
    ),
    image: "/1_New.png",
  },
  {
    id: 2,
    title: "Kích hoạt tài khoản",
    description: (
      <p>
        Sau khi đăng ký tài khoản, nhân viên thuocsi.vn (Cpc1) sẽ liên hệ trong
        vòng 24 giờ để xác nhận thông tin đã cung cấp và kích hoạt tài khoản.
      </p>
    ),
    image: "/2_New.png",
  },
  {
    id: 3,
    title: "Tra cứu sản phẩm",
    description: (
      <p>
        Đăng nhập và bắt đầu tra cứu sản phẩm, tìm kiếm theo tên thuốc, hoạt
        chất, nhà bán hàng. Khám phá khuyến mãi độc quyền, mã giảm giá hàng
        tuần, tổng hợp sản phẩm bán chạy, chương trình ưu đãi từ các hãng dược
        yêu thích.
      </p>
    ),
    image: "/3_New.png",
  },
  {
    id: 4,
    title: "Nhận ưu đãi đơn đầu",
    description: (
      <p>
        Đặt hàng ngay và nhận ưu đãi chiết khấu 10% cho đơn hàng đầu tiên, giao
        hàng miễn phí trên toàn quốc.
      </p>
    ),
    image: "/4_New.png",
  },
];

export function GuestGuidlineSection() {
  const [activeTab, setActiveTab] = useState("guideline");
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="w-full bg-[#f8fafc] py-16">
      <div className="container mx-auto max-w-[1280px] px-4 lg:px-8">
        {/* Header Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-4 md:justify-start">
          <button
            onClick={() => setActiveTab("guideline")}
            className={`rounded-full border-2 px-8 py-3 font-bold transition-all ${
              activeTab === "guideline"
                ? "border-primary-color text-primary-color bg-muted shadow-sm"
                : "border-transparent bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cpc1 hướng dẫn bạn 4 Bước trở thành khách hàng thuocsi.vn
          </button>
          <button
            onClick={() => setActiveTab("order")}
            className={`rounded-full border-2 px-8 py-3 font-bold transition-all ${
              activeTab === "order"
                ? "border-primary-color text-primary-color bg-muted shadow-sm"
                : "border-transparent bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            4 Bước xử lý đơn hàng
          </button>
        </div>

        {/* Content Card */}
        <div className="relative flex min-h-[600px] flex-col gap-12 overflow-hidden rounded-[40px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:p-12 lg:flex-row">
          {/* Left: Progress Sidebar */}
          <div className="relative flex shrink-0 flex-col justify-between py-6 lg:w-[320px]">
            {/* Vertical Line */}
            <div className="absolute top-12 bottom-12 left-[24px] -z-0 w-[1px] bg-slate-100"></div>

            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className="group relative z-10 flex items-center gap-6 py-4"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 ${
                    activeStep === index
                      ? "bg-primary-color border-primary-color scale-110 text-white shadow-lg"
                      : "border-transparent bg-[#f1f5f9] text-slate-400 group-hover:bg-slate-200"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-left text-lg transition-all duration-300 ${
                    activeStep === index
                      ? "text-primary-color translate-x-1 font-bold"
                      : "font-medium text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Image Display with Overlay */}
          <div className="group/display relative min-h-[450px] flex-1 overflow-hidden rounded-[32px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Image Gradient Overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Description Card Overlay */}
                <div className="absolute right-8 bottom-8 left-8 transform rounded-[28px] border border-white/50 bg-white/95 p-8 shadow-2xl backdrop-blur-xl transition-transform duration-500 lg:right-auto lg:max-w-[500px]">
                  <div className="mb-8 text-sm leading-relaxed font-medium text-[#1e1b4b] md:text-base">
                    {steps[activeStep].description}
                  </div>
                  <Button className="bg-primary-color w-full rounded-2xl px-10 py-7 text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] hover:bg-[#086332] active:scale-95 md:w-auto">
                    Đăng ký ngay
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-[#0a7a3e] shadow-xl transition-all group-hover/display:opacity-100 hover:scale-110 active:scale-90 md:opacity-0"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-[#0a7a3e] shadow-xl transition-all group-hover/display:opacity-100 hover:scale-110 active:scale-90 md:opacity-0"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
