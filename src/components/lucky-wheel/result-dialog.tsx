"use client";

import { LuckyWheelGift } from "@/app/api/lucky-wheel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import React from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";

interface ResultDialogProps {
  result: LuckyWheelGift | null;
  qrImageSrc: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResultDialog = ({
  result,
  qrImageSrc,
  open,
  onOpenChange,
}: ResultDialogProps) => {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const rawFrameSrc = result?.giftDefinition.framePath;
  const frameImageSrc = rawFrameSrc
    ? `/api/image-proxy?src=${encodeURIComponent(rawFrameSrc)}`
    : null;
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyCode = React.useCallback(async () => {
    if (result?.giftCode) {
      try {
        await navigator.clipboard.writeText(result.giftCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code: ", err);
      }
    }
  }, [result?.giftCode]);

  const downloadFramedImage = React.useCallback(async () => {
    if (!frameRef.current || !qrImageSrc || !frameImageSrc) return;

    try {
      const canvas = await html2canvas(frameRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll("img");
          images.forEach((img) => {
            if (img.loading === "lazy") {
              img.loading = "eager";
            }
          });
        },
      });

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Không thể tạo file ảnh. Vui lòng thử lại.");
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${result?.giftDefinition.name || "gift"}-frame.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => URL.revokeObjectURL(url), 100);
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Download error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Không thể tạo ảnh tải xuống. Vui lòng thử lại."
      );
    }
  }, [frameImageSrc, qrImageSrc, result?.giftDefinition.name]);

  return (
    <Dialog open={open && Boolean(result)} onOpenChange={onOpenChange}>
      <DialogContent className="to-primary/80 max-w-md overflow-hidden rounded-xl border-0 bg-gradient-to-b from-white p-0 text-center shadow-xl">
        <div className="relative flex flex-col gap-4 p-6">
          <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl">
            🎉
          </div>
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-primary text-2xl font-bold">
              Chúc mừng!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              {result
                ? `Bạn đã trúng phần quà: ${result.giftDefinition.name}`
                : "Bạn đã quay trúng một phần quà."}
            </DialogDescription>
          </DialogHeader>
          {result?.giftCode ? (
            <div className="border-primary/40 flex items-center justify-between gap-4 rounded-lg border border-dashed bg-white/70 px-4 py-3 text-sm shadow-sm">
              <div className="text-left">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Mã quà
                </p>
                <p className="text-primary text-lg font-semibold">
                  {result.giftCode}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary/70 hover:bg-primary/10 hover:text-primary h-8 w-8"
                onClick={handleCopyCode}
                title="Sao chép mã quà"
              >
                {isCopied ? (
                  <MdCheck className="h-4 w-4" />
                ) : (
                  <MdContentCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : null}
          {frameImageSrc ? (
            <div className="space-y-3 rounded-xl bg-white/70 shadow-inner">
              <div
                ref={frameRef}
                className="bg-muted relative mx-auto aspect-[3/1] w-full max-w-2xl overflow-hidden rounded-lg border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frameImageSrc}
                  alt="Frame"
                  crossOrigin="anonymous"
                  className="absolute inset-0 z-0 h-full w-full object-cover"
                />
                {qrImageSrc ? (
                  <div className="relative z-50 aspect-square h-full p-3">
                    <div className="aspect-square h-full w-full overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrImageSrc}
                        alt="QR code"
                        crossOrigin="anonymous"
                        className="h-full w-full object-fill"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <DialogFooter className="flex justify-center pt-2">
            <div className="flex justify-end gap-4">
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
              {rawFrameSrc && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={downloadFramedImage}
                  disabled={!qrImageSrc}
                  className="min-w-[120px]"
                >
                  Lưu quà tặng
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
