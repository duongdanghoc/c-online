import { getAllPolicies } from "@/app/api/policy";
import DesktopFooter from "./DesktopFooter";

const Footer = async ({
  withIntroductionBanner,
}: {
  withIntroductionBanner?: boolean;
}) => {
  const policiesResp = await getAllPolicies();

  return (
    <footer>
      <DesktopFooter
        policies={policiesResp.data ?? []}
        withIntroductionBanner={withIntroductionBanner}
      />
      {/* <MobileFooter policies={policiesResp.data ?? []} /> */}
      {/* <div className="container mx-auto mt-8 pb-4 text-center text-sm text-gray-600">
        <div className="mb-1 font-semibold text-gray-700">
          Công ty cổ phần Dược phẩm CPC1 Hà Nội
        </div>
        <div>
          Địa chỉ: Cụm Công nghiệp Hà Bình Phương, Xã Thường Tín, Thành phố Hà
          Nội, Việt Nam. Số điện thoại:{" "}
          <Link className="font-medium text-blue-500" href={"tel:0363166357"}>
            0363.166.357
          </Link>{" "}
          . Email:{" "}
          <Link
            className="font-medium text-blue-500"
            href={"mailto:saleonline_cpc1hn@googlegroups.com"}
          >
            saleonline_cpc1hn@googlegroups.com
          </Link>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
