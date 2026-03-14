"use client";
import { Banner } from "@/app/types/banner";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import classNames from "classnames";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  const autoPlay = useRef(Autoplay({ delay: 2000 }));
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[autoPlay.current]}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.name}>
            <Link href={banner.url}>
              <div className="relative aspect-[2/1] w-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="overflow-hidden rounded-lg object-cover lg:rounded-xl"
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute bottom-2 flex h-fit w-full items-center justify-center gap-2 lg:bottom-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={classNames(
              "h-1 w-1 rounded-full lg:h-2 lg:w-2",
              current === index + 1
                ? "border-primary border-[6px]"
                : "border-primary/60 border-[3px]"
            )}
            onClick={() => api && api.scrollTo(index)}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default BannerCarousel;
