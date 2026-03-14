"use client";

import { getOrders } from "@/app/api/order";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import OrderFilters from "./components/order-filters";
import OrderList from "./components/order-list";
import OrdersPagination from "./components/orders-pagination";
import { ORDER_QUICK_RANGE_OPTIONS } from "./constants";
import { OrderDateRange } from "./types";

const PAGE_SIZE = 5;

const OrderHistoryView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultRange = useMemo(() => {
    const to = dayjs().endOf("day");
    const from = to.subtract(7, "day").startOf("day");

    return {
      from: from.toDate(),
      to: to.toDate(),
    };
  }, []);

  const page = useMemo(() => {
    const pageParam = Number(searchParams.get("page"));
    if (Number.isFinite(pageParam) && pageParam > 0) {
      return pageParam;
    }
    return 1;
  }, [searchParams]);

  const dateRange = useMemo<OrderDateRange>(() => {
    const fromParam = searchParams.get("fromDate");
    const toParam = searchParams.get("toDate");

    let from =
      fromParam && dayjs(fromParam).isValid()
        ? dayjs(fromParam)
        : dayjs(defaultRange.from);
    let to =
      toParam && dayjs(toParam).isValid()
        ? dayjs(toParam)
        : dayjs(defaultRange.to);

    from = from.startOf("day");
    to = to.endOf("day");

    if (from.isAfter(to)) {
      to = from.endOf("day");
    }

    return {
      from: from.toDate(),
      to: to.toDate(),
    };
  }, [defaultRange, searchParams]);

  const normalizedFromISO = useMemo(
    () => dayjs(dateRange.from).startOf("day").toISOString(),
    [dateRange.from]
  );
  const normalizedToISO = useMemo(
    () => dayjs(dateRange.to).endOf("day").toISOString(),
    [dateRange.to]
  );

  const selectedPreset = useMemo(() => {
    const presetParam = Number(searchParams.get("preset"));
    if (Number.isFinite(presetParam)) {
      const matchedOption = ORDER_QUICK_RANGE_OPTIONS.find(
        (option) => option.value === presetParam
      );
      if (matchedOption) {
        return matchedOption.value;
      }
    }

    const diffDays = dayjs(dateRange.to).diff(dayjs(dateRange.from), "day");
    const inferredPreset = ORDER_QUICK_RANGE_OPTIONS.find(
      (option) => option.value === diffDays
    );

    return inferredPreset?.value ?? null;
  }, [dateRange.from, dateRange.to, searchParams]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      fromDate: new Date(normalizedFromISO),
      toDate: new Date(normalizedToISO),
    }),
    [normalizedFromISO, normalizedToISO, page]
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["orders", page, PAGE_SIZE, normalizedFromISO, normalizedToISO],
    queryFn: () => getOrders(queryParams),
  });

  const orders = data?.orders ?? [];
  const totalOrders = data?.total ?? 0;

  const updateSearchParams = ({
    page: nextPage,
    fromDate,
    toDate,
    preset,
  }: {
    page?: number;
    fromDate?: Date;
    toDate?: Date;
    preset?: number | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage !== undefined) {
      params.set("page", Math.max(1, nextPage).toString());
    }

    if (fromDate) {
      params.set("fromDate", dayjs(fromDate).startOf("day").toISOString());
    }

    if (toDate) {
      params.set("toDate", dayjs(toDate).endOf("day").toISOString());
    }

    if (preset !== undefined) {
      if (preset === null) {
        params.delete("preset");
      } else {
        params.set("preset", preset.toString());
      }
    }

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handlePresetChange = (days: number) => {
    const to = dayjs().endOf("day");
    const from = to.subtract(days, "day").startOf("day");

    updateSearchParams({
      page: 1,
      fromDate: from.toDate(),
      toDate: to.toDate(),
      preset: days,
    });
  };

  const handleFromDateChange = (date?: Date) => {
    if (!date) {
      return;
    }

    const normalizedFrom = dayjs(date).startOf("day");
    const currentTo = dayjs(dateRange.to);
    const adjustedTo = normalizedFrom.isAfter(currentTo)
      ? normalizedFrom.endOf("day")
      : currentTo.endOf("day");

    updateSearchParams({
      page: 1,
      fromDate: normalizedFrom.toDate(),
      toDate: adjustedTo.toDate(),
      preset: null,
    });
  };

  const handleToDateChange = (date?: Date) => {
    if (!date) {
      return;
    }

    const normalizedTo = dayjs(date).endOf("day");
    const currentFrom = dayjs(dateRange.from);
    const adjustedFrom = currentFrom.isAfter(normalizedTo)
      ? normalizedTo.startOf("day")
      : currentFrom.startOf("day");

    updateSearchParams({
      page: 1,
      fromDate: adjustedFrom.toDate(),
      toDate: normalizedTo.toDate(),
      preset: null,
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return;
    }
    updateSearchParams({ page: nextPage });
  };

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm xl:space-y-6">
      <div className="flex flex-wrap items-start gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lịch sử mua hàng</h1>
          <p className="text-sm text-slate-500">
            Theo dõi và lọc đơn hàng theo khoảng thời gian bạn mong muốn
          </p>
        </div>
        {isFetching && !isLoading && (
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <span>Đang cập nhật...</span>
          </div>
        )}
      </div>

      <OrderFilters
        dateRange={dateRange}
        selectedPreset={selectedPreset}
        normalizedFromISO={normalizedFromISO}
        normalizedToISO={normalizedToISO}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        onPresetChange={handlePresetChange}
      />

      <div className="space-y-4">
        <OrderList
          orders={orders}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      </div>

      {orders.length > 0 && (
        <OrdersPagination
          page={page}
          total={totalOrders}
          limit={PAGE_SIZE}
          onChange={handlePageChange}
          disabled={isFetching}
        />
      )}
    </section>
  );
};

export default OrderHistoryView;
