import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";

interface FormFieldFilterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormFieldFilter = ({
  label,
  id,
  ...inputProps
}: FormFieldFilterProps) => {
  return (
    <Field className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} className="text-sm font-medium leading-none">
        {label}
      </FieldLabel>
      <Input id={id} {...inputProps} />
    </Field>
  );
};

export default FormFieldFilter;
