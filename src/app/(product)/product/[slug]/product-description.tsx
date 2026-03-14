import SafeHTML from "@/components/common/safe-html";
import styles from "@/lib/styles/content.module.css";
import classNames from "classnames";
import ProductDescriptionDialog from "./product-description-dialog";
import ProductDescriptionToc from "./product-description-toc";

interface Props {
  description: string;
  toc: string;
}

const ProductDescription = (props: Props) => {
  const toc = convertTocToArray(props.toc);

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 rounded-xl bg-white p-2 lg:p-4">
      <div className="col-span-3 hidden lg:block">
        <ProductDescriptionToc toc={toc} />
      </div>
      <div className="col-span-12 lg:col-span-9">
        <div className="flex flex-col relative">
          <input type="checkbox" id="desc-expand" className="peer hidden" />

          <div className="order-2 hidden justify-center lg:flex mt-4 peer-checked:[&_.btn-text-more]:hidden peer-checked:[&_.btn-text-less]:inline peer-checked:[&_svg]:rotate-180">
            <label
              htmlFor="desc-expand"
              className="inline-flex w-fit cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 select-none"
            >
              <span className="btn-text-more">Xem thêm</span>
              <span className="btn-text-less hidden">Thu gọn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-2 h-4 w-4 transition-transform duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                />
              </svg>
            </label>
          </div>
          <div className="order-1 relative max-h-[500px] overflow-hidden transition-all duration-300 peer-checked:max-h-none">
            <SafeHTML
              html={props.description}
              className={classNames(
                styles.content,
                styles.contentContainer
              )}
            />
            <div
              className={classNames(
                styles.gradient,
                "transition-opacity duration-200 peer-checked:opacity-0 peer-checked:pointer-events-none"
              )}
            />
          </div>
        </div>
        <div className="w-full lg:hidden">
          <ProductDescriptionDialog toc={toc} description={props.description} />
        </div>
      </div>
    </div>
  );
};

const convertTocToArray = (
  toc: string
): { id: string; text: string; shortText?: string }[] => {
  try {
    const result = JSON.parse(toc) as {
      id: string;
      text: string;
      shortText?: string;
    }[];

    return result.map((item) => ({
      ...item,
      shortText: !!item.shortText ? item.shortText : item.text,
    }));
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
};

export default ProductDescription;
