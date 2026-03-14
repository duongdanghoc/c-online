"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  images: string[];
  productName: string;
}

const ProductImages = ({ images, productName }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div>
      <Carousel className="overflow-hidden rounded-xl" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="relative aspect-[4/4] w-full overflow-hidden rounded-xl"
            >
              <Image
                src={image}
                alt={productName}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="h-full w-full object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-0" />
        <CarouselPrevious className="absolute left-0" />
      </Carousel>
      <Carousel className="overflow-hidden rounded-xl p-2">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="ms-0.5 basis-[20%] lg:basis-[15%] xl:basis-[15%]"
            >
              <div
                onClick={() => handleThumbnailClick(index)}
                className={`cursor-pointer transition-all ${
                  current === index
                    ? "ring-primary my-0.5 overflow-hidden rounded-lg ring-2"
                    : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} - thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="aspect-[4/4] h-full w-full rounded-lg border object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductImages;
