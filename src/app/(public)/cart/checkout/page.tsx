import { refreshTokenKey } from "@/lib/const";
import { cookies } from "next/headers";
import CheckoutView from "./checkout-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has(refreshTokenKey);

  return <CheckoutView isLoggedIn={isLoggedIn} />;
};

export default Page;
