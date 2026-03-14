import { getFlashSaleInfo } from "@/app/api/flash-sale";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import ErrorLayout from "@/components/common/error-layout";
import SafeHTML from "@/components/common/safe-html";
import FlashSaleView from "./flash-sale-view";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const id = (await params).id;
  const { data, error } = await getFlashSaleInfo(id);

  if (error || !data) {
    return <ErrorLayout error={error} />;
  }

  return (
    <div className="container mx-auto pb-12">
      <BreadcrumbsDefault
        items={[
          { label: "Trang chủ", href: "/" },
          { label: data.title, href: "" },
        ]}
      />

      <h1 className="mt-8 mb-4 text-xl font-bold text-gray-800 lg:text-2xl">
        {data.title}
      </h1>
      <SafeHTML html={data.description ?? ""} />

      <FlashSaleView flashSale={data} />
    </div>
  );
};

export default Page;
