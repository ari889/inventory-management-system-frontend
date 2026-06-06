"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomDatePickerProps {
  date?: string; // "yyyy-MM-dd"
  onChange: (date: string | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CustomDatePicker({
  date,
  onChange,
  label = "Date",
  placeholder = "Pick a date",
  className = "",
}: CustomDatePickerProps) {
  // Convert "yyyy-MM-dd" string → Date for the Calendar
  const selectedDate = date ? new Date(`${date}T00:00:00`) : undefined;

  const handleSelect = (picked: Date | undefined) => {
    if (!picked) {
      onChange(undefined);
      return;
    }
    // Format to "yyyy-MM-dd" without timezone shift
    const formatted = format(picked, "yyyy-MM-dd");
    onChange(formatted);
  };

  return (
    <Field className={`flex flex-col gap-1.5 ${className}`}>
      <FieldLabel
        htmlFor="date-picker"
        className="text-sm font-medium leading-none"
      >
        {label}
      </FieldLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />

            {date ? (
              <span className="flex flex-1 items-center justify-between">
                {format(new Date(`${date}T00:00:00`), "LLL dd, yyyy")}
                <X
                  className="h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(undefined);
                  }}
                />
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
