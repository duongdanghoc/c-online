"use client";

import { LuckyWheel, LuckyWheelSegment } from "@/app/api/lucky-wheel";
import LoginView from "@/components/login/login-view";
import { ResultDialog } from "@/components/lucky-wheel/result-dialog";
import { WheelSpinner } from "@/components/lucky-wheel/wheel-spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useWheelSlices, useWheelSpin } from "@/hooks/use-lucky-wheel";
import { useQRCode } from "@/hooks/use-qr-code";
import { useLogin } from "@/store/login-store";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

interface WheelViewProps {
  wheel: LuckyWheel;
  segments: LuckyWheelSegment[];
}

const WheelView = ({ wheel, segments }: WheelViewProps) => {
  const { slices, gradient } = useWheelSlices(segments);
  const { isSpinning, rotation, result, handleSpin, setResult, isAuth } =
    useWheelSpin({
      wheelId: wheel.id,
      spinTime: wheel.spinTime,
      slices,
    });
  const { reset } = useLogin();

  const [showResultDialog, setShowResultDialog] = React.useState(false);
  const qrImageSrc = useQRCode(result?.giftCode);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  React.useEffect(() => {
    if (result) {
      setShowResultDialog(true);
    }
  }, [result]);

  const handleDialogChange = React.useCallback(
    (open: boolean) => {
      setShowResultDialog(open);
      if (!open) {
        setResult(null);
      }
    },
    [setResult]
  );

  if (!segments.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
        Không có phần thưởng nào cho vòng quay này.
      </div>
    );
  }

  return (
    <div className="relative">
      {isAuth == false && (
        <div className="absolute top-0 right-0 bottom-0 left-0 z-[40] flex flex-col items-center justify-center bg-black/50">
          <div className="text-white">Bạn cần đăng nhập để quay vòng quay</div>
          <Dialog open={showLoginDialog}>
            <DialogTrigger asChild>
              <div
                className="bg-primary mt-8 flex w-fit cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-semibold text-white"
                onClick={() => {
                  setShowLoginDialog(true);
                  reset();
                }}
              >
                <div className="">Đăng nhập ngay</div>
              </div>
            </DialogTrigger>
            <DialogContent
              className="w-[95%] rounded-xl sm:max-w-[425px]"
              hideCloseButton={true}
            >
              <LoginView
                onLoginSuccess={() => {
                  setShowLoginDialog(false);
                  window.location.reload();
                }}
              />

              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="z-50 h-8 w-8"
                  onClick={() => setShowLoginDialog(false)}
                >
                  <MdOutlineClose
                    className="h-6 w-6"
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <WheelSpinner
        wheel={wheel}
        slices={slices}
        gradient={gradient}
        rotation={rotation}
        isSpinning={isSpinning}
        onSpin={handleSpin}
      />
      <ResultDialog
        result={result}
        qrImageSrc={qrImageSrc}
        open={showResultDialog}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
};

export default WheelView;
