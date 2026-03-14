"use client";

import SafeHTML from "@/components/common/safe-html";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import styles from "@/lib/styles/content.module.css";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

interface Props {
  description: string;
  toc: {
    id: string;
    shortText?: string;
  }[];
}

const ProductDescriptionDialog = ({ description, toc }: Props) => {
  const [activeId, setActiveId] = useState(() => toc[0]?.id ?? "");
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null
  );
  const [tocContainerElement, setTocContainerElement] =
    useState<HTMLDivElement | null>(null);

  const contentRef = useCallback((node: HTMLDivElement | null) => {
    setContentElement(node);
  }, []);

  const tocContainerRef = useCallback((node: HTMLDivElement | null) => {
    setTocContainerElement(node);
  }, []);

  const escapeSelector = useCallback((value: string) => {
    if (typeof window !== "undefined" && window.CSS?.escape) {
      return window.CSS.escape(value);
    }

    return value.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  }, []);

  const getHeadingElement = useCallback(
    (id: string) => {
      if (!contentElement) {
        return null;
      }

      const selector = `#${escapeSelector(id)}`;
      return contentElement.querySelector(selector) as HTMLElement | null;
    },
    [contentElement, escapeSelector]
  );

  useEffect(() => {
    if (!toc.length) {
      setActiveId("");
      return;
    }

    if (!toc.some((item) => item.id === activeId)) {
      setActiveId(toc[0].id);
    }
  }, [activeId, toc]);

  const scrollToHeading = useCallback(
    (id: string) => {
      if (!contentElement) {
        return;
      }

      const heading = getHeadingElement(id);

      if (!heading) {
        return;
      }

      const containerRect = contentElement.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const offset = 16;
      const target =
        headingRect.top - containerRect.top + contentElement.scrollTop - offset;

      contentElement.scrollTo({
        top: Math.max(target, 0),
        behavior: "smooth",
      });
    },
    [contentElement, getHeadingElement]
  );

  const handleTocItemClick = useCallback(
    (id: string) => {
      setActiveId(id);
      scrollToHeading(id);
    },
    [scrollToHeading]
  );

  useEffect(() => {
    if (!contentElement || !toc.length) {
      return;
    }

    let frame = 0;

    const updateActiveId = () => {
      const { scrollTop } = contentElement;
      const containerRect = contentElement.getBoundingClientRect();
      const offset = 32;
      let current = toc[0]?.id ?? "";

      for (const item of toc) {
        const heading = getHeadingElement(item.id);
        if (!heading) {
          continue;
        }

        const headingRect = heading.getBoundingClientRect();
        const relativeTop = headingRect.top - containerRect.top + scrollTop;

        if (relativeTop <= scrollTop + offset) {
          current = item.id;
        } else {
          break;
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveId);
    };

    contentElement.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveId();

    return () => {
      cancelAnimationFrame(frame);
      contentElement.removeEventListener("scroll", handleScroll);
    };
  }, [contentElement, getHeadingElement, toc]);

  useEffect(() => {
    if (!tocContainerElement || !activeId) {
      return;
    }

    const activeItem = tocContainerElement.querySelector(
      `[data-toc-id='${activeId}']`
    ) as HTMLElement | null;

    if (!activeItem) {
      return;
    }

    const containerRect = tocContainerElement.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    if (itemRect.left < containerRect.left) {
      tocContainerElement.scrollLeft += itemRect.left - containerRect.left;
    } else if (itemRect.right > containerRect.right) {
      tocContainerElement.scrollLeft += itemRect.right - containerRect.right;
    }
  }, [activeId, tocContainerElement]);

  return (
    <Sheet>
      <SheetTrigger className="w-full">
        <div className="flex w-full min-w-full items-center justify-center">
          Xem thêm{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={classNames(
              "ml-2 h-4 w-4 transition-transform duration-200"
            )}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
            />
          </svg>
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="h-[80%] rounded-t-xl p-2">
        {toc.length > 0 && (
          <div
            ref={tocContainerRef}
            className="scrollbar-none border-border bg-muted/30 mb-3 flex flex-nowrap gap-2 overflow-x-auto rounded-lg border text-sm lg:hidden"
          >
            {toc.map((item) => {
              const isActive = activeId === item.id;

              return (
                <div
                  key={item.id}
                  data-toc-id={item.id}
                  onClick={() => handleTocItemClick(item.id)}
                  className={classNames(
                    "flex-shrink-0 rounded-md px-3 py-2 text-left transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.shortText}
                </div>
              );
            })}
          </div>
        )}
        <div
          ref={contentRef}
          className="block h-full overflow-auto pt-1 pb-12 lg:hidden"
        >
          <SafeHTML
            html={description}
            className={classNames(styles.content, styles.contentContainer)}
          ></SafeHTML>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDescriptionDialog;
