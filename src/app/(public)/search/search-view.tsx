/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getProductPrices } from "@/app/api/product";
import { generateSearchProductKey } from "@/app/api/search";
import LoadingView from "@/components/layout/LoadingView";
import ProductFilterDesktop from "@/components/search/ProductFilterDesktop";
import ProductFilterMobile from "@/components/search/ProductFilterMobile";
import ProductSelectedFilter from "@/components/search/ProductSelectedFilter";
import ProductsView from "@/components/search/ProductsView";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "@/lib/hooks/use-media.query";
import { sortTypes, useProductFilterStore } from "@/store/product-filter";
import { getStringArrayParams } from "@/utils/searchParams";
import { Label } from "@radix-ui/react-label";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Props {
  searchParams?: {
    "tu-khoa"?: string;
    "thuong-hieu"?: string[];
    "chi-dinh-su-dung"?: string[];
    gia?: string;
  };
}

const SearchView = ({ searchParams }: Props) => {
  const {
    brands,
    setBrands,
    indications,
    setIndications,
    setAggregations,
    priceFilter,
    setPriceFilter,
    sortType,
    setSortType,
  } = useProductFilterStore();
  const [previousData, setPreviousData] = useState<any>(null);
  const pathName = usePathname();
  const router = useRouter();
  const lg = useMediaQuery("(min-width: 1024px)");

  const query = searchParams?.["tu-khoa"];
  useEffect(() => {
    if (searchParams?.["thuong-hieu"]) {
      setBrands(
        (getStringArrayParams(searchParams?.["thuong-hieu"]) ?? []).sort()
      );
    }
    if (searchParams?.["chi-dinh-su-dung"]) {
      setIndications(
        (getStringArrayParams(searchParams?.["chi-dinh-su-dung"]) ?? []).sort()
      );
    }
    if (searchParams?.["gia"]) {
      setPriceFilter(searchParams?.["gia"]);
    }
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      placeholderData: previousData,
      queryKey: generateSearchProductKey(
        query,
        brands,
        indications,
        priceFilter?.title,
        sortType
      ),
      queryFn: async ({ pageParam }) => {
        const { searchProducts } = await import("@/app/api/search");

        const { data, error } = await searchProducts({
          from: pageParam,
          size: 12,
          query: query,
          brands: brands,
          indications: indications,
          price: priceFilter
            ? {
                min: priceFilter.min,
                max: priceFilter.max,
              }
            : undefined,
          sortType: sortType,
        });
        if (error) {
          throw error;
        }

        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: any) => {
        return lastPage.nextPage ?? undefined;
      },
      refetchOnWindowFocus: false,
      enabled: !!query,
    });

  useEffect(() => {
    setPreviousData(data);
    if (!data?.pages[0]?.aggregations) {
      return;
    }
    setAggregations(data?.pages[0]?.aggregations);
  }, [data, setAggregations]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Clear existing params first
    params.delete("thuong-hieu");
    params.delete("chi-dinh-su-dung");

    // Append each value separately to create an array in URLSearchParams
    if (brands?.length) {
      brands.forEach((brand) => {
        params.append("thuong-hieu", brand);
      });
    }

    if (indications?.length) {
      indications.forEach((indication) => {
        params.append("chi-dinh-su-dung", indication);
      });
    }

    if (priceFilter) {
      params.set("gia", priceFilter.title);
    } else {
      params.delete("gia");
    }

    router.replace(`${pathName}?${params.toString()}`);
  }, [brands, indications, pathName, router, priceFilter]);

  const allProducts = useMemo(() => {
    return (
      data?.pages
        ?.map((page) => page?.products)
        .flat()
        .filter((product) => product !== undefined)
        .filter((product) => product !== null) ?? []
    );
  }, [data]);

  const priceQueries = useQueries({
    queries: (data?.pages ?? []).map((page) => {
      const products =
        page?.products
          ?.filter((p) => p !== undefined)
          .filter((p) => p !== null) ?? [];
      const payload = products.flatMap((p) =>
        (p.units || []).map((u) => ({
          productId: p.productId,
          unitId: u.unitId,
        }))
      );

      return {
        queryKey: [
          "search-products-prices-page",
          payload.map((i) => `${i.productId}-${i.unitId}`).join(","),
        ],
        queryFn: async () => {
          if (payload.length === 0) return [];
          return await getProductPrices(payload);
        },
        enabled: payload.length > 0,
      };
    }),
  });

  const latestPrices = useMemo(() => {
    return priceQueries.flatMap((query) => query.data ?? []);
  }, [priceQueries]);

  const displayProducts = useMemo(() => {
    return allProducts.map((product) => {
      const productUnits = product.units || [];
      const updatedUnits = productUnits.map((unit) => {
        const priceInfo = latestPrices.find(
          (p) => p.productId === product.productId && p.unitId === unit.unitId
        );

        if (priceInfo) {
          return {
            ...unit,
            originalPrice: priceInfo.originalPrice,
            sellingPrice: priceInfo.sellingPrice,
          };
        }
        return unit;
      });

      return {
        ...product,
        units: updatedUnits,
      };
    });
  }, [allProducts, latestPrices]);

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 rounded-xl bg-white p-4">
        Tìm kiếm theo từ khoá{" "}
        <span className="text-lg font-semibold">&quot;{query}&quot;</span>
      </div>
      <div className="relative grid grid-cols-4 gap-4">
        {lg && <ProductFilterDesktop />}
        <div className="col-span-4 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2>Danh sách sản phẩm</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-2 py-2 md:gap-4 md:px-4 md:py-1">
                <span className="text-sm text-gray-600">Sắp xếp theo</span>
                <RadioGroup defaultValue={sortTypes[0]?.title} className="flex">
                  {sortTypes.map((type) => (
                    <div
                      className="flex cursor-pointer items-center space-x-2"
                      key={type.title}
                    >
                      <RadioGroupItem
                        value={type.title}
                        id={type.title}
                        className="bg-white"
                        onClick={() => {
                          setSortType(type.value);
                        }}
                      />
                      <Label htmlFor={type.title}>{type.title}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {!lg && <ProductFilterMobile />}
            </div>
          </div>

          <ProductSelectedFilter />
          <ProductsView
            products={displayProducts}
            total={data?.pages[0]?.total ?? 0}
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
          />
        </div>
      </div>

      {(isFetching || isFetchingNextPage) && <LoadingView />}
    </div>
  );
};

export default SearchView;
