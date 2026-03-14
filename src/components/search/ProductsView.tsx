import { Product } from "@/app/types/product";
import React from "react";
import ProductCard from "../product/ProductCard";
import { Button } from "../ui/button";

interface Props {
  products: Product[];
  total: number;
  hasNextPage: boolean;
  loadMore: () => void;
}

const ProductsView: React.FC<Props> = ({
  products,
  hasNextPage,
  total,
  loadMore,
}) => {
  return (
    <div>
      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard product={product} key={product.productId} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        {hasNextPage && (
          <Button onClick={loadMore} variant={"ghost"} className="mt-4">
            Xem thêm {total - products.length} sản phẩm
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductsView;
