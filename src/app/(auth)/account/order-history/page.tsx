import LoadingView from "@/components/layout/LoadingView";
import { Suspense } from "react";
import OrderHistoryView from "./order-history-view";

const Page = () => {
  return (
    <Suspense fallback={<LoadingView />}>
      <OrderHistoryView />
    </Suspense>
  );
};

export default Page;
