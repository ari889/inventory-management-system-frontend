import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SelectOption = {
  value: string | number | boolean;
  label: string;
};

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  data: SelectOption[];
}

const CustomSelect = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  data = [],
}: CustomSelectProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Select
            value={String(field.value ?? "")} // convert current value to string for UI
            onValueChange={(val) => {
              // map string back to original type
              const original = data.find(
                (item) => String(item.value) === val,
              )?.value;
              field.onChange(original);
            }}
            disabled={disabled}
          >
            <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {data.map((item, index) => (
                  <SelectItem value={String(item.value)} key={index}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CustomSelect;
