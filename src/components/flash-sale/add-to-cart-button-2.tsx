import { getProductDetail } from "@/app/api/product";
import { FlashSaleProduct } from "@/app/types/flash-sale";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import AddToCartButton from "../product/AddToCartButton";
import { Button } from "../ui/button";

interface Props {
  fsProduct: FlashSaleProduct;
}

const AddToCartButton2 = ({ fsProduct }: Props) => {
  const [slug, setSlug] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["productInfo", slug],
    queryFn: async () => {
      const { data, error } = await getProductDetail(slug!);
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!slug,
  });

  if (data) {
    return <AddToCartButton product={data} initialOpen={true} />;
  }

  return (
    <Button
      className="bg-primary hover:bg-primary/80 w-full"
      onClick={(e: any) => {
        e.stopPropagation();
        e.preventDefault();
        if (slug === fsProduct.slug) return;
        setSlug(fsProduct.slug);
      }}
      disabled={isLoading}
    >
      {isLoading && <Loader2Icon className="animate-spin" />}
      Thêm vào giỏ hàng
    </Button>
  );
};

export default AddToCartButton2;
