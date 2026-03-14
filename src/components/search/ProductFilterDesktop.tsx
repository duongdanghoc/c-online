import { cn } from "@/lib/utils";
import { useProductFilterStore } from "@/store/product-filter";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

const ProductFilterDesktop = () => {
  const {
    aggregations,
    brands,
    setBrands,
    indications,
    setIndications,
    priceFilter,
    priceFilterOptions,
  } = useProductFilterStore();

  const [visibleBrands, setVisibleBrands] = useState(5);
  const [visibleIndications, setVisibleIndications] = useState(5);
  const [brandSearch, setBrandSearch] = useState("");
  const [indicationSearch, setIndicationSearch] = useState("");

  const handleBrandChange = (brand: string) => {
    if (brands?.includes(brand)) {
      setBrands(brands.filter((b) => b !== brand));
    } else {
      setBrands([...(brands ?? []), brand]);
    }
  };

  const handleIndicationChange = (indication: string) => {
    if (indications?.includes(indication)) {
      setIndications(indications.filter((i) => i !== indication));
    } else {
      setIndications([...(indications ?? []), indication]);
    }
  };

  const filteredBrands =
    aggregations?.brands?.filter((brand) =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    ) || [];

  const filteredIndications =
    aggregations?.indications?.filter((indication) =>
      indication.toLowerCase().includes(indicationSearch.toLowerCase())
    ) || [];

  return (
    <div className="sticky top-4 hidden h-fit max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-white p-4 lg:block">
      <div className="text-lg font-medium">Lọc sản phẩm</div>
      <Accordion
        type="multiple"
        defaultValue={["brands", "indications", "price"]}
      >
        <AccordionItem value="brands">
          <AccordionTrigger className="text-base font-medium">
            Thương hiệu
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Tìm thương hiệu..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
              <div
                className="flex cursor-pointer items-center space-x-2 select-none"
                key={"all"}
              >
                <Checkbox
                  id={"brands_all"}
                  checked={!brands || brands.length === 0}
                  onClick={() => setBrands([])}
                />
                <label
                  htmlFor={"brands_all"}
                  className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tất cả
                </label>
              </div>
              {filteredBrands.slice(0, visibleBrands).map((brand) => (
                <div
                  className="flex cursor-pointer items-center space-x-2 select-none"
                  key={brand}
                >
                  <Checkbox
                    id={brand}
                    checked={brands?.includes(brand)}
                    onClick={() => handleBrandChange(brand)}
                  />
                  <label
                    htmlFor={brand}
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    style={{
                      lineHeight: "1.125rem",
                    }}
                  >
                    {brand}
                  </label>
                </div>
              ))}
              {filteredBrands.length > visibleBrands && (
                <ReadMore
                  onClick={() => setVisibleBrands((prev) => prev + 5)}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="indications">
          <AccordionTrigger className="text-base font-medium">
            Chỉ định sử dụng
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Tìm chỉ định sử dụng..."
                value={indicationSearch}
                onChange={(e) => setIndicationSearch(e.target.value)}
                className="mb-2"
              />
              <div
                className="flex cursor-pointer items-center space-x-2 select-none"
                key={"all"}
              >
                <Checkbox
                  id={"indications_all"}
                  checked={!indications || indications.length === 0}
                  onClick={() => setIndications([])}
                />
                <label
                  htmlFor={"indications_all"}
                  className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tất cả
                </label>
              </div>
              {filteredIndications
                .slice(0, visibleIndications)
                .map((indication) => (
                  <div
                    className="flex cursor-pointer items-center space-x-2 select-none"
                    key={indication}
                  >
                    <Checkbox
                      id={indication}
                      checked={indications?.includes(indication)}
                      onClick={() => handleIndicationChange(indication)}
                    />
                    <label
                      htmlFor={indication}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {indication}
                    </label>
                  </div>
                ))}
              {filteredIndications.length > visibleIndications && (
                <ReadMore
                  onClick={() => setVisibleIndications((prev) => prev + 5)}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">
            Giá sản phẩm
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex cursor-pointer items-center rounded-lg px-4 py-2 transition-colors",
                  !priceFilter
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100"
                )}
                onClick={() =>
                  useProductFilterStore.setState({ priceFilter: undefined })
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border-2",
                      !priceFilter ? "border-primary" : "border-gray-400"
                    )}
                  >
                    {!priceFilter && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Tất cả</span>
                </div>
              </div>

              {priceFilterOptions.map((option) => (
                <div
                  key={option.title}
                  className={cn(
                    "flex cursor-pointer items-center rounded-lg px-4 py-2 transition-colors",
                    priceFilter?.title === option.title
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() =>
                    useProductFilterStore.setState({ priceFilter: option })
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border-2",
                        priceFilter?.title === option.title
                          ? "border-primary"
                          : "border-gray-400"
                      )}
                    >
                      {priceFilter?.title === option.title && (
                        <div className="bg-primary h-2 w-2 rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{option.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

function ReadMore({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant={"ghost"} className="mt-2" onClick={onClick}>
      Xem thêm{" "}
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
  );
}

export default ProductFilterDesktop;
