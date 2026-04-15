"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { InputHTMLAttributes, ReactNode } from "react";

interface FormInputGroupProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  decimalScale?: number;

  // ✅ Addon props
  addon?: ReactNode;
  onAddonClick?: () => void;
  addonAlign?: "inline-start" | "inline-end";
}

const FormInputGroup = <T extends FieldValues>({
  control,
  name,
  label,
  decimalScale,
  addon,
  onAddonClick,
  addonAlign = "inline-end",
  ...props
}: FormInputGroupProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <InputGroup>
            <InputGroupInput
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              type={props.type}
              step={props.type === "number" ? (props.step ?? "any") : undefined}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                if (props.type === "number") {
                  if (value === "") {
                    field.onChange("");
                    return;
                  }

                  // ✅ Decimal controlled → keep string
                  if (decimalScale !== undefined) {
                    const regex = new RegExp(
                      `^\\d*(\\.\\d{0,${decimalScale}})?$`,
                    );
                    if (!regex.test(value)) return;

                    field.onChange(value);
                    return;
                  }

                  // ✅ No decimalScale → number
                  field.onChange(Number(value));
                  return;
                }

                field.onChange(value);
              }}
              {...props}
            />

            {addon && (
              <InputGroupAddon
                align={addonAlign}
                onClick={onAddonClick}
                className="cursor-pointer"
              >
                {addon}
              </InputGroupAddon>
            )}
          </InputGroup>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormInputGroup;
