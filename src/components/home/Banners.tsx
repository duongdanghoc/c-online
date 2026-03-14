import { getBanners } from "@/app/api/banner";
import Image from "next/image";
import Link from "next/link";
import BannerCarousel from "./BannerCarousel";

const Banners = async () => {
  const { data, error } = await getBanners();
  if (!data || error) {
    return null;
  }
  return (
    <div className="grid grid-cols-12 gap-2 pt-2 lg:pt-4">
      <div className="row relative col-span-12 row-start-1 lg:col-span-8 lg:row-span-2">
        <BannerCarousel banners={data.banners} />
      </div>
      <div className="relative col-span-6 aspect-[2/1] w-full lg:col-span-4">
        {data.topRight && data.topRight.imageUrl && (
          <Link href={data.topRight?.url}>
            <Image
              src={data.topRight?.imageUrl}
              alt={data.topRight.name}
              fill
              sizes="(max-width: 768px) 50vw, 600px"
              className="aspect-[2/1] w-full rounded-lg object-cover"
            />
          </Link>
        )}
      </div>
      <div className="relative col-span-6 aspect-[2/1] w-full lg:col-span-4">
        {data.bottomRight && data.bottomRight.imageUrl && (
          <Link href={data.bottomRight?.url}>
            <Image
              src={data.bottomRight?.imageUrl}
              alt={data.bottomRight.name}
              fill
              sizes="(max-width: 768px) 50vw, 600px"
              className="aspect-[2/1] w-full rounded-lg object-cover"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Banners;
