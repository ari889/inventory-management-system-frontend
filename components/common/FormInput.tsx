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
}

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
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
            onChange={(e) =>
              field.onChange(
                props.type === "number"
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
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
