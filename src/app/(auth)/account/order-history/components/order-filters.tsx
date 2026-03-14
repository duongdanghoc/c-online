import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { ORDER_QUICK_RANGE_OPTIONS } from "../constants";
import { OrderDateRange } from "../types";

type OrderFiltersProps = {
  dateRange: OrderDateRange;
  selectedPreset: number | null;
  normalizedFromISO: string;
  normalizedToISO: string;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
  onPresetChange: (days: number) => void;
};

const OrderFilters = ({
  dateRange,
  selectedPreset,
  normalizedFromISO,
  normalizedToISO,
  onFromDateChange,
  onToDateChange,
  onPresetChange,
}: OrderFiltersProps) => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))]">
        <DatePickerField
          label="Từ ngày"
          date={dateRange.from}
          onSelect={onFromDateChange}
        />
        <DatePickerField
          label="Đến ngày"
          date={dateRange.to}
          onSelect={onToDateChange}
        />
        <div className="col-span-full flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {ORDER_QUICK_RANGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  selectedPreset === option.value ? "default" : "outline"
                }
                size="sm"
                className="flex-1 whitespace-nowrap"
                onClick={() => onPresetChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Dữ liệu hiển thị từ{" "}
        <span className="font-medium text-slate-900">
          {dayjs(normalizedFromISO).format("DD/MM/YYYY")}
        </span>{" "}
        đến{" "}
        <span className="font-medium text-slate-900">
          {dayjs(normalizedToISO).format("DD/MM/YYYY")}
        </span>
      </p>
    </div>
  );
};

type DatePickerFieldProps = {
  label: string;
  date: Date;
  onSelect: (date?: Date) => void;
};

const DatePickerField = ({ label, date, onSelect }: DatePickerFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-slate-500 uppercase">
        {label}
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-slate-500"
            )}
          >
            <CalendarIcon className="size-4 text-slate-500" />
            {dayjs(date).format("DD/MM/YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrderFilters;
