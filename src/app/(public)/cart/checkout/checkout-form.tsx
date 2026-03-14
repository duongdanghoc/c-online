"use client";

import * as z from "zod";

import { PaymentMethod, fetchAddresses } from "@/app/api/checkout";
import Combobox from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./checkout-view";

interface Props {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const CheckoutForm = ({ form }: Props) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const cities = await fetchAddresses({});
      return cities;
    },
    staleTime: 60 * 60 * 1000,
  });

  const { data: wards } = useQuery({
    queryKey: ["wards", selectedProvince],
    queryFn: async () => {
      const wards = await fetchAddresses({
        city: selectedProvince ?? "",
        district: "",
      });
      return wards;
    },
    enabled: !!selectedProvince,
    staleTime: 60 * 60 * 1000,
  });

  const handleProvinceChange = (value: string) => {
    form.setValue("province", value);
    form.setValue("ward", "");
    setSelectedProvince(value);
  };

  return (
    <div className="rounded-xl bg-white p-4">
      <h2 className="mb-6 text-2xl font-bold">Thông tin đặt hàng</h2>

      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-gray-700">
                      Họ tên khách hàng
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập họ tên khách hàng" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-gray-700">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập số điện thoại" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Thông tin người nhận
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-gray-700">
                      Họ tên người nhận
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập họ tên người nhận" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientPhoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-gray-700">
                      Số điện thoại người nhận
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập số điện thoại người nhận"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Địa chỉ giao hàng
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-gray-700">
                      Tỉnh/Thành phố
                    </FormLabel>
                    <FormControl className="w-full">
                      <Combobox
                        placeholder="Chọn Tỉnh/Thành phố"
                        items={cities || []}
                        value={field.value}
                        onValueChange={handleProvinceChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-gray-700">
                      Phường/Xã
                    </FormLabel>
                    <FormControl className="w-full">
                      <Combobox
                        placeholder="Chọn Phường/Xã"
                        items={wards || []}
                        value={field.value}
                        onValueChange={(value) => {
                          form.setValue("ward", value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-normal text-gray-700">
                    Địa chỉ chi tiết
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Số nhà, tên đường, tòa nhà,..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-normal text-gray-700">
                  Ghi chú (Không bắt buộc)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Thông tin bổ sung về đơn hàng, yêu cầu đặc biệt khi giao hàng,..."
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-normal text-gray-700">
                  Phương thức thanh toán
                </FormLabel>
                <RadioGroup
                  defaultValue={field.value}
                  className="mb-4 flex flex-col gap-4"
                  {...field}
                  onValueChange={field.onChange}
                >
                  <div className="mt-1 flex items-center gap-3">
                    <RadioGroupItem value={PaymentMethod.COD} id="r1" />
                    <Label htmlFor="r1" className="flex items-center">
                      <Image
                        src={"/icons/money.png"}
                        alt="COD"
                        width={40}
                        height={40}
                      />
                      <div className="ms-2">Thanh toán khi nhận hàng (COD)</div>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={PaymentMethod.VNPAY} id="r2" />
                    <Label htmlFor="r2" className="flex items-center">
                      <Image
                        src={"/icons/vnpay.jpg"}
                        alt="VNPay"
                        width={40}
                        height={40}
                      />
                      <div className="ms-2">Thanh toán qua VNPay QR</div>
                    </Label>
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
