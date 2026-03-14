"use client";

import { LuckyWheel, LuckyWheelSegment } from "@/app/api/lucky-wheel";
import classNames from "classnames";
import Image from "next/image";

interface WheelSpinnerProps {
  wheel: LuckyWheel;
  slices: Array<
    LuckyWheelSegment & {
      startAngle: number;
      endAngle: number;
      midAngle: number;
      color: string;
    }
  >;
  gradient: string;
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
}

export const WheelSpinner = ({
  wheel,
  slices,
  gradient,
  rotation,
  isSpinning,
  onSpin,
}: WheelSpinnerProps) => {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center lg:h-full">
      <Image
        src={wheel.frameImagePath || ``}
        fill
        sizes="100%"
        alt={wheel.name}
        className="z-20"
      />
      <div
        className="absolute h-2/3 w-2/3 overflow-hidden rounded-full transition-transform"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? `${wheel.spinTime}ms` : "0ms",
          transitionTimingFunction: isSpinning
            ? "cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "ease",
        }}
      >
        {wheel.bgImagePath && wheel.onlyBackground ? (
          <div className="absolute inset-0 rounded-full">
            <Image
              src={wheel.bgImagePath}
              alt={wheel.name}
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${gradient})`,
              }}
            />

            {slices.map((slice) => {
              const isFlipped = slice.midAngle >= 90 && slice.midAngle <= 270;

              return (
                <div
                  key={slice.id}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${slice.midAngle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-[6%] left-1/2 flex items-center justify-center rounded-full text-[11px] font-semibold text-gray-800 sm:text-xs"
                    style={{
                      transform: isFlipped
                        ? `translate(-50%, 0) rotate(180deg)`
                        : `translate(-50%, 0)`,
                    }}
                  >
                    {slice.imagePath ? (
                      <>
                        <Image
                          src={slice.imagePath}
                          alt={slice.title}
                          width={44}
                          height={44}
                          className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                          style={{
                            transform: isFlipped ? "rotate(180deg)" : "none",
                          }}
                        />
                        <span className="sr-only">{slice.title}</span>
                      </>
                    ) : (
                      <span
                        className="text-md max-w-[80px] origin-center text-center leading-tight break-words [write-mode:vertical-rl] sm:max-w-[100px] lg:text-lg"
                        style={{
                          transform: isFlipped ? "rotate(180deg)" : "none",
                        }}
                      >
                        {slice.title}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div
        onClick={onSpin}
        className={classNames({
          "absolute z-30 rounded-full": true,
          "opacity-55": isSpinning,
        })}
        style={{
          width: `${(wheel.centerSize * 2) / 3}%`,
          height: `${(wheel.centerSize * 2) / 3}%`,
        }}
      >
        <Image
          src={wheel.centerImagePath}
          alt={wheel.name}
          fill
          className="rounded-full object-contain"
          priority
        />
      </div>
    </div>
  );
};
