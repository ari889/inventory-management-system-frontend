"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
} from "../ui/select";

export type SelectOption = {
  value: string | number | boolean;
  label: string;
};

export type SelectGroupOption = {
  label: string;
  options: SelectOption[];
  separator?: boolean;
};

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  placeholder?: string;

  /** Simple select */
  data?: SelectOption[];

  /** Grouped select */
  groups?: SelectGroupOption[];
}

const CustomSelect = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  placeholder = "Select option",
  data = [],
  groups = [],
}: CustomSelectProps<T>) => {
  const isGrouped = groups.length > 0;

  const findOriginalValue = (val: string) => {
    if (isGrouped) {
      for (const group of groups) {
        const found = group.options.find((item) => String(item.value) === val);
        if (found) return found.value;
      }
      return undefined;
    }

    return data.find((item) => String(item.value) === val)?.value;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Select
            value={String(field.value ?? "")}
            onValueChange={(val) => {
              const original = findOriginalValue(val);
              field.onChange(original);
            }}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {isGrouped ? (
                groups.map((group, index) => (
                  <div key={index}>
                    <SelectGroup>
                      <SelectLabel>{group.label}</SelectLabel>

                      {group.options.map((item, i) => (
                        <SelectItem key={i} value={String(item.value)}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>

                    {group.separator && <SelectSeparator />}
                  </div>
                ))
              ) : (
                <SelectGroup>
                  {data.map((item, index) => (
                    <SelectItem key={index} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CustomSelect;
