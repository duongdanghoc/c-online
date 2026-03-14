import {
  FlashSaleSection,
  FlashSaleStatus,
  getFSSectionStatus,
} from "@/app/types/flash-sale";
import { Skeleton } from "@mui/material";
import dayjs from "dayjs";
import React, { memo, useEffect } from "react";

interface Props {
  section: FlashSaleSection;
}

const SectionStatusComp = ({ section }: Props) => {
  const [status, setStatus] = React.useState<FlashSaleStatus | null>(null);
  const [time, setTime] = React.useState<number | null>(0);

  useEffect(() => {
    calTime(section, status);
    const interval = setInterval(() => {
      calTime(section, status);
    }, 1000);

    return () => clearInterval(interval);
  }, [section, status]);

  const calTime = (
    section: FlashSaleSection,
    status: FlashSaleStatus | null
  ) => {
    if (status == FlashSaleStatus.UPCOMING) {
      const fromHour = dayjs(section.fromHour);
      const now = dayjs();
      setTime(fromHour.diff(now, "second"));
    }

    if (status == FlashSaleStatus.ONGOING) {
      const toHour = dayjs(section.toHour);
      const now = dayjs();
      setTime(toHour.diff(now, "second"));
    }

    if (status == FlashSaleStatus.ENDED) {
      setTime(0);
    }
  };

  useEffect(() => {
    setStatus(getFSSectionStatus(section));
  }, [section]);

  if (status == FlashSaleStatus.UPCOMING && time !== null) {
    return (
      <div className="flex items-center gap-4 text-lg font-semibold text-gray-700">
        Bắt đầu sau: <CountDownComp time={time > 0 ? time : 0} />
      </div>
    );
  }

  if (status == FlashSaleStatus.ONGOING && time !== null) {
    return (
      <div className="flex items-center gap-4 text-lg font-semibold text-gray-700">
        Kết thúc sau
        <CountDownComp time={time > 0 ? time : 0} />
      </div>
    );
  }

  if (status == FlashSaleStatus.ENDED) {
    return (
      <div className="text-lg font-semibold text-gray-700">Đã kết thúc</div>
    );
  }

  return (
    <div className="flex w-fit space-x-4">
      <Skeleton className="h-8 w-8 bg-gray-200" />
      <Skeleton className="h-8 w-8 bg-gray-200" />
      <Skeleton className="h-8 w-8 bg-gray-200" />
    </div>
  );
};

function CountDownComp({ time }: { time: number }) {
  const timerClass =
    "flex h-9 w-9 items-center justify-center bg-orange-500 text-white rounded-lg";
  return (
    <div className="flex items-center space-x-2">
      <div className={timerClass}>
        {Math.floor(time / 3600)
          .toString()
          .padStart(2, "0")}
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className={timerClass}>
        {Math.floor((time % 3600) / 60)
          .toString()
          .padStart(2, "0")}
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className={timerClass}>
        {Math.floor(time % 60)
          .toString()
          .padStart(2, "0")}
      </div>
    </div>
  );
}

export default memo(SectionStatusComp);
