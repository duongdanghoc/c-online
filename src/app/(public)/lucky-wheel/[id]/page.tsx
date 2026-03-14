import { getLuckyWheelInfo } from "@/app/api/lucky-wheel";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import SafeHTML from "@/components/common/safe-html";
import Image from "next/image";
import LuckyWheelView from "./wheel-view";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;

  const { data: wheel, error } = await getLuckyWheelInfo(id);
  if (error || !wheel) {
    return (
      <div>
        {JSON.stringify(error)}
        {JSON.stringify(wheel)}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <BreadcrumbsDefault
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Vòng quay may mắn", href: "/lucky-wheel" },
          { label: wheel.name, href: `/lucky-wheel/${wheel.id}` },
        ]}
      />
      <h1 className="mt-4 mb-2">{wheel.name}</h1>

      <div className="relative grid aspect-[2/1] w-full grid-cols-1 lg:grid-cols-2">
        <div className="block aspect-[2/1] w-full lg:hidden"></div>
        {wheel.desktopFramePath ? (
          <div className="absolute top-0 right-0 bottom-0 left-0 hidden lg:block">
            <Image
              src={wheel.desktopFramePath}
              alt={wheel.name}
              fill
              sizes="100%"
              className="object-cover"
            />
          </div>
        ) : null}

        {wheel.mobileFramePath ? (
          <div className="absolute top-0 right-0 bottom-0 left-0 block lg:hidden">
            <Image
              src={wheel.mobileFramePath}
              alt={wheel.name}
              fill
              sizes="100%"
              className="object-cover"
            />
          </div>
        ) : null}

        <LuckyWheelView wheel={wheel} segments={[...wheel.segments]} />
        <div></div>
      </div>

      <SafeHTML className="mt-4" html={wheel.description} />
    </div>
  );
};

export default Page;
