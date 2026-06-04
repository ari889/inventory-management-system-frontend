"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterSelectOption = {
  value: string;
  label: string;
};

interface FormFieldSelectFilterProps {
  label: string;
  placeholder?: string;
  groupLabel?: string;
  options: FilterSelectOption[];
  value: string;
  onValueChange: (val: string) => void;
}

const FormFieldSelectFilter = ({
  label,
  placeholder = "Select option",
  groupLabel,
  options,
  value,
  onValueChange,
}: FormFieldSelectFilterProps) => {
  return (
    <Field className="flex flex-col gap-1.5">
      <FieldLabel className="text-sm font-medium leading-none">
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};

export default FormFieldSelectFilter;
