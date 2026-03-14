"use client";
import {
  getFlashSaleProductQuotas,
  getFlashSaleProducts,
} from "@/app/api/flash-sale";
import { FlashSale } from "@/app/types/flash-sale";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import FlashSaleSectionsView from "./flash-sale-sections-view";
import LoadingCard from "./loading-card";
import SectionProducts from "./section-products";
import SectionStatusComp from "./section-status-comp";

interface Props {
  flashSale: FlashSale;
}

const FlashSaleView = ({ flashSale }: Props) => {
  const [selectedSection, setSelectedSection] = React.useState<string | null>(
    null
  );

  useEffect(() => {
    let s = null;
    for (const section of flashSale.sections) {
      const currentTime = dayjs();
      const fromHour = dayjs(section.fromHour);
      const toHour = dayjs(section.toHour);

      if (currentTime.isBefore(toHour) && currentTime.isAfter(fromHour)) {
        s = section.id;
        break;
      }
    }

    if (!s && flashSale.sections.length > 0) {
      s = flashSale.sections[flashSale.sections.length - 1].id;
    }

    setSelectedSection(s);
  }, [flashSale]);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["flashSaleProducts", flashSale.id, selectedSection],
    queryFn: async () => {
      if (!selectedSection) {
        return [];
      }
      const { data, error } = await getFlashSaleProducts({
        flashSaleId: flashSale.id,
        sectionId: selectedSection,
      });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const { data: quotas, isLoading: isLoadingQuotas } = useQuery({
    queryKey: ["flashSaleProductQuotas", flashSale.id, selectedSection],
    queryFn: async () => {
      if (!selectedSection) {
        return [];
      }
      const { data, error } = await getFlashSaleProductQuotas({
        flashSaleId: flashSale.id,
        sectionId: selectedSection,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!selectedSection,
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className="overflow-hidden rounded-none md:rounded-xl"
      style={{
        backgroundColor: flashSale.color || "#f8f8f8",
      }}
    >
      <Link href={`/flash-sale/${flashSale.id}`} className="relative w-full">
        <div className="absolute top-2 right-2 flex items-center gap-2 rounded-full bg-black/20 px-2 py-1 text-sm text-white">
          Xem chi tiết{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
        <div>
          {flashSale.image && (
            <Image
              className="hidden aspect-[10/1] w-full object-cover md:block"
              src={flashSale.image}
              alt={flashSale.title}
              width={2560}
              height={256}
            />
          )}
          {flashSale.mobileImage && (
            <Image
              className="block aspect-[3.75/1] w-full object-cover md:hidden"
              src={flashSale.mobileImage}
              alt={flashSale.title}
              width={750}
              height={200}
            />
          )}
        </div>
      </Link>

      <div className="p-0 lg:p-3">
        <FlashSaleSectionsView
          sections={flashSale.sections}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
        />

        <div className="rounded-b-none bg-gray-100 p-2 md:rounded-b-lg">
          {selectedSection && (
            <SectionStatusComp
              section={
                flashSale.sections?.filter((s) => s.id == selectedSection)[0]
              }
            />
          )}

          {(isLoadingProducts || isLoadingQuotas) && (
            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingCard
                  key={i}
                  className={classNames({
                    "hidden xl:block": i > 4,
                    "hidden lg:block": i > 2 && i <= 4,
                  })}
                />
              ))}
            </div>
          )}

          {products && quotas && (
            <SectionProducts products={products ?? []} quotas={quotas ?? []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashSaleView;
