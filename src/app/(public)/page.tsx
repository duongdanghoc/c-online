import { getUserInfo } from "@/app/api/user";
import FeaturedCategoryView from "@/components/home/FeaturedCategoryView";
import GuestHomePage from "@/components/home/GuestHomePage";
import HomePosts from "@/components/home/HomePosts";
import HomeSections from "@/components/home/HomeSections";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: user } = await getUserInfo();

  if (!user) {
    return <GuestHomePage />;
  }

  return (
    <div className="container mx-auto pb-12">
      <h1 className="hidden">
        Shop CPC1 Hà Nội - Mua thuốc chính hãng, giá tốt, giao hàng nhanh
      </h1>
      <FeaturedCategoryView />
      <HomeSections />
      <HomePosts />
    </div>
  );
}
