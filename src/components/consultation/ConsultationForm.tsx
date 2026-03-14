"use client";

import { createConsultation } from "@/app/api/consultation";
import { BaseError } from "@/app/types/base-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

const formSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ và tên hợp lệ"),
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
  question: z.string().trim().min(10, "Câu hỏi cần tối thiểu 10 ký tự"),
});

type ConsultationFormValues = z.infer<typeof formSchema>;

interface ConsultationFormProps {
  productSlug?: string;
  className?: string;
}

const ConsultationForm = ({
  productSlug,
  className,
}: ConsultationFormProps) => {
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      question: "",
    },
  });

  const { mutate, isPending } = useMutation<
    void,
    BaseError,
    ConsultationFormValues
  >({
    mutationFn: async (values) => {
      await createConsultation({
        name: values.name.trim(),
        phone: values.phone.trim(),
        question: values.question.trim(),
        productSlug,
      });
    },
    onSuccess: () => {
      toast.success(
        "Câu hỏi của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm nhất!"
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error?.message || "Không thể gửi câu hỏi, vui lòng thử lại sau."
      );
    },
  });

  const onSubmit = (values: ConsultationFormValues) => {
    mutate(values);
  };

  return (
    <div
      id="consultation-form"
      className={cn(
        "grid grid-cols-2 gap-12 rounded-xl bg-white p-4 shadow-xs lg:grid-cols-3",
        className
      )}
    >
      <div className="hidden lg:block">
        <Image
          src="/icons/contact_banner.jpg"
          alt="Consultation"
          width={512}
          height={512}
          className="h-full w-full"
        />
      </div>
      <div className="relative col-span-2">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Gửi câu hỏi cho CPC1 Hà Nội
          </h2>
          <p className="text-muted-foreground text-sm">
            Để lại thông tin và câu hỏi, đội ngũ tư vấn sẽ liên hệ hỗ trợ bạn
            trong thời gian sớm nhất.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-full lg:col-span-1">
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-full lg:col-span-1">
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Ví dụ: 0912345678"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Câu hỏi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Nội dung câu hỏi..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full flex justify-center">
              <Button
                type="submit"
                className="w-full lg:w-1/2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi câu hỏi"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ConsultationForm;
