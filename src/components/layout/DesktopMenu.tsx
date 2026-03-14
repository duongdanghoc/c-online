"use client";

import { Category } from "@/app/types/category";
import classNames from "classnames";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

const DesktopMenu = ({ categories }: { categories: Category[] }) => {
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = useCallback((category: Category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(category);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  }, []);

  return (
    <div className="relative hidden bg-white shadow-sm lg:block">
      <div className="container mx-auto flex h-12 items-center justify-between">
        {categories?.map((c) => {
          return (
            <Link
              href={`/danh-muc/${c.slug}`}
              onClick={() => setHoveredCategory(null)}
              key={c.id}
              className={classNames(
                "flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm hover:bg-gray-50",
                hoveredCategory?.id === c.id
                  ? "text-primary font-bold underline"
                  : "font-medium"
              )}
              onMouseEnter={() => handleMouseEnter(c)}
              onMouseLeave={handleMouseLeave}
            >
              {c.name}
              {c.children && c.children.length > 0 && (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={classNames("h-5 w-5")}
                  animate={{ rotate: hoveredCategory?.id === c.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </Link>
          );
        })}

        <Link
          href={"/chuyen-muc"}
          className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Chuyên mục sức khoẻ{" "}
        </Link>
      </div>

      {/* panel */}
      {hoveredCategory &&
        hoveredCategory.children &&
        hoveredCategory.children.length > 0 && (
          <div className="absolute top-12 z-50 h-screen w-screen bg-black/30">
            <div className="container mx-auto">
              <div
                className="flex h-fit w-full rounded-b-2xl bg-white p-4"
                onMouseEnter={() => handleMouseEnter(hoveredCategory)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-gray-150 @container grid w-full grid-cols-4 gap-4 rounded-xl p-4">
                  {hoveredCategory.children.map((child) => (
                    <Link
                      onClick={() => setHoveredCategory(null)}
                      href={`/danh-muc/${child.slug}`}
                      key={child.id}
                      className="flex cursor-pointer items-center gap-4 rounded-lg bg-white p-2 text-sm text-gray-800"
                    >
                      {child.imageUrl ? (
                        <Image
                          src={child.imageUrl}
                          width={48}
                          height={48}
                          alt={child.name}
                          className="overflow-hidden rounded-xl"
                        />
                      ) : null}
                      <div className="font-medium">{child.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default DesktopMenu;
