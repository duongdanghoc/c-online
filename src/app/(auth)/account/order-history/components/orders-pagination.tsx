import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type OrdersPaginationProps = {
  page: number;
  total: number;
  limit: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};

const OrdersPagination = ({
  page,
  total,
  limit,
  disabled,
  onChange,
}: OrdersPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) {
    return null;
  }

  const rangeTextStart = (page - 1) * limit + 1;
  const rangeTextEnd = Math.min(total, page * limit);

  const paginationItems = buildPaginationItems(totalPages, page);
  const isPrevDisabled = page === 1 || disabled;
  const isNextDisabled = page === totalPages || disabled;

  const handlePageChange = (nextPage: number) => {
    if (disabled || nextPage === page) {
      return;
    }
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    onChange(nextPage);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
      <p>
        Hiển thị {rangeTextStart}-{rangeTextEnd} trong tổng số {total} đơn hàng
      </p>
      <PaginationRoot className="md:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              size="default"
              aria-disabled={isPrevDisabled}
              tabIndex={isPrevDisabled ? -1 : 0}
              className={cn(
                "gap-1 pl-2.5",
                isPrevDisabled && "pointer-events-none opacity-50"
              )}
              onClick={(event) => {
                event.preventDefault();
                if (!isPrevDisabled) {
                  handlePageChange(page - 1);
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Trước</span>
            </PaginationLink>
          </PaginationItem>
          {paginationItems.map((item, index) =>
            typeof item === "number" ? (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  size="default"
                  isActive={item === page}
                  aria-disabled={disabled}
                  tabIndex={disabled ? -1 : 0}
                  className={cn(disabled && item !== page && "opacity-60")}
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={`${item}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationLink
              href="#"
              size="default"
              aria-disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : 0}
              className={cn(
                "gap-1 pr-2.5",
                isNextDisabled && "pointer-events-none opacity-50"
              )}
              onClick={(event) => {
                event.preventDefault();
                if (!isNextDisabled) {
                  handlePageChange(page + 1);
                }
              }}
            >
              <span>Sau</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    </div>
  );
};

const buildPaginationItems = (
  totalPages: number,
  currentPage: number
): (number | string)[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | string)[] = [1];

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    items.push("...");
  }

  for (let page = left; page <= right; page++) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push("...");
  }

  items.push(totalPages);

  return items;
};

export default OrdersPagination;
