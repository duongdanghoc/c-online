import { Policy } from "@/app/types/policy";
import { facebookUrl, hotline, youtubeUrl, zaloUrl } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";

interface Props {
  policies: Policy[];
  withIntroductionBanner?: boolean;
}

const DesktopFooter = ({ policies, withIntroductionBanner }: Props) => {
  return (
    <div className="">
      {withIntroductionBanner && (
        <div className="from-primary to-primary/90 bg-gradient-to-b py-4">
          <div className="container mx-auto grid grid-cols-2 gap-2 gap-y-8 lg:grid-cols-4">
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
          </div>
        </div>
      )}

      <div className="from-primary to-primary/90 bg-gradient-to-t text-white">
        <div className="container mx-auto grid grid-cols-1 gap-2 gap-y-8 border-t-2 border-gray-300 py-8 lg:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="mb-4 flex gap-2 font-medium">
              <Image
                src="white-logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="h-6 w-6 lg:h-12 lg:w-12"
              />
              Công ty Cổ phần Dược phẩm CPC1 Hà Nội
            </div>
            <div className="flex flex-col gap-2 py-1 text-sm font-normal text-gray-100">
              <span>
                Địa chỉ: Cụm Công Nghiệp Hà Bình Phương, xã Thường Tín, Thành
                Phố Hà Nội, Việt Nam
              </span>
              <span>
                GPDKKD: Số 0104089394 do Sở KHDT Thành phố Hà Nội cấp ngày 10
                tháng 11 năm 2017
              </span>
              <Link href={hotline.path} className="font-medium">
                Hotline: {hotline.text}
              </Link>
            </div>

            <div className="mt-4">
              <div className="flex gap-4">
                <Link
                  href={facebookUrl}
                  target="_blank"
                  className="text-sm text-gray-800"
                >
                  <Image
                    className="h-8 w-8"
                    alt="zalo"
                    src={"/icons/facebook.png"}
                    width={64}
                    height={64}
                  />
                </Link>
                <Link
                  href={youtubeUrl}
                  target="_blank"
                  className="text-sm text-gray-800"
                >
                  <Image
                    className="h-8 w-8 object-contain"
                    alt="zalo"
                    src={"/icons/youtube.png"}
                    width={64}
                    height={64}
                  />
                </Link>
                <Link
                  href={zaloUrl}
                  target="_blank"
                  className="text-sm text-gray-800"
                >
                  <Image
                    className="h-8 w-8"
                    alt="zalo"
                    src={"/icons/zalo.png"}
                    width={64}
                    height={64}
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="mb-2 text-lg font-medium text-white">
              Đặt hàng và hỗ trợ
            </h2>
            {policies.map((policy) => (
              <Link
                key={policy.id}
                href={`/ve-chung-toi/${policy.slug}.html`}
                className="text-sm text-gray-100 hover:underline"
              >
                {policy.title}
              </Link>
            ))}
          </div>

          <div>
            <h2 className="mb-2 text-lg font-medium text-white">Hotline</h2>
            <div className="flex flex-col gap-4">
              <Link href={hotline.path}>
                <div>
                  <span className="text-sm text-gray-300">Gọi mua hàng</span>{" "}
                  <br />
                  <span className="font-semibold text-gray-100">
                    {hotline.text}
                  </span>
                  <span className="text-sm text-gray-300"> (8h-21h30)</span>
                </div>
              </Link>
              <Link href={hotline.path}>
                <div>
                  <span className="text-sm text-gray-300">Gọi khiếu nại</span>{" "}
                  <br />
                  <span className="font-semibold text-gray-100">
                    {hotline.text}
                  </span>
                  <span className="text-sm text-gray-300"> (8h-21h30)</span>
                </div>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-medium text-white">Chứng nhận</h2>
            <Link href="http://online.gov.vn/Website/chi-tiet-135613">
              <Image
                src={"/icons/logoSaleNoti.png"}
                alt="Đã thông báo bộ công thương"
                width={200}
                height={100}
              />
            </Link>
          </div>
        </div>

        <div className="container mx-auto pb-8 text-sm text-gray-200">
          @2025 Bản quyền đã đăng ký thuộc Công ty CP Dược phẩm CPC1 Hà Nội
        </div>
      </div>
    </div>
  );
};

export default DesktopFooter;
