import { FieldValues, UseFormSetError, Path } from "react-hook-form";

/**
 * Set API validation errors in React Hook Form
 * @param errors - Object returned from API, e.g. { name: "Name Required", email: "Invalid Email" }
 * @param setError - React Hook Form setError function
 */
export function setApiErrors<T extends FieldValues>(
  errors: Record<string, string>,
  setError: UseFormSetError<T>,
) {
  Object.entries(errors).forEach(([field, message]) => {
    setError(field as Path<T>, { type: "manual", message });
  });
}
