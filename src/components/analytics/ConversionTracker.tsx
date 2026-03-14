"use client";

import { sendConversionEvent } from "@/lib/ga";
import { useEffect } from "react";

interface ConversionTrackerProps {
  transactionId?: string;
}

export default function ConversionTracker({
  transactionId,
}: ConversionTrackerProps) {
  useEffect(() => {
    sendConversionEvent(transactionId);
  }, [transactionId]);

  return null;
}
