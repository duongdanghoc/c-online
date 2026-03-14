"use client";

import { Policy } from "@/app/types/policy";
import { hotline } from "@/lib/const";
import { useMediaQuery } from "@/lib/hooks/use-media.query";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface Props {
  policies: Policy[];
}

const MobileFooter = ({ policies }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)", false);
  if (isDesktop) return null;
  return (
    <div className="flex flex-col lg:hidden">
      <div className="from-primary/80 to-primary bg-gradient-to-b pt-4">
        {/* <div className="container mx-auto grid grid-cols-2 gap-4 gap-y-8 xl:grid-cols-5">
          <div className="flex items-center gap-4">
            <svg
              fill="currentColor"
              viewBox="0 0 15 15"
              className="text-primary-foreground size-8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.5 14.5H9C9 14.6894 9.107 14.8625 9.27639 14.9472C9.44579 15.0319 9.64849 15.0136 9.8 14.9L9.5 14.5ZM11.5 13L11.8 12.6C11.6222 12.4667 11.3778 12.4667 11.2 12.6L11.5 13ZM13.5 14.5L13.2 14.9C13.3515 15.0136 13.5542 15.0319 13.7236 14.9472C13.893 14.8625 14 14.6894 14 14.5H13.5ZM11.5 11C10.1193 11 9 9.88071 9 8.5H8C8 10.433 9.567 12 11.5 12V11ZM14 8.5C14 9.88071 12.8807 11 11.5 11V12C13.433 12 15 10.433 15 8.5H14ZM11.5 6C12.8807 6 14 7.11929 14 8.5H15C15 6.567 13.433 5 11.5 5V6ZM11.5 5C9.567 5 8 6.567 8 8.5H9C9 7.11929 10.1193 6 11.5 6V5ZM9 10.5V14.5H10V10.5H9ZM9.8 14.9L11.8 13.4L11.2 12.6L9.2 14.1L9.8 14.9ZM11.2 13.4L13.2 14.9L13.8 14.1L11.8 12.6L11.2 13.4ZM14 14.5V10.5H13V14.5H14ZM15 5V1.5H14V5H15ZM13.5 0H1.5V1H13.5V0ZM0 1.5V13.5H1V1.5H0ZM1.5 15H8V14H1.5V15ZM0 13.5C0 14.3284 0.671573 15 1.5 15V14C1.22386 14 1 13.7761 1 13.5H0ZM1.5 0C0.671574 0 0 0.671573 0 1.5H1C1 1.22386 1.22386 1 1.5 1V0ZM15 1.5C15 0.671573 14.3284 0 13.5 0V1C13.7761 1 14 1.22386 14 1.5H15ZM3 5H8V4H3V5ZM3 8H6V7H3V8Z" />
            </svg>
            <div className="text-primary-foreground text-sm">
              <span className="font-semibold uppercase">Chính hãng 100%</span>{" "}
              <br />{" "}
              <span className="text-primary-foreground/90 text-xs">
                Sản phẩm chính hãng
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src="/icons/free-delivery.png"
              alt="Free Delivery"
              width={64}
              height={64}
              className="size-8"
            />
            <div className="text-primary-foreground text-sm">
              <span className="font-semibold uppercase">
                MIỄN PHÍ GIAO HÀNG
              </span>{" "}
              <br />{" "}
              <span className="text-primary-foreground/90 text-xs">
                Từ 150.000đ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src="/icons/delivery.png"
              alt="Fast Delivery"
              width={64}
              height={64}
              className="size-8"
            />
            <div className="text-primary-foreground text-sm">
              <span className="font-semibold uppercase">GIAO NHANH 2H</span>{" "}
              <br />{" "}
              <span className="text-primary-foreground/90 text-xs">
                Nội thành Hà Nội
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="text-primary-foreground size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9.75h4.875a2.625 2.625 0 0 1 0 5.25H12M8.25 9.75 10.5 7.5M8.25 9.75 10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"
              />
            </svg>

            <div className="text-primary-foreground text-sm">
              <span className="font-semibold uppercase">ĐỔI TRẢ</span> <br />{" "}
              <span className="text-primary-foreground/90 text-xs">
                Trong vòng 3 ngày
              </span>
            </div>
          </div>
        </div> */}
        <div className="relative mt-8 aspect-[1082/586] w-full">
          <Image
            src={"footer-mobile.png"}
            alt="Footer"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="container mx-auto mt-4 flex flex-col gap-2">
        <Link href={hotline.path}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Gọi mua hàng: </span>
            <span className="font-semibold text-blue-500">
              {hotline.text}{" "}
              <span className="text-sm font-normal text-gray-600">
                {" "}
                (8h-21h30)
              </span>
            </span>
          </div>
        </Link>
        <Link href={hotline.path}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Gọi khiếu nại: </span>
            <span className="font-semibold text-blue-500">
              {hotline.text}{" "}
              <span className="text-sm font-normal text-gray-600">
                {" "}
                (8h-21h30)
              </span>
            </span>
          </div>
        </Link>
      </div>

      <Accordion type="multiple" className="w-full px-3">
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <h2 className="text-sm font-medium text-gray-700 uppercase">
              Về chúng tôi
            </h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col">
            {policies?.map((url) => (
              <Link
                key={url.slug}
                href={`/ve-chung-toi/${url.slug}.html`}
                className="py-2 text-sm text-gray-800"
              >
                {url.title}
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MobileFooter;
