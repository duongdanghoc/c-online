"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const infoTabs = [
  {
    id: 0,
    label: "Mạng Lưới",
    content: (
      <div className="flex flex-col gap-6">
        <p>
          Công ty TNHH Buymed được thành lập vào năm 2017, là một start-up hướng
          đến mục tiêu cách mạng hóa ngành chăm sóc sức khỏe trên toàn Châu Á.
        </p>
        <p>
          Buymed bắt đầu sứ mệnh của mình từ một văn phòng nhỏ tại Singapore và
          chỉ sau một thời gian ngắn, chúng tôi đã mở rộng thành một tổ chức đa
          quốc gia trong khu vực Đông Nam Á với quy mô hơn 500 nhân viên.
        </p>
        <p>
          Chúng tôi phát triển mạng lưới phân phối dược phẩm, sản phẩm chăm sóc
          sức khỏe và trang thiết bị vật tư y tế với nguồn cung 100% đến từ các
          nhà sản xuất uy tín trên toàn bộ Việt Nam và Đông Nam Á.
        </p>
      </div>
    ),
    image: "/GT1_NEW.png",
  },
  {
    id: 1,
    label: "Tầm Nhìn",
    content: (
      <div className="flex flex-col gap-6">
        <p>
          <span className="text-primary-color font-bold">
            Tầm nhìn của chúng tôi:
          </span>{" "}
          Trở thành nền tảng công nghệ y tế lớn nhất Đông Nam Á, tiên phong
          trong ứng dụng và phát triển công nghệ vào hệ thống y tế vì sức khỏe
          cộng đồng.
        </p>
        <p>
          Việc tiếp cận toàn cầu với dịch vụ chăm sóc sức khỏe chất lượng cao và
          chi phí hiệu quả là bước đệm đầu tiên hướng tới một tương lai phát
          triển hệ thống Y Tế tốt đẹp và bền vững.
        </p>
        <p>
          Chúng tôi tin vào tiềm năng của chuyển đổi kỹ thuật số đối với xã hội,
          điều này có thể được thực hiện hóa bằng cách kết hợp công nghệ vào
          chăm sóc sức khỏe.
        </p>
      </div>
    ),
    image: "/GT2_NEW.png",
  },
  {
    id: 2,
    label: "Sứ Mệnh",
    content: (
      <div className="flex flex-col gap-6">
        <p>
          <span className="text-primary-color font-bold">
            Sứ mệnh của chúng tôi:
          </span>{" "}
          Ứng dụng mô hình hiện đại nhất để giải quyết vấn đề y tế một cách
          nhanh chóng và chất lượng.
        </p>
        <p>
          <span className="font-bold">Đối với Quý khách hàng:</span> Sử dụng
          công nghệ cung cấp các giải pháp đặt hàng dược phẩm và được giải quyết
          vấn đề nhanh chóng, chất lượng với các cam kết về nguồn gốc sản phẩm
          và hiệu quả chi phí.
        </p>
        <p>
          <span className="font-bold">Đối với các đối tác:</span> Cung cấp giải
          pháp nâng cao nhận diện thương hiệu và cơ hội mở rộng thị trường, giảm
          thiểu chi phí kho bãi, vận chuyển.
        </p>
      </div>
    ),
    image: "/GT3_NEW.png",
  },
];

export function GuestInfoSection() {
  const [activeTab, setActiveTab] = useState(0);

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % infoTabs.length);
  };

  const handlePrev = () => {
    setActiveTab((prev) => (prev - 1 + infoTabs.length) % infoTabs.length);
  };

  return (
    <section className="w-full bg-[#f1f7f5] py-12 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="mb-8 pl-0 md:pl-4">
          <h2 className="text-2xl font-bold text-[#1e1e1e] md:text-3xl">
            Giới thiệu về công ty
          </h2>
          <div className="bg-primary-color mt-3 h-1 w-24"></div>
        </div>

        <div className="relative overflow-visible">
          {/* Card Container */}
          <div className="relative rounded-[32px] bg-white p-6 shadow-sm md:p-10">
            {/* Tabs switcher */}
            <div className="mb-10 flex w-full max-w-[550px] overflow-hidden rounded-full border border-slate-100 bg-white p-1 shadow-sm">
              {infoTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer px-4 py-3 text-sm font-semibold transition-all md:text-base ${
                    activeTab === tab.id
                      ? "text-primary-color border-primary-color rounded-full border bg-[#e6f4f1]"
                      : "hover:text-primary-color text-[#888888]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              {/* Left Side: Text */}
              <div className="flex min-h-[300px] flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-base leading-relaxed text-slate-700 md:text-lg"
                  >
                    {infoTabs[activeTab].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side: Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={infoTabs[activeTab].image}
                      alt={infoTabs[activeTab].label}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Floating on the sides */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-5 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-lg transition-all hover:bg-black/60 md:h-12 md:w-12 lg:-left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="text-primary-color absolute top-1/2 -right-5 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-lg transition-all hover:bg-slate-50 md:h-12 md:w-12 lg:-right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
