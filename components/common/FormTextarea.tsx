import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { TextareaHTMLAttributes } from "react";

interface FormTextareaProps<
  T extends FieldValues,
> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

const FormTextarea = <T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: FormTextareaProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <Textarea
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            value={field.value ?? ""}
            {...props}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormTextarea;
