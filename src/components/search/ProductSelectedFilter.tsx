import { useProductFilterStore } from "@/store/product-filter";

const ProductSelectedFilter = () => {
  const {
    brands,
    indications,
    priceFilter,
    removeBrand,
    removeIndication,
    setPriceFilter,
  } = useProductFilterStore();

  if (!brands?.length && !indications?.length && !priceFilter?.title) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-white p-4 text-gray-700">
      Lọc theo:
      {brands?.length
        ? brands.map((brand) => (
            <div
              className="bg-gray-150 flex w-fit items-center rounded-full px-3 py-1 text-sm"
              key={brand}
            >
              {brand}
              <button
                className="ml-2 cursor-pointer p-1 text-gray-500"
                onClick={() => {
                  removeBrand(brand);
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        : null}
      {indications?.length
        ? indications.map((indication) => (
            <div
              className="bg-gray-150 flex w-fit items-center rounded-full px-2 py-1 text-sm"
              key={indication}
            >
              {indication}
              <button
                className="ml-2 cursor-pointer p-1 text-gray-500"
                onClick={() => {
                  removeIndication(indication);
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        : null}
      {priceFilter?.title ? (
        <div className="bg-gray-150 flex w-fit items-center rounded-full px-3 py-1 text-sm">
          {priceFilter?.title}
          <button
            className="ml-2 cursor-pointer p-1 text-gray-500"
            onClick={() => {
              setPriceFilter("x");
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ProductSelectedFilter;
