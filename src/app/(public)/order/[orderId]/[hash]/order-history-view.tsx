"use client";
import { OrderProcessingHistory } from "@/app/types/order";
import DOMPurify from "isomorphic-dompurify";

interface Props {
  history: OrderProcessingHistory[];
}

const OrderHistoryView = ({ history }: Props) => {
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  return (
    <div className="rounded-xl bg-white p-4">
      <div className="font-semibold">Xử lí đơn hàng</div>

      <div className="mt-4">
        {history && history.length > 0 ? (
          <div className="relative ml-4 space-y-6 border-l border-gray-200 pl-6">
            {history.map((item) => (
              <div key={item.id} className="relative">
                <div className="bg-primary absolute -left-8 mt-1 h-4 w-4 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <time className="mb-1 text-xs text-gray-500">
                    {new Date(item.time).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  {item.content && (
                    <div
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(item.content),
                      }}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Chưa có thông tin lịch sử đơn hàng
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryView;
