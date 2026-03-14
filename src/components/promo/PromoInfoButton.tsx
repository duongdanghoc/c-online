import { forwardRef, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromoInfoButtonProps extends ComponentProps<typeof Button> {
  ariaLabel?: string;
}

const PromoInfoButton = forwardRef<HTMLButtonElement, PromoInfoButtonProps>(
  ({ ariaLabel = "Xem chi tiết ưu đãi", className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          "size-5 min-w-0 rounded-full border border-orange-200 text-xs font-semibold text-orange-500 hover:text-orange-600",
          className
        )}
        aria-label={ariaLabel}
        {...props}
      >
        {children ?? "?"}
      </Button>
    );
  }
);

PromoInfoButton.displayName = "PromoInfoButton";

export default PromoInfoButton;
