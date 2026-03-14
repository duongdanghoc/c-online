import { hotline, zaloUrl } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ContactBubble = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="fixed right-4 bottom-4 flex h-12 w-12 cursor-pointer items-center rounded-full bg-white p-0.5 text-white shadow lg:right-12 lg:bottom-12 lg:h-16 lg:w-16 lg:p-1">
          <Image
            width={120}
            height={120}
            className="h-full w-full"
            src={"/icons/iconchat.png"}
            alt="Facebook Nhà thuốc Upharma"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="me-4 flex w-fit flex-col gap-4 rounded-xl text-slate-700">
        <div className="font-semibold">Tư vấn hỗ trợ</div>
        <Link
          target="_blank"
          href={hotline.path}
          className="flex items-center gap-2 font-medium lg:gap-4"
        >
          <Image
            width={64}
            height={64}
            src={"/icons/phone.png"}
            alt="Facebook Nhà thuốc Upharma"
            className="h-8 w-8"
          />
          <div>{hotline.text}</div>
        </Link>
        <Link
          target="_blank"
          href={zaloUrl}
          className="flex items-center gap-2 font-medium lg:gap-4"
        >
          <Image
            width={64}
            height={64}
            src={"/icons/zalo.png"}
            alt="Facebook Nhà thuốc Upharma"
            className="h-8 w-8"
          />
          <div>Chat Zalo</div>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ContactBubble;
