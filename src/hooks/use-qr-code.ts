import QRCode from "qrcode";
import React from "react";

export const useQRCode = (code: string | null | undefined) => {
  const [qrImageSrc, setQrImageSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    if (!code) {
      setQrImageSrc(null);
      return () => {
        active = false;
      };
    }

    QRCode.toDataURL(code, { width: 240, margin: 1 })
      .then((url) => {
        if (active) setQrImageSrc(url);
      })
      .catch((err) => {
        console.error("QR generate error", err);
        if (active) setQrImageSrc(null);
      });

    return () => {
      active = false;
    };
  }, [code]);

  return qrImageSrc;
};
