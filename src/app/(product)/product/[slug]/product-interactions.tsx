"use client";

import dynamic from "next/dynamic";

const ConsultationForm = dynamic(
  () => import("@/components/consultation/ConsultationForm"),
  { ssr: false }
);
const FeedbackComp = dynamic(() => import("./feedback-comp"), { ssr: false });

interface Props {
  slug: string;
  productId: string;
}

export default function ProductInteractions({ slug, productId }: Props) {
  return (
    <>
      <ConsultationForm productSlug={slug} className="mt-4" />
      <FeedbackComp productId={productId} />
    </>
  );
}
