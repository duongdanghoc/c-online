"use client";
import { Button } from "@/components/ui/button";
import React, { lazy } from "react";

import { updateUserInfo } from "@/app/api/user";
import { userInfoQueryKey } from "@/app/api/user-queries";
import { UserInfo } from "@/app/types/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toastSuccessOption } from "@/lib/toaster";
import { cn, formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const DateCalendar = lazy(() =>
  import("@mui/x-date-pickers/DateCalendar").then((module) => ({
    default: module.DateCalendar,
  }))
);

const FormSchema = z.object({
  dob: z.date().optional(),
  fullName: z.string().nonempty({ message: "Vui lòng nhập họ tên" }),
  gender: z.enum(["Nam", "Nữ"]).optional(),
});

interface Props {
  info: UserInfo;
  onClose: () => void;
  onUpdated: (newInfo: UserInfo) => void;
}

const UpdateInfoView = ({ info, onClose, onUpdated }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: async () => {
      let date = undefined;
      if (info.dateOfBirth) {
        date = dayjs(info.dateOfBirth).toDate();
      }
      return {
        fullName: info.fullName,
        gender: info.gender as "Nam" | "Nữ",
        dob: date,
      };
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      await updateUserInfo({
        phoneNumber: info.phoneNumber,
        fullName: data.fullName,
        dateOfBirth: data.dob?.toISOString(),
        gender: data.gender,
      });

      return {
        phoneNumber: info.phoneNumber,
        fullName: data.fullName,
        dateOfBirth: data.dob?.toISOString(),
        gender: data.gender,
      };
    },
    onSuccess: (data) => {
      onUpdated(data);
      onClose();

      queryClient.invalidateQueries({ queryKey: userInfoQueryKey });
      toast.success("Cập nhật thông tin thành công", toastSuccessOption);
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data);
  }
  const [selectDate, setSelectDate] = React.useState(false);

  return (
    <div>
      <h2>Cập nhật thông tin</h2>
      <div className="container mx-auto mt-8 flex w-full max-w-[500px] flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="h-12 w-full rounded-xl border p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="">Giới tính</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center"
                    >
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="Nam" />
                        </FormControl>
                        <FormLabel className="font-normal">Nam</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="Nữ" />
                        </FormControl>
                        <FormLabel className="font-normal">Nữ</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover open={selectDate} onOpenChange={setSelectDate}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isLoading}
                          variant={"outline"}
                          className={cn(
                            "h-12 w-full rounded-xl border p-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value, "DD/MM/YYYY")
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="h-fit w-auto p-0" align="start">
                      <DateCalendar
                        defaultValue={field.value && dayjs(field.value)}
                        onChange={(date, state) => {
                          field.onChange(date?.toDate());
                          if (state === "finish") {
                            setSelectDate(false);
                          }
                        }}
                        showDaysOutsideCurrentMonth
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                disabled={isLoading}
                className="rounded-full"
                variant={"outline"}
                onClick={onClose}
              >
                Bỏ qua
              </Button>
              <Button
                className="rounded-full"
                onClick={() => {}}
                type="submit"
                disabled={isLoading}
              >
                Lưu thông tin
                {isLoading && <Loader2 className="ml-2 h-6 w-6 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateInfoView;
