"use client";

import { trackViewContent } from "@/lib/tiktok";
import { useEffect } from "react";

interface TikTokViewContentProps {
  contentId: string;
  contentName: string;
  value?: number;
}

/**
 * Component này track TikTok ViewContent event khi người dùng xem trang sản phẩm
 * Render component này trong product page để tự động fire event
 */
export default function TikTokViewContent({
  contentId,
  contentName,
  value,
}: TikTokViewContentProps) {
  useEffect(() => {
    trackViewContent({
      contents: [
        {
          content_id: contentId,
          content_type: "product",
          content_name: contentName,
        },
      ],
      value,
    });
  }, [contentId, contentName, value]);

  return null;
}
