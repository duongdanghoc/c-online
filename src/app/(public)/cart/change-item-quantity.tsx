import { CartItem } from "@/app/types/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

interface Props {
  item: CartItem;
  onQuantityChange: (data: {
    productId: number;
    unitId: number;
    quantity: number;
  }) => void;
}

const ChangeItemQuantity = ({ item, onQuantityChange }: Props) => {
  const [quantity, setQuantity] = React.useState<number>(item.quantity);

  React.useEffect(() => {
    setQuantity(item.quantity);
  }, [item]);

  const handleQuantityChange = (newValue: number) => {
    if (newValue > 0) {
      onQuantityChange({
        productId: item.productId,
        unitId: item.unitId,
        quantity: newValue,
      });
      setQuantity(newValue);
    } else {
      onQuantityChange({
        productId: item.productId,
        unitId: item.unitId,
        quantity: 1,
      });
      setQuantity(1);
    }
  };

  return (
    <div className="flex w-fit overflow-hidden rounded-full border border-slate-300">
      <Button
        size={"sm"}
        variant={"ghost"}
        onClick={() => {
          if (quantity > 1) {
            handleQuantityChange(quantity - 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </Button>
      <Input
        className="no-spinner border-sla h-fit w-12 rounded-none border-t-0 border-r-[1px] border-b-0 border-l-[1px] px-0 text-center ring-0 outline-0 lg:h-8"
        type="number"
        value={quantity}
        onChange={(e) => {
          const newValue = parseInt(e.target.value?.replace(/\D/g, ""));
          if (!isNaN(newValue) && newValue > 0) {
            handleQuantityChange(newValue);
          } else {
            handleQuantityChange(1);
          }
        }}
      />
      <Button
        size={"sm"}
        variant={"ghost"}
        onClick={() => handleQuantityChange(quantity + 1)}
      >
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Button>
    </div>
  );
};

export default ChangeItemQuantity;
