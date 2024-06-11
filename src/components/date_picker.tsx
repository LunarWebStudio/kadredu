"use client"

import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import type { DayPickerSingleProps } from "react-day-picker";

interface DatePickerProps extends DayPickerSingleProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({
  date,
  setDate,
  ...props
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ru }) : <span>Выберите дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={date}
          onSelect={(date) => setDate(date)}
          {...props}
          mode="single"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

