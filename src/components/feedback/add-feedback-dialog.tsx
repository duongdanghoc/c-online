"use client";

import { createFeedback } from "@/app/api/feedback";
import { BaseError } from "@/app/types/base-error";
import { CreateFeedbackDto } from "@/app/types/feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  feedbackId?: number;
  onSuccess?: () => void;
}

const AddFeedbackDialog = ({
  open,
  onOpenChange,
  productId,
  feedbackId,
  onSuccess,
}: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
    rate: 5,
  });

  const { mutate: submitFeedback, isPending } = useMutation({
    mutationFn: (dto: CreateFeedbackDto) => createFeedback(dto),
    onSuccess: () => {
      onOpenChange(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        content: "",
        rate: 5,
      });
      onSuccess?.();
    },
    onError: (error: BaseError) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.content.trim()
    ) {
      return;
    }

    submitFeedback({
      targetId: productId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      content: formData.content.trim(),
      rate: formData.rate,
      replyId: feedbackId,
    });
  };

  const handleRateChange = (rate: number) => {
    setFormData((prev) => ({ ...prev, rate }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm đánh giá</DialogTitle>
          <DialogDescription>
            Chia sẻ đánh giá của bạn về sản phẩm này
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!feedbackId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Đánh giá của bạn</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateChange(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={star <= formData.rate ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`size-6 ${
                        star <= formData.rate
                          ? "text-orange-400"
                          : "text-gray-300"
                      } transition-colors hover:text-orange-400`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Nhập email (không bắt buộc)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Nội dung đánh giá <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeedbackDialog;
