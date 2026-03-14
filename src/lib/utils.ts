import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(price);
}

export const formatDate = (
  date: string | Date | number,
  formatType: string
): string => {
  return dayjs(date.toString()).format(formatType);
};

export function getImageUrl(src: string, width: number, quality?: number) {
  const params = [`${width}x0`, `filters:quality(${quality || 90})`];
  const path = `${params.join("/")}/${src}`.replace("//", "/");

  const url = process.env.NEXT_PUBLIC_THUMBOR_URL;
  return `${url}/${path}`;
}

export function normalizeUrl(rawUrl: string): string {
  const url = new URL(rawUrl);

  url.pathname = url.pathname.replace(/\/{2,}/g, "/");
  return url.toString();
}

export function durationToTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  if (hours === 0) {
    return `${`${minutes}`.padStart(2, "0")}:${`${sec}`.padStart(2, "0")}`;
  }

  return `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}:${`${sec}`.padStart(2, "0")}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
