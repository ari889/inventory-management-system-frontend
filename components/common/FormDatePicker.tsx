import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
}

const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: FormDatePickerProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

          <Popover
            open={disabled ? false : open}
            onOpenChange={disabled ? undefined : setOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={name}
                disabled={disabled}
                className="w-48 justify-between font-normal"
              >
                {field.value ? format(field.value, "PPP") : "Select date"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value}
                captionLayout="dropdown"
                defaultMonth={field.value}
                onSelect={(date) => {
                  if (disabled) return;
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormDatePicker;
