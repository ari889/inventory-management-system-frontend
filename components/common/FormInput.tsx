import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { InputHTMLAttributes } from "react";

interface FormInputProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  decimalScale?: number;
}

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  decimalScale,
  ...props
}: FormInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            type={props.type}
            step={props.type === "number" ? (props.step ?? "any") : undefined}
            onChange={(e) => {
              const value = e.target.value;

              if (props.type === "number") {
                if (value === "") {
                  field.onChange("");
                  return;
                }

                if (decimalScale !== undefined) {
                  const regex = new RegExp(
                    `^\\d*(\\.\\d{0,${decimalScale}})?$`,
                  );

                  if (!regex.test(value)) return;
                }

                field.onChange(value);
                return;
              }
              field.onChange(value);
            }}
            value={field.value ?? ""}
            {...props}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormInput;
