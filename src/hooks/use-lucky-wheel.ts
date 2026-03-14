import {
  LuckyWheelGift,
  LuckyWheelSegment,
  spinLuckyWheel,
} from "@/app/api/lucky-wheel";
import React from "react";
import { toast } from "sonner";

export const useWheelSlices = (segments: LuckyWheelSegment[]) => {
  const sortedSegments = React.useMemo(
    () => [...segments].sort((a, b) => a.segmentOrder - b.segmentOrder),
    [segments]
  );

  const slices = React.useMemo(() => {
    const count = Math.max(sortedSegments.length, 1);
    const anglePerSlice = 360 / count;
    const fallbackPalette = [
      "#0A7ACA",
      "#87D068",
      "#FA8C16",
      "#13C2C2",
      "#F759AB",
      "#9254DE",
    ];

    const pickColor = (raw: string | undefined, index: number) => {
      if (!raw) return fallbackPalette[index % fallbackPalette.length];
      if (raw.toLowerCase().includes("gradient")) {
        const firstStop = raw.match(
          /(#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\))/
        )?.[1];
        return firstStop ?? fallbackPalette[index % fallbackPalette.length];
      }
      return raw;
    };

    return sortedSegments.map((segment, index) => {
      const startAngle = anglePerSlice * index;
      const endAngle = startAngle + anglePerSlice;
      const midAngle = startAngle + anglePerSlice / 2;

      return {
        ...segment,
        startAngle,
        endAngle,
        midAngle,
        color: pickColor(segment.colorCode, index),
      };
    });
  }, [sortedSegments]);

  const gradient = React.useMemo(
    () =>
      slices
        .map(
          (slice) =>
            `${slice.color} ${slice.startAngle}deg ${slice.endAngle}deg`
        )
        .join(", "),
    [slices]
  );

  return { slices, gradient };
};

interface UseWheelSpinOptions {
  wheelId: string;
  spinTime: number;
  slices: Array<
    LuckyWheelSegment & {
      startAngle: number;
      endAngle: number;
      midAngle: number;
      color: string;
    }
  >;
}

export const useWheelSpin = ({
  wheelId,
  spinTime,
  slices,
}: UseWheelSpinOptions) => {
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const [result, setResult] = React.useState<LuckyWheelGift | null>(null);
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);

  const handleSpin = React.useCallback(async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    try {
      const { data: gift, error } = await spinLuckyWheel(wheelId);

      console.log(error);

      if (error?.code == 401) {
        setIsAuth(false);
        setIsSpinning(false);
        return;
      }

      if (error || !gift) {
        toast.error(
          error?.message || "Có lỗi xảy ra khi quay. Vui lòng thử lại!"
        );
        setIsSpinning(false);
        return;
      }

      const winningSegment = slices.find((s) => s.id === gift.segmentId);
      if (!winningSegment) {
        setIsSpinning(false);
        return;
      }

      const normalizedRotation = rotation % 360;
      let additionalRotation = -winningSegment.midAngle - normalizedRotation;

      if (additionalRotation > 0) {
        additionalRotation -= 360;
      }

      const fullRotations = 5 + Math.floor(Math.random() * 3);
      const finalRotation = rotation + fullRotations * 360 + additionalRotation;

      setRotation(finalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setResult(gift);
      }, spinTime);
    } catch (err) {
      console.error("Spin error:", err);
      setIsSpinning(false);
      toast.error("Có lỗi xảy ra khi quay. Vui lòng thử lại!");
    }
  }, [isSpinning, wheelId, slices, rotation, spinTime]);

  return { isSpinning, rotation, result, isAuth, handleSpin, setResult };
};
