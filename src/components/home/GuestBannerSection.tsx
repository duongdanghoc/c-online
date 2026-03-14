"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import * as React from "react";

export function GuestBannerSection() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative flex h-[500px] w-full flex-col overflow-hidden rounded-2xl border-[4px] border-white bg-white p-2 shadow-lg">
      <Carousel
        setApi={setApi}
        className="group flex w-full flex-1 flex-col"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0 flex-1">
          {[1, 2, 3].map((num) => (
            <CarouselItem key={num} className="h-full pl-0">
              <div className="relative aspect-[21/9] h-full w-full overflow-hidden rounded-xl md:aspect-[3/1.2] lg:aspect-[3.5/1.2]">
                <Image
                  src={`/banner${num}.png`}
                  alt={`CPC1HN Banner ${num}`}
                  fill
                  className="object-cover transition-transform duration-700"
                  priority={num === 1}
                  sizes="(max-width: 768px) 100vw, 1280px"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons - Round white buttons with green arrows */}
        <div className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 md:flex">
          <CarouselPrevious className="text-primary-color static h-10 w-10 border-none bg-white/90 shadow-lg transition-all hover:bg-white" />
        </div>
        <div className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 md:flex">
          <CarouselNext className="text-primary-color static h-10 w-10 border-none bg-white/90 shadow-lg transition-all hover:bg-white" />
        </div>

        {/* Progress Bar at bottom */}
        <div className="absolute bottom-6 left-1/2 z-10 flex h-1.5 w-[60%] -translate-x-1/2 gap-1 rounded-full bg-slate-200/40 px-0.5">
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              className={`my-auto h-1 flex-1 rounded-full transition-all duration-700 ${i === current ? "bg-primary-color scale-y-125" : "bg-transparent opacity-0"}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
